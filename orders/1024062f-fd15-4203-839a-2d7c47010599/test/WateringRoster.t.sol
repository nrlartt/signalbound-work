// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/WateringRoster.sol";

contract WateringRosterTest is Test {
    WateringRoster public roster;
    address public alice;
    address public bob;
    address public charlie;

    function setUp() public {
        roster = new WateringRoster();
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        charlie = makeAddr("charlie");
    }

    // --- Custom error coverage ---

    function testRevertBadDay() public {
        vm.prank(alice);
        vm.expectRevert(WateringRoster.BadDay.selector);
        roster.book(7, 0);
    }

    function testRevertBadSlot() public {
        vm.prank(alice);
        vm.expectRevert(WateringRoster.BadSlot.selector);
        roster.book(0, 3);
    }

    function testRevertTaken() public {
        vm.prank(alice);
        roster.book(0, 0);
        vm.prank(bob);
        vm.expectRevert(WateringRoster.Taken.selector);
        roster.book(0, 0);
    }

    function testRevertNotHolderOnCancel() public {
        vm.prank(alice);
        roster.book(0, 0);
        vm.prank(bob);
        vm.expectRevert(WateringRoster.NotHolder.selector);
        roster.cancel(0, 0);
    }

    function testRevertNotHolderOnSwap() public {
        vm.prank(alice);
        roster.book(0, 0);
        vm.prank(bob);
        vm.expectRevert(WateringRoster.NotHolder.selector);
        roster.swap(0, 0, 1, 0);
    }

    function testRevertEmptyOnSwap() public {
        vm.prank(alice);
        roster.book(0, 0);
        vm.prank(alice);
        vm.expectRevert(WateringRoster.Empty.selector);
        roster.swap(0, 0, 1, 0);
    }

    function testRevertSameHolderOnSwap() public {
        vm.prank(bob);
        roster.book(1, 0);
        vm.prank(bob);
        vm.expectRevert(WateringRoster.SameHolder.selector);
        roster.swap(1, 0, 1, 0);
    }

    // --- Book-cancel-book path ---

    function testBookCancelBook() public {
        vm.prank(alice);
        roster.book(0, 0);
        assertEq(roster.holder(0, 0), alice);
        assertEq(roster.countOf(alice), 1);

        vm.prank(alice);
        roster.cancel(0, 0);
        assertEq(roster.holder(0, 0), address(0));
        assertEq(roster.countOf(alice), 0);

        vm.prank(alice);
        roster.book(0, 0);
        assertEq(roster.holder(0, 0), alice);
        assertEq(roster.countOf(alice), 1);
    }

    // --- Swap between two different addresses ---

    function testSwapBetweenDifferentAddresses() public {
        vm.prank(alice);
        roster.book(0, 0);
        vm.prank(bob);
        roster.book(1, 1);

        vm.prank(alice);
        roster.swap(0, 0, 1, 1);

        assertEq(roster.holder(0, 0), bob);
        assertEq(roster.holder(1, 1), alice);
        assertEq(roster.countOf(alice), 1);
        assertEq(roster.countOf(bob), 1);
    }

    // --- Fuzz invariant: countOf equals number of slots where holder == actor ---

    function testFuzzCountOfMatchesHolderCount(address actor, uint8 day, uint8 slot) public {
        vm.prank(actor);
        roster.book(day % 7, slot % 3);

        uint256 expected = 0;
        for (uint8 d = 0; d < 7; d++) {
            for (uint8 s = 0; s < 3; s++) {
                if (roster.holder(d, s) == actor) expected++;
            }
        }

        assertEq(roster.countOf(actor), expected);
    }
}