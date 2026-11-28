// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import "forge-std/Test.sol";
import {ExactOutputOnly} from "../src/ExactOutputOnly.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {BeforeSwapDelta} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";

contract ExactOutputOnlyTest is Test {
    ExactOutputOnly public hook;
    IPoolManager public poolManager;
    PoolKey public key;

    function setUp() public {
        poolManager = IPoolManager(address(0));
        hook = new ExactOutputOnlyTestHarness(IPoolManager(address(poolManager)));
        key = PoolKey({
            currency0: Currency.wrap(address(0)),
            currency1: Currency.wrap(address(1)),
            fee: 3000,
            tickSpacing: 10,
            hooks: IHooks(address(0))
        });
    }

    function testExactOutputSucceeds() public {
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: 1_000_000,
            sqrtPriceLimitX96: 0
        });

        vm.prank(address(poolManager));
        (bytes4 selector, BeforeSwapDelta delta, uint24 fee) = hook.beforeSwap(
            address(0),
            key,
            params,
            new bytes(0)
        );

        assertTrue(selector == IHooks.beforeSwap.selector);
        assertTrue(BeforeSwapDelta.unwrap(delta) == 0);
        assertTrue(fee == 0);
    }

    function testExactInputReverts() public {
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -1_000_000,
            sqrtPriceLimitX96: 0
        });

        vm.prank(address(poolManager));
        vm.expectRevert(abi.encodeWithSelector(ExactOutputOnly.ExactInputForbidden.selector, -1_000_000));
        hook.beforeSwap(address(0), key, params, new bytes(0));
    }

    function testLiquidityAddIsPermitted() public {
        assertTrue(hook.getHookPermissions().beforeSwap);
    }

    function testPermissionWordIsBeforeSwapOnly() public {
        Hooks.Permissions memory p = hook.getHookPermissions();
        assertTrue(p.beforeSwap);
        assertFalse(p.afterSwap);
        assertFalse(p.beforeDonate);
        assertFalse(p.afterDonate);
        assertFalse(p.beforeInitialize);
        assertFalse(p.afterInitialize);
        assertFalse(p.beforeAddLiquidity);
        assertFalse(p.afterAddLiquidity);
        assertFalse(p.beforeRemoveLiquidity);
        assertFalse(p.afterRemoveLiquidity);
    }
}
contract ExactOutputOnlyTestHarness is ExactOutputOnly {
    constructor(IPoolManager poolManager) ExactOutputOnly(poolManager) {}
    function validateHookAddress(BaseHook) internal pure override {}
}