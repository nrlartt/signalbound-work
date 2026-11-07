// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {BalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";

import {Test} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {ImmutableState} from "@uniswap/v4-periphery/src/base/ImmutableState.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {LPFeeLibrary} from "@uniswap/v4-core/src/libraries/LPFeeLibrary.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {BeforeSwapDelta} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {BalanceDeltaLibrary} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {TickMovementFeeHook} from "../src/TickMovementFeeHook.sol";

contract TickMovementFeeHookHarness is TickMovementFeeHook {
    int24 internal mockedTick;
    constructor(IPoolManager manager, address owner) TickMovementFeeHook(manager, owner, 100, 500, 3000) {}
    function validateHookAddress(BaseHook) internal pure override {}
    function setTick(int24 tick) external { mockedTick = tick; }
    function _currentTick(PoolKey calldata) internal view override returns (int24) { return mockedTick; }
    function preview(PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata hookData) external returns (bytes4, BeforeSwapDelta, uint24) {
        return _beforeSwap(address(this), key, params, hookData);
    }
    function complete(PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata hookData) external returns (bytes4, int128) {
        return _afterSwap(address(this), key, params, BalanceDeltaLibrary.ZERO_DELTA, hookData);
    }
}

contract TickMovementFeeHookTest is Test {
    address internal owner = address(0xA11CE);
    address internal stranger = address(0xB0B);
    TickMovementFeeHookHarness internal hook;
    PoolKey internal key;

    function setUp() public {
        hook = new TickMovementFeeHookHarness(IPoolManager(address(this)), owner);
        key = PoolKey({currency0: Currency.wrap(address(0)), currency1: Currency.wrap(address(1)), fee: LPFeeLibrary.DYNAMIC_FEE_FLAG, tickSpacing: 60, hooks: IHooks(address(hook))});
    }

    function test_permissionsMatchCallbacks() public view {
        Hooks.Permissions memory permissions = hook.getHookPermissions();
        assertTrue(permissions.beforeSwap); assertTrue(permissions.afterSwap);
        assertFalse(permissions.beforeSwapReturnDelta); assertFalse(permissions.afterSwapReturnDelta);
    }

    function test_firstSwapUsesNormalFeeAndRecordsMovementOnlyAfterCompletion() public {
        hook.setTick(10);
        (, , uint24 fee) = hook.preview(key, _params(true, -1 ether), "");
        assertEq(fee, uint24(500) | LPFeeLibrary.OVERRIDE_FEE_FLAG);
        (, uint24 movement, bool initialized) = hook.movementState(key);
        assertFalse(initialized); assertEq(movement, 0);
        hook.setTick(125); hook.complete(key, _params(true, -1 ether), "");
        (int24 referenceTick, uint24 recorded, bool ready) = hook.movementState(key);
        assertTrue(ready); assertEq(referenceTick, 125); assertEq(recorded, 115);
    }

    function test_largePreviousMovementUsesElevatedFee() public {
        _completeMovement(0, 101);
        (, , uint24 fee) = hook.preview(key, _params(false, 2 ether), "");
        assertEq(fee, uint24(3000) | LPFeeLibrary.OVERRIDE_FEE_FLAG);
    }

    function test_thresholdMovementUsesNormalFee() public {
        _completeMovement(-50, 50);
        (, , uint24 fee) = hook.preview(key, _params(true, 2 ether), "");
        assertEq(fee, uint24(500) | LPFeeLibrary.OVERRIDE_FEE_FLAG);
    }

    function test_negativeMovementUsesAbsoluteValue() public {
        _completeMovement(80, -31);
        (, , uint24 fee) = hook.preview(key, _params(false, -2 ether), "");
        assertEq(fee, uint24(3000) | LPFeeLibrary.OVERRIDE_FEE_FLAG);
    }

    function test_staticFeePoolIsRejected() public {
        PoolKey memory staticKey = key; staticKey.fee = 3000;
        vm.expectRevert(TickMovementFeeHook.StaticFeePool.selector);
        hook.preview(staticKey, _params(true, -1 ether), "");
    }

    function test_completionRequiresStart() public {
        vm.expectRevert(TickMovementFeeHook.MissingSwapStart.selector);
        hook.complete(key, _params(true, -1 ether), "");
    }

    function test_ownerCanUpdatePolicy() public {
        vm.prank(owner); hook.setFeePolicy(25, 400, 2500);
        assertEq(hook.movementThreshold(), 25); assertEq(hook.normalFee(), 400); assertEq(hook.elevatedFee(), 2500);
    }

    function test_nonOwnerCannotUpdatePolicy() public {
        vm.prank(stranger);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, stranger));
        hook.setFeePolicy(25, 400, 2500);
    }

    function test_invalidPolicyIsRejected() public {
        vm.startPrank(owner);
        vm.expectRevert(TickMovementFeeHook.InvalidThreshold.selector); hook.setFeePolicy(0, 500, 3000);
        vm.expectRevert(TickMovementFeeHook.InvalidFeeRange.selector); hook.setFeePolicy(100, 3001, 3000);
        vm.expectRevert(TickMovementFeeHook.InvalidFeeRange.selector); hook.setFeePolicy(100, 500, 1_000_001);
        vm.stopPrank();
    }

    function test_directNonManagerCallIsRejected() public {
        vm.prank(stranger); vm.expectRevert(ImmutableState.NotPoolManager.selector);
        hook.beforeSwap(address(this), key, _params(true, -1 ether), "");
    }

    function _completeMovement(int24 start, int24 finish) internal {
        hook.setTick(start); hook.preview(key, _params(true, -1 ether), "");
        hook.setTick(finish); hook.complete(key, _params(true, -1 ether), "");
    }
    function _params(bool zeroForOne, int256 amount) internal pure returns (IPoolManager.SwapParams memory) {
        return IPoolManager.SwapParams({zeroForOne: zeroForOne, amountSpecified: amount, sqrtPriceLimitX96: 1});
    }
}
