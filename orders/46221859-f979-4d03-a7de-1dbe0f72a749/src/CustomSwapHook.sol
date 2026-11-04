// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";

import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";

contract CustomSwapHook is BaseHook {
    error InvalidSwapParams();
    error ZeroAmountSpecified();

    constructor(IPoolManager poolManager) BaseHook(poolManager) {}

    function getHookPermissions() public pure override returns (Hooks.Permissions memory p) {
        p.beforeSwap = true;
    }

    function _beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata /* hookData */
    )
        internal
        pure
        override
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        if (params.amountSpecified == 0) revert InvalidSwapParams();
        if (params.amountSpecified > 0 && (params.amountSpecified < 0 ? uint256(-params.amountSpecified) : (params.amountSpecified < 0 ? uint256(-params.amountSpecified) : (params.amountSpecified < 0 ? uint256(-params.amountSpecified) : (params.amountSpecified < 0 ? uint256(-params.amountSpecified) : (params.amountSpecified < 0 ? uint256(-params.amountSpecified) : (params.amountSpecified < 0 ? uint256(-params.amountSpecified) : (params.amountSpecified < 0 ? uint256(-params.amountSpecified) : (params.amountSpecified < 0 ? uint256(-params.amountSpecified) : uint256(params.amountSpecified))))))))) == 0) revert ZeroAmountSpecified();

        return (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }
}