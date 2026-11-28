// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/LeadSpool.sol";

contract LeadSpoolFuzz is Test {
    LeadSpool public spool;
    uint16 public maxLength;
    uint16[] public recordedSegments;

    function setUp() public {
        maxLength = 1000;
        spool = new LeadSpool(maxLength);
        recordedSegments = new uint16[](0);
    }

    function testFuzz_InvariantsHold(uint16 length, uint8 op) public {
        uint8 operation = op % 2;

        if (operation == 0) {
            if (length == 0 || spool.outstanding() + length > maxLength) {
                return;
            }
            spool.payOut(length);
            recordedSegments.push(length);
        } else {
            if (recordedSegments.length == 0) {
                return;
            }
            uint16 idx = uint16(uint256(block.timestamp) % recordedSegments.length);
            uint16 reelLength = recordedSegments[idx];
            spool.reelIn(reelLength);
            recordedSegments[idx] = recordedSegments[recordedSegments.length - 1];
            recordedSegments.pop();
        }

        uint16 sum = 0;
        for (uint256 i = 0; i < recordedSegments.length; i++) {
            sum += recordedSegments[i];
        }

        assertTrue(spool.outstanding() <= maxLength, "outstanding exceeds maxLength");
        assertTrue(spool.outstanding() == sum, "outstanding does not equal sum of segments");
        assertTrue((spool.segmentCount() == 0) == (spool.outstanding() == 0), "segment count zero flag mismatch");
    }
}