// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {BeforeSwapDelta} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {DynamicFeeHook} from "../src/DynamicFeeHook.sol";
import {Test} from "forge-std/Test.sol";

contract DynamicFeeHookTest is Test {
    DynamicFeeHook public hook;
    address public constant POOL_MANAGER = address(0x1234);
    address public constant OTHER = address(0x5678);

    PoolKey public poolKey;
    IPoolManager.SwapParams public swapParams;

    function setUp() public {
        hook = new DynamicFeeHookTestHarness(address(POOL_MANAGER), 10, 100, 30);

        poolKey = PoolKey({
            currency0: Currency.wrap(address(0x1111)),
            currency1: Currency.wrap(address(0x2222)),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(address(hook))
        });

        swapParams = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: 1_000_000e18,
            sqrtPriceLimitX96: 0
        });
    }

    function test_declaresBeforeSwapPermission() public {
        Hooks.Permissions memory perms = hook.getHookPermissions();
        assertTrue(perms.beforeSwap, "beforeSwap permission must be declared");
        assertFalse(perms.afterSwap, "afterSwap must not be declared");
        assertFalse(perms.beforeInitialize, "beforeInitialize must not be declared");
        assertFalse(perms.afterInitialize, "afterInitialize must not be declared");
        assertFalse(perms.beforeAddLiquidity, "beforeAddLiquidity must not be declared");
        assertFalse(perms.afterAddLiquidity, "afterAddLiquidity must not be declared");
        assertFalse(perms.beforeRemoveLiquidity, "beforeRemoveLiquidity must not be declared");
        assertFalse(perms.afterRemoveLiquidity, "afterRemoveLiquidity must not be declared");
        assertFalse(perms.beforeDonate, "beforeDonate must not be declared");
        assertFalse(perms.afterDonate, "afterDonate must not be declared");
    }

    function test_constructorSetsFeeBounds() public {
        assertEq(hook.minFeeBps(), 10);
        assertEq(hook.maxFeeBps(), 100);
        assertEq(hook.defaultFeeBps(), 30);
    }

    function test_constructorRejectsMinAboveMax() public {
        vm.expectRevert(bytes("min fee exceeds max fee"));
        new DynamicFeeHookTestHarness(address(POOL_MANAGER), 100, 10, 30);
    }

    function test_constructorRejectsDefaultOutOfBounds() public {
        vm.expectRevert(bytes("default fee out of bounds"));
        new DynamicFeeHookTestHarness(address(POOL_MANAGER), 10, 100, 200);
    }

    function test_defaultFeeIsWithinBounds() public {
        assertTrue(hook.defaultFeeBps() >= hook.minFeeBps());
        assertTrue(hook.defaultFeeBps() <= hook.maxFeeBps());
    }
}

contract DynamicFeeHookTestHarness is DynamicFeeHook {
    constructor(address poolManager,
        uint24 _minFeeBps,
        uint24 _maxFeeBps,
        uint24 _defaultFeeBps) DynamicFeeHook(IPoolManager(poolManager), _minFeeBps, _maxFeeBps, _defaultFeeBps) {}

    function validateHookAddress(BaseHook) internal pure override {}
}