// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {BeforeSwapDelta} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {Test} from "forge-std/Test.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {CustomSwapHook} from "../src/CustomSwapHook.sol";

contract CustomSwapHookTest is Test {
    CustomSwapHookTestHarness hook;

    function setUp() public {
        hook = new CustomSwapHookTestHarness(IPoolManager(address(0x0000000000000000000000000000000000000000)));
    }

    function testDeclaresBeforeSwapPermission() public {
        Hooks.Permissions memory p = hook.getHookPermissions();
        assert(p.beforeSwap == true);
        assert(p.afterSwap == false);
        assert(p.beforeInitialize == false);
        assert(p.afterInitialize == false);
        assert(p.beforeAddLiquidity == false);
        assert(p.afterAddLiquidity == false);
        assert(p.beforeRemoveLiquidity == false);
        assert(p.afterRemoveLiquidity == false);
        assert(p.beforeDonate == false);
        assert(p.afterDonate == false);
    }

    function testBeforeSwapRejectsZeroAmount() public {
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: 0,
            sqrtPriceLimitX96: 0
        });

        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0)),
            currency1: Currency.wrap(address(0)),
            fee: 0,
            tickSpacing: 0,
            hooks: IHooks(address(0))
        });

        vm.expectRevert(CustomSwapHook.InvalidSwapParams.selector);
        hook.beforeSwapWrapper(msg.sender, key, params, bytes(""));
    }

    function testBeforeSwapRejectsInvalidSwapParams() public {
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: 0,
            sqrtPriceLimitX96: 0
        });

        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0)),
            currency1: Currency.wrap(address(0)),
            fee: 0,
            tickSpacing: 0,
            hooks: IHooks(address(0))
        });

        vm.expectRevert(CustomSwapHook.InvalidSwapParams.selector);
        hook.beforeSwapWrapper(msg.sender, key, params, bytes(""));
    }

    function testBeforeSwapReturnsExpectedValues() public {
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: 1,
            sqrtPriceLimitX96: 0
        });

        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0)),
            currency1: Currency.wrap(address(0)),
            fee: 0,
            tickSpacing: 0,
            hooks: IHooks(address(0))
        });

        (bytes4 selector, BeforeSwapDelta delta, uint24 fee) = hook.beforeSwapWrapper(msg.sender, key, params, bytes(""));

        assert(selector == IHooks.beforeSwap.selector);
        assert(BeforeSwapDeltaLibrary.getSpecifiedDelta(delta) == 0);
        assert(BeforeSwapDeltaLibrary.getUnspecifiedDelta(delta) == 0);
        assert(fee == 0);
    }
}

contract CustomSwapHookTestHarness is CustomSwapHook {
    constructor(IPoolManager poolManager) CustomSwapHook(poolManager) {}

    function validateHookAddress(BaseHook) internal pure override {}

    function beforeSwapWrapper(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    )
        public
        pure
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        return _beforeSwap(sender, key, params, hookData);
    }
}