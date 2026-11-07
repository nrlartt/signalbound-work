// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {LPFeeLibrary} from "@uniswap/v4-core/src/libraries/LPFeeLibrary.sol";
import {StateLibrary} from "@uniswap/v4-core/src/libraries/StateLibrary.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/src/types/PoolId.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {BalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";

contract TickMovementFeeHook is BaseHook, Ownable {
    using LPFeeLibrary for uint24;
    using PoolIdLibrary for PoolKey;

    uint24 public constant MAX_LP_FEE = 1_000_000;
    struct MovementState { int24 startTick; int24 referenceTick; uint24 lastMovement; bool pending; bool initialized; }

    error StaticFeePool();
    error InvalidThreshold();
    error InvalidFeeRange();
    error MissingSwapStart();

    event FeePolicyUpdated(uint24 threshold, uint24 normalFee, uint24 elevatedFee);
    event SwapMovementRecorded(bytes32 indexed poolId, int24 referenceTick, uint24 absoluteMovement);

    uint24 public movementThreshold;
    uint24 public normalFee;
    uint24 public elevatedFee;
    mapping(PoolId => MovementState) internal movementByPool;

    constructor(IPoolManager manager, address initialOwner, uint24 initialThreshold, uint24 initialNormalFee, uint24 initialElevatedFee)
        BaseHook(manager) Ownable(initialOwner)
    { _setFeePolicy(initialThreshold, initialNormalFee, initialElevatedFee); }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory permissions) {
        permissions.beforeSwap = true;
        permissions.afterSwap = true;
    }

    function setFeePolicy(uint24 threshold, uint24 baseFee, uint24 highFee) external onlyOwner {
        _setFeePolicy(threshold, baseFee, highFee);
    }

    function movementState(PoolKey calldata key) external view returns (int24 referenceTick, uint24 lastMovement, bool initialized) {
        MovementState storage state = movementByPool[key.toId()];
        return (state.referenceTick, state.lastMovement, state.initialized);
    }

    function _beforeSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata, bytes calldata)
        internal override returns (bytes4, BeforeSwapDelta, uint24)
    {
        if (!key.fee.isDynamicFee()) revert StaticFeePool();
        PoolId id = key.toId();
        MovementState storage state = movementByPool[id];
        state.startTick = _currentTick(key);
        state.pending = true;
        uint24 selected = state.initialized && state.lastMovement > movementThreshold ? elevatedFee : normalFee;
        return (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, selected | LPFeeLibrary.OVERRIDE_FEE_FLAG);
    }

    function _afterSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata, BalanceDelta, bytes calldata)
        internal override returns (bytes4, int128)
    {
        PoolId id = key.toId();
        MovementState storage state = movementByPool[id];
        if (!state.pending) revert MissingSwapStart();
        int24 endTick = _currentTick(key);
        uint24 movement = _absoluteTickDelta(endTick, state.startTick);
        state.referenceTick = endTick;
        state.lastMovement = movement;
        state.pending = false;
        state.initialized = true;
        emit SwapMovementRecorded(PoolId.unwrap(id), endTick, movement);
        return (IHooks.afterSwap.selector, 0);
    }

    function _currentTick(PoolKey calldata key) internal view virtual returns (int24 tick) {
        (, tick,,) = StateLibrary.getSlot0(poolManager, key.toId());
    }

    function _absoluteTickDelta(int24 left, int24 right) internal pure returns (uint24) {
        int256 delta = int256(left) - int256(right);
        return uint24(uint256(delta < 0 ? -delta : delta));
    }

    function _setFeePolicy(uint24 threshold, uint24 baseFee, uint24 highFee) internal {
        if (threshold == 0) revert InvalidThreshold();
        if (baseFee == 0 || highFee < baseFee || highFee > MAX_LP_FEE) revert InvalidFeeRange();
        movementThreshold = threshold;
        normalFee = baseFee;
        elevatedFee = highFee;
        emit FeePolicyUpdated(threshold, baseFee, highFee);
    }
}
