// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {BeforeSwapDelta} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";

import "forge-std/Test.sol";
import {StartBlockGate} from "../src/StartBlockGate.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";

contract StartBlockGateTest is Test {
    StartBlockGate public hook;
    IPoolManager public poolManager;
    PoolKey public key;

    function setUp() public {
        poolManager = IPoolManager(address(0x1234));
        hook = new StartBlockGateTestHarness(100, poolManager);
        key = PoolKey({
            currency0: Currency.wrap(address(0x1111)),
            currency1: Currency.wrap(address(0x2222)),
            fee: 3000,
            tickSpacing: 10,
            hooks: IHooks(address(hook))
        });
    }

    function testRevertBeforeStartBlock() public {
        vm.roll(99);
        vm.prank(address(poolManager));
        vm.expectRevert(abi.encodeWithSelector(StartBlockGate.TooEarly.selector, 100, 99));
        hook.beforeSwap(address(0), key, IPoolManager.SwapParams(true, 1, 1), bytes(""));
    }

    function testSwapAtStartBlockSucceeds() public {
        vm.roll(100);
        vm.prank(address(poolManager));
        (bytes4 selector, , ) = hook.beforeSwap(address(0), key, IPoolManager.SwapParams(true, 1, 1), bytes(""));
        assertEq(selector, IHooks.beforeSwap.selector);
    }

    function testStartBlockZeroSwappableImmediately() public {
        StartBlockGate zeroHook = new StartBlockGateTestHarness(0, poolManager);
        vm.prank(address(poolManager));
        (bytes4 selector, , ) = zeroHook.beforeSwap(address(0), key, IPoolManager.SwapParams(true, 1, 1), bytes(""));
        assertEq(selector, IHooks.beforeSwap.selector);
    }

    function testDeclaredPermissionsMatch() public {
        Hooks.Permissions memory p = hook.getHookPermissions();
        assertTrue(p.beforeSwap);
        assertFalse(p.afterSwap);
        assertFalse(p.beforeDonate);
        assertFalse(p.afterDonate);
        assertFalse(p.beforeAddLiquidity);
        assertFalse(p.afterAddLiquidity);
        assertFalse(p.beforeRemoveLiquidity);
        assertFalse(p.afterRemoveLiquidity);
    }
}

contract StartBlockGateTestHarness is StartBlockGate {
    constructor(uint256 _startBlock, IPoolManager _poolManager) StartBlockGate(_startBlock, _poolManager) {}
    function validateHookAddress(BaseHook) internal pure override {}
}