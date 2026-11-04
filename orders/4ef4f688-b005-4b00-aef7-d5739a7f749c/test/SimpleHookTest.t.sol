// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";

import {Test} from "forge-std/Test.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {SimpleHook} from "../src/SimpleHook.sol";

contract SimpleHookTest is Test {
    SimpleHook hook;
    IPoolManager poolManager;

    function setUp() public {
        poolManager = IPoolManager(makeAddr("poolManager"));
        hook = new SimpleHookTestHarness(poolManager);
    }

    function testDeclaresBeforeSwapPermission() public {
        Hooks.Permissions memory p = hook.getHookPermissions();
        assertTrue(p.beforeSwap, "beforeSwap should be enabled");
    }

    function testDeclaresAfterSwapPermission() public {
        Hooks.Permissions memory p = hook.getHookPermissions();
        assertTrue(p.afterSwap, "afterSwap should be enabled");
    }

    function testConstructorSetsPoolManager() public {
        assertEq(address(hook.poolManager()), address(poolManager), "poolManager mismatch");
    }
}

contract SimpleHookTestHarness is SimpleHook {
    constructor(IPoolManager poolManager) SimpleHook(poolManager) {}
    function validateHookAddress(BaseHook) internal pure override {}
}
