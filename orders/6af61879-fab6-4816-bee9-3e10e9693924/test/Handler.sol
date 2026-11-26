// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/YesNoPoll.sol";

contract Handler is Test {
    YesNoPoll public poll;
    address[3] public actors;
    uint256 public ghostYes;
    uint256 public ghostNo;

    constructor(address _poll) {
        poll = YesNoPoll(_poll);
        actors[0] = address(1);
        actors[1] = address(2);
        actors[2] = address(3);
    }

    function vote(uint256 actorSeed, bool yes) public {
        address actor = actors[actorSeed % 3];
        if (poll.hasVoted(actor)) {
            return;
        }
        vm.prank(actor);
        poll.vote(yes);
        if (yes) {
            ghostYes += 1;
        } else {
            ghostNo += 1;
        }
    }
}