// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {ImmutableState} from "@uniswap/v4-periphery/src/base/ImmutableState.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {GuardedSwapHook} from "../src/GuardedSwapHook.sol";

contract GuardedSwapHookHarness is GuardedSwapHook {
    constructor(IPoolManager manager, address initialOwner, uint256 initialMaximum)
        GuardedSwapHook(manager, initialOwner, initialMaximum)
    {}

    function validateHookAddress(BaseHook) internal pure override {}
}

contract GuardedSwapHookTest is Test {
    using BeforeSwapDeltaLibrary for BeforeSwapDelta;

    address internal owner = address(0xA11CE);
    address internal stranger = address(0xB0B);
    GuardedSwapHookHarness internal hook;
    PoolKey internal key;

    function setUp() public {
        hook = new GuardedSwapHookHarness(IPoolManager(address(this)), owner, 1_000 ether);
        key = PoolKey({
            currency0: Currency.wrap(address(0)),
            currency1: Currency.wrap(address(1)),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(address(hook))
        });
    }

    function testPermissionsMatchTheImplementedCallback() public view {
        Hooks.Permissions memory permissions = hook.getHookPermissions();
        assertTrue(permissions.beforeSwap);
        assertFalse(permissions.afterSwap);
        assertFalse(permissions.beforeSwapReturnDelta);
    }

    function testPoolManagerMayCallWithinTheLimit() public {
        (bytes4 selector, BeforeSwapDelta delta, uint24 feeOverride) = _callBeforeSwap(-100 ether);
        assertEq(selector, IHooks.beforeSwap.selector);
        assertEq(delta.getSpecifiedDelta(), 0);
        assertEq(delta.getUnspecifiedDelta(), 0);
        assertEq(feeOverride, 0);
    }

    function testExactOutputAmountUsesTheSameAbsoluteLimit() public {
        _callBeforeSwap(1_000 ether);
    }

    function testAmountAboveTheLimitReverts() public {
        vm.expectRevert(abi.encodeWithSelector(GuardedSwapHook.SwapAmountTooLarge.selector, 1_001 ether, 1_000 ether));
        _callBeforeSwap(-1_001 ether);
    }

    function testPausedHookRejectsSwaps() public {
        vm.prank(owner);
        hook.setPaused(true);
        vm.expectRevert(GuardedSwapHook.HookPaused.selector);
        _callBeforeSwap(-1 ether);
    }

    function testOnlyOwnerMayChangeTheGuard() public {
        vm.prank(stranger);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, stranger));
        hook.setMaximumSwapAmount(2_000 ether);
    }

    function testOwnerMayUpdateTheLimitButNotSetZero() public {
        vm.startPrank(owner);
        hook.setMaximumSwapAmount(2_000 ether);
        assertEq(hook.maximumSwapAmount(), 2_000 ether);
        vm.expectRevert(GuardedSwapHook.InvalidMaximum.selector);
        hook.setMaximumSwapAmount(0);
        vm.stopPrank();
    }

    function testDirectNonManagerCallIsRejected() public {
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -1 ether,
            sqrtPriceLimitX96: 1
        });
        vm.prank(stranger);
        vm.expectRevert(ImmutableState.NotPoolManager.selector);
        hook.beforeSwap(address(this), key, params, "");
    }

    function _callBeforeSwap(int256 amountSpecified)
        internal
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: amountSpecified,
            sqrtPriceLimitX96: 1
        });
        return hook.beforeSwap(address(this), key, params, "");
    }
}
