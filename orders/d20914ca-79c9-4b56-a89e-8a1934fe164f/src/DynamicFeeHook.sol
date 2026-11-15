// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {BeforeSwapDelta} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";

/**
 * @title DynamicFeeHook
 * @dev A minimal Uniswap v4 beforeSwap hook that enforces a fixed bounded fee
 * override on every swap routed through the PoolManager.
 *
 * The hook declares only the beforeSwap permission so the PoolManager calls
 * _beforeSwap exactly once per swap. The fee is bounded between a minimum and
 * maximum basis-point value to prevent unbounded dynamic fees.
 */
contract DynamicFeeHook is BaseHook {
    // Fee bounds in basis points (1e4 = 100%).
    uint24 public immutable minFeeBps;
    uint24 public immutable maxFeeBps;

    // Default fee applied when no dynamic adjustment is computed.
    uint24 public immutable defaultFeeBps;

    constructor(
        IPoolManager poolManager,
        uint24 _minFeeBps,
        uint24 _maxFeeBps,
        uint24 _defaultFeeBps
    ) BaseHook(poolManager) {
        require(_minFeeBps <= _maxFeeBps, "min fee exceeds max fee");
        require(_defaultFeeBps >= _minFeeBps && _defaultFeeBps <= _maxFeeBps, "default fee out of bounds");
        minFeeBps = _minFeeBps;
        maxFeeBps = _maxFeeBps;
        defaultFeeBps = _defaultFeeBps;
    }

    /**
     * @dev Declares only the beforeSwap callback permission. The PoolManager
     * reads this from the hook address and invokes _beforeSwap for each swap.
     */
    function getHookPermissions() public pure virtual override returns (Hooks.Permissions memory p) {
        p.beforeSwap = true;
    }

    /**
     * @dev Internal beforeSwap override. Enforces a bounded fee override.
     * Returns the beforeSwap selector so PoolManager knows the hook handled it,
     * a zero delta (no balance adjustments), and the bounded fee in basis points.
     */
    function _beforeSwap(
        address sender,
        PoolKey calldata poolKey,
        IPoolManager.SwapParams calldata params,
        bytes calldata /* hookData */
    )
        internal
        view
        override
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        uint24 feeBps = defaultFeeBps;

        // Clamp the fee to the declared bounds (bounded dynamic fee override).
        if (feeBps < minFeeBps) {
            feeBps = minFeeBps;
        }
        if (feeBps > maxFeeBps) {
            feeBps = maxFeeBps;
        }

        return (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, feeBps);
    }
}