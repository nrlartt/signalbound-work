// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/YesNoPoll.sol";
import "./Handler.sol";

contract YesNoPollInvariantTest is Test {
    YesNoPoll public poll;
    Handler public handler;

    function setUp() public {
        poll = new YesNoPoll();
        handler = new Handler(address(poll));
        targetContract(address(handler));
    }

    function invariant_YesPlusNoEqualsVoters() public view {
        assertTrue(poll.yesCount() + poll.noCount() == poll.votersCount(), "yes+no must equal voters");
    }

    function invariant_VotersAtMostThree() public view {
        assertTrue(poll.votersCount() <= 3, "voters must not exceed 3 actors");
    }

    function invariant_YesMatchesGhost() public view {
        assertTrue(poll.yesCount() == handler.ghostYes(), "yesCount must match ghostYes");
    }

    function invariant_NoMatchesGhost() public view {
        assertTrue(poll.noCount() == handler.ghostNo(), "noCount must match ghostNo");
    }

    function testFuzz_SecondVoteReverts(bool a, bool b) public {
        uint256 seed = bound(uint256(0), 0, 2);
        address actor = handler.actors(seed);
        vm.deal(actor, 1 ether);
        vm.prank(actor);
        poll.vote(a);
        vm.prank(actor);
        vm.expectRevert(YesNoPoll.AlreadyVoted.selector);
        poll.vote(b);
    }
}