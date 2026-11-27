// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";

contract MinRangeWidth is BaseHook {
    error NarrowRange(int24 width);

    constructor(IPoolManager poolManager) BaseHook(poolManager) {}

    function getHookPermissions() public pure override returns (Hooks.Permissions memory p) {
        p.beforeAddLiquidity = true;
    }

    function _beforeAddLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata params,
        bytes calldata
    )
        internal
        view
        override
        returns (bytes4)
    {
        int24 width = params.tickUpper - params.tickLower;
        if (width < 600) {
            revert NarrowRange(width);
        }
        return IHooks.beforeAddLiquidity.selector;
    }
}