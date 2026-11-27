// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title WeightBook
 * @dev Curator-managed list of target weights for a 3-asset demo basket with a timelock.
 * No ETH or tokens move.
 */
contract WeightBook {
    uint16[3] public weights;
    address public curator;
    uint64 public constant DELAY = 2 days;

    uint16[3] public pendingWeights;
    uint64 public pendingEta;
    bool public pendingExists;

    error BadWeights();
    error ZeroCurator();
    error NotCurator();
    error NoProposal();
    error TooEarly();
    error Expired();

    event Proposed(uint16[3] w, uint64 eta);
    event Executed(uint16[3] w);
    event Cancelled();

    constructor(address _curator, uint16[3] memory initial) {
        if (_curator == address(0)) revert ZeroCurator();
        uint256 total = uint256(initial[0]) + uint256(initial[1]) + uint256(initial[2]);
        if (total != 10000) revert BadWeights();
        curator = _curator;
        weights = initial;
    }

    /**
     * @param w New target weights in basis points; must sum to 10000.
     */
    function propose(uint16[3] calldata w) external {
        if (msg.sender != curator) revert NotCurator();
        uint256 total = uint256(w[0]) + uint256(w[1]) + uint256(w[2]);
        if (total != 10000) revert BadWeights();
        pendingWeights = w;
        pendingEta = uint64(block.timestamp + DELAY);
        pendingExists = true;
        emit Proposed(w, pendingEta);
    }

    function execute() external {
        if (!pendingExists) revert NoProposal();
        if (block.timestamp < pendingEta) revert TooEarly();
        if (block.timestamp > uint64(pendingEta + 7 days)) revert Expired();
        weights = pendingWeights;
        pendingExists = false;
        emit Executed(pendingWeights);
    }

    /**
     * @return w Pending weights, eta execution timestamp, exists whether a proposal is pending.
     */
    function pending() external view returns (uint16[3] memory w, uint64 eta, bool exists) {
        w = pendingWeights;
        eta = pendingEta;
        exists = pendingExists;
    }

    function cancel() external {
        if (msg.sender != curator) revert NotCurator();
        if (!pendingExists) revert NoProposal();
        pendingExists = false;
        emit Cancelled();
    }
}