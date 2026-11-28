// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PeakHold.sol";

contract PeakHoldTest is Test {
    PeakHold public oracle;
    address public steward;
    address public nonSteward;

    uint32 public constant MAX_AGE = 3600; // 1 hour
    uint32 public constant MAX_JUMP = 500; // 50.0 degrees Celsius

    function setUp() public {
        steward = makeAddr("steward");
        nonSteward = makeAddr("nonSteward");
        oracle = new PeakHold(steward, MAX_AGE, MAX_JUMP);
    }

    function testFirstSet() public {
        vm.prank(steward);
        oracle.setPeak(2500, 60); // 250.0 C, 60 minutes

        (uint32 temp, uint32 hold, uint32 updated) = oracle.read();
        assertEq(temp, 2500, "temperature");
        assertEq(hold, 60, "hold minutes");
        assertEq(updated, block.timestamp, "updatedAt");
    }

    function testJumpReverts() public {
        vm.prank(steward);
        oracle.setPeak(2500, 60);

        vm.prank(steward);
        vm.expectRevert(PeakHold.Jump.selector);
        oracle.setPeak(3100, 60); // jump of 600 > maxJump 500
    }

    function testWithinJump() public {
        vm.prank(steward);
        oracle.setPeak(2500, 60);

        vm.prank(steward);
        oracle.setPeak(2900, 120); // jump of 400 <= maxJump 500

        (uint32 temp, uint32 hold, ) = oracle.read();
        assertEq(temp, 2900, "temperature");
        assertEq(hold, 120, "hold minutes");
    }

    function testStaleWriter() public {
        vm.prank(steward);
        oracle.setPeak(2500, 60);

        vm.warp(block.timestamp + MAX_AGE + 1);

        vm.prank(steward);
        vm.expectRevert(PeakHold.StaleWriter.selector);
        oracle.setPeak(2600, 60);
    }

    function testReadStale() public {
        vm.prank(steward);
        oracle.setPeak(2500, 60);

        vm.warp(block.timestamp + MAX_AGE + 1);

        vm.expectRevert(PeakHold.Stale.selector);
        oracle.read();
    }

    function testReadUnset() public {
        vm.expectRevert(PeakHold.Unset.selector);
        oracle.read();
    }

    function testNonStewardReverts() public {
        vm.prank(nonSteward);
        vm.expectRevert(PeakHold.NotSteward.selector);
        oracle.setPeak(2500, 60);
    }
}
