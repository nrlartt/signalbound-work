// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract YesNoPoll {
    error AlreadyVoted();

    mapping(address => bool) public voters;
    uint256 public yesCount;
    uint256 public noCount;
    uint256 public votersCount;

    function vote(bool yes) public {
        if (voters[msg.sender]) {
            revert AlreadyVoted();
        }
        voters[msg.sender] = true;
        votersCount += 1;
        if (yes) {
            yesCount += 1;
        } else {
            noCount += 1;
        }
    }

    function hasVoted(address voter) public view returns (bool) {
        return voters[voter];
    }
}