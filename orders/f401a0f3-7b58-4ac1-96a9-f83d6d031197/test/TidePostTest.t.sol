// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TidePost.sol";

contract TidePostTest is Test {
    TidePost public tidePost;
    address public coxswain = address(0x1234);
    address public notCoxswain = address(0x5678);
    uint32 public constant MAX_AGE = 3600;
    uint32 public constant MAX_JUMP = 1000;

    function setUp() public {
        tidePost = new TidePost(coxswain, MAX_AGE, MAX_JUMP);
    }

    function testFirstSet() public {
        vm.prank(coxswain);
        tidePost.setLevel(1234, 10);

        (int32 level, uint32 windowMinutes, uint256 updatedAt) = tidePost.read();
        assertEq(level, 1234, "level");
        assertEq(windowMinutes, 10, "windowMinutes");
        assertEq(updatedAt, block.timestamp, "updatedAt");
        assertEq(tidePost.coxswain(), coxswain, "coxswain");
        assertEq(tidePost.maxAge(), MAX_AGE, "maxAge");
        assertEq(tidePost.maxJump(), MAX_JUMP, "maxJump");
    }

    function testJumpReverts() public {
        vm.prank(coxswain);
        tidePost.setLevel(1000, 10);

        vm.expectRevert(abi.encodeWithSelector(TidePost.Jump.selector, 1500, MAX_JUMP));
        vm.prank(coxswain);
        tidePost.setLevel(2500, 10);
    }

    function testWithinJump() public {
        vm.prank(coxswain);
        tidePost.setLevel(1000, 10);

        vm.prank(coxswain);
        tidePost.setLevel(1500, 10);

        (int32 level, , ) = tidePost.read();
        assertEq(level, 1500, "level");
    }

    function testStaleWriter() public {
        vm.prank(coxswain);
        tidePost.setLevel(1000, 10);

        vm.warp(block.timestamp + MAX_AGE + 1);

        vm.expectRevert(TidePost.StaleWriter.selector);
        vm.prank(coxswain);
        tidePost.setLevel(1100, 10);
    }

    function testReadStale() public {
        vm.prank(coxswain);
        tidePost.setLevel(1000, 10);

        vm.warp(block.timestamp + MAX_AGE + 1);

        vm.expectPartialRevert(TidePost.Stale.selector);
        tidePost.read();
    }

    function testReadUnset() public {
        vm.expectRevert(TidePost.Unset.selector);
        tidePost.read();
    }

    function testNonCoxswainReverts() public {
        vm.expectRevert(abi.encodeWithSelector(TidePost.NotCoxswain.selector, notCoxswain));
        vm.prank(notCoxswain);
        tidePost.setLevel(1000, 10);
    }
}
