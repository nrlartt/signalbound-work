// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";

import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import "forge-std/Test.sol";
import {MinRangeWidth} from "../src/MinRangeWidth.sol";

contract MinRangeWidthTest is Test {
    MinRangeWidth public hook;
    IPoolManager public poolManager;

    function setUp() public {
        poolManager = IPoolManager(address(0));
        hook = new MinRangeWidthTestHarness(IPoolManager(address(poolManager)));
    }

    function testPermissionsOnlyBeforeAddLiquidity() public {
        Hooks.Permissions memory p = hook.getHookPermissions();
        assertTrue(p.beforeAddLiquidity, "beforeAddLiquidity must be enabled");
        assertFalse(p.beforeSwap, "beforeSwap must be disabled");
        assertFalse(p.afterSwap, "afterSwap must be disabled");
        assertFalse(p.beforeDonate, "beforeDonate must be disabled");
        assertFalse(p.afterDonate, "afterDonate must be disabled");
        assertFalse(p.beforeInitialize, "beforeInitialize must be disabled");
        assertFalse(p.afterInitialize, "afterInitialize must be disabled");
        assertFalse(p.afterAddLiquidity, "afterAddLiquidity must be disabled");
        assertFalse(p.beforeRemoveLiquidity, "beforeRemoveLiquidity must be disabled");
        assertFalse(p.afterRemoveLiquidity, "afterRemoveLiquidity must be disabled");
    }

    function testRevertsNarrowRange() public {
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0)),
            currency1: Currency.wrap(address(1)),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(address(0))
        });
        IPoolManager.ModifyLiquidityParams memory params = IPoolManager.ModifyLiquidityParams({
            tickLower: -240,
            tickUpper: 240,
            liquidityDelta: 1 ether,
            salt: 0
        });
        vm.expectPartialRevert(MinRangeWidth.NarrowRange.selector);
        vm.prank(address(poolManager));
        hook.beforeAddLiquidity(address(0), key, params, new bytes(0));
    }

    function testAllowsWidth600() public {
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0)),
            currency1: Currency.wrap(address(1)),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(address(0))
        });
        IPoolManager.ModifyLiquidityParams memory params = IPoolManager.ModifyLiquidityParams({
            tickLower: -300,
            tickUpper: 300,
            liquidityDelta: 1 ether,
            salt: 0
        });
        vm.prank(address(poolManager));
        bytes4 result = hook.beforeAddLiquidity(address(0), key, params, new bytes(0));
        assertEq(result, IHooks.beforeAddLiquidity.selector);
    }

    function testAllowsWidth1200() public {
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0)),
            currency1: Currency.wrap(address(1)),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(address(0))
        });
        IPoolManager.ModifyLiquidityParams memory params = IPoolManager.ModifyLiquidityParams({
            tickLower: -600,
            tickUpper: 600,
            liquidityDelta: 1 ether,
            salt: 0
        });
        vm.prank(address(poolManager));
        bytes4 result = hook.beforeAddLiquidity(address(0), key, params, new bytes(0));
        assertEq(result, IHooks.beforeAddLiquidity.selector);
    }
}

contract MinRangeWidthTestHarness is MinRangeWidth {
    constructor(IPoolManager poolManager) MinRangeWidth(poolManager) {}
    function validateHookAddress(BaseHook) internal pure override {}
}