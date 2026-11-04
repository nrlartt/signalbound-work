// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {ExampleHook} from "../src/ExampleHook.sol";
import {Test} from "forge-std/Test.sol";

contract ExampleHookTest is Test {
    ExampleHook hook;
    IPoolManager poolManager;

    function setUp() public {
        poolManager = IPoolManager(address(0x1234));
        hook = new ExampleHookTestHarness(poolManager);
    }

    function testDeclaresBeforeSwapPermission() public {
        Hooks.Permissions memory permissions = hook.getHookPermissions();
        assert(permissions.beforeSwap);
        assert(!permissions.afterSwap);
        assert(!permissions.beforeInitialize);
        assert(!permissions.afterInitialize);
        assert(!permissions.beforeAddLiquidity);
        assert(!permissions.afterAddLiquidity);
        assert(!permissions.beforeRemoveLiquidity);
        assert(!permissions.afterRemoveLiquidity);
        assert(!permissions.beforeDonate);
        assert(!permissions.afterDonate);
    }
}

contract ExampleHookTestHarness is ExampleHook {
    constructor(IPoolManager poolManager) ExampleHook(poolManager) {}
    function validateHookAddress(BaseHook) internal pure override {}
}