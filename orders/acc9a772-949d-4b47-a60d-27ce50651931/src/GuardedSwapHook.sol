// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";

/// @title GuardedSwapHook
/// @notice A beforeSwap hook with an owner-controlled emergency pause and an
/// absolute amount limit. It never changes the swap delta or overrides the fee.
contract GuardedSwapHook is BaseHook, Ownable {
    error HookPaused();
    error InvalidMaximum();
    error SwapAmountTooLarge(uint256 requested, uint256 maximum);

    event PauseUpdated(bool paused);
    event MaximumSwapAmountUpdated(uint256 previousMaximum, uint256 newMaximum);

    bool public paused;
    uint256 public maximumSwapAmount;

    constructor(IPoolManager manager, address initialOwner, uint256 initialMaximum)
        BaseHook(manager)
        Ownable(initialOwner)
    {
        if (initialMaximum == 0) revert InvalidMaximum();
        maximumSwapAmount = initialMaximum;
    }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory permissions) {
        permissions.beforeSwap = true;
    }

    function setPaused(bool nextPaused) external onlyOwner {
        paused = nextPaused;
        emit PauseUpdated(nextPaused);
    }

    function setMaximumSwapAmount(uint256 nextMaximum) external onlyOwner {
        if (nextMaximum == 0) revert InvalidMaximum();
        uint256 previous = maximumSwapAmount;
        maximumSwapAmount = nextMaximum;
        emit MaximumSwapAmountUpdated(previous, nextMaximum);
    }

    function _beforeSwap(
        address,
        PoolKey calldata,
        IPoolManager.SwapParams calldata params,
        bytes calldata
    ) internal view override returns (bytes4, BeforeSwapDelta, uint24) {
        if (paused) revert HookPaused();
        uint256 requested = params.amountSpecified < 0
            ? uint256(-(params.amountSpecified + 1)) + 1
            : (params.amountSpecified < 0 ? uint256(-params.amountSpecified) : (params.amountSpecified < 0 ? uint256(-params.amountSpecified) : uint256(params.amountSpecified)));
        if (requested > maximumSwapAmount) revert SwapAmountTooLarge(requested, maximumSwapAmount);
        return (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }
}
