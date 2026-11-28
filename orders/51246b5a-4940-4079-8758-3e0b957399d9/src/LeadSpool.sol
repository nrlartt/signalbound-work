// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

contract LeadSpool {
    uint16 public immutable maxLength;
    uint16 public outstanding;
    uint16 public segmentCount;
    uint16[] public segmentLengths;

    constructor(uint16 _maxLength) {
        require(_maxLength >= 1, "maxLength must be at least 1");
        maxLength = _maxLength;
    }

    function payOut(uint16 length) public {
        require(length > 0, "length must be greater than 0");
        require(outstanding + length <= maxLength, "would exceed maxLength");
        outstanding += length;
        segmentCount += 1;
        segmentLengths.push(length);
    }

    function reelIn(uint16 length) public {
        bool found = false;
        uint16 index;
        for (uint16 i = 0; i < segmentLengths.length; i++) {
            if (segmentLengths[i] == length) {
                found = true;
                index = i;
                break;
            }
        }
        require(found, "no matching outstanding segment");
        outstanding -= length;
        segmentCount -= 1;
        segmentLengths[index] = segmentLengths[segmentLengths.length - 1];
        segmentLengths.pop();
    }
}
