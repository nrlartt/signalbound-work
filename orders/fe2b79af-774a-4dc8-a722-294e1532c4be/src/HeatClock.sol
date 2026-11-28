// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

contract HeatClock {
    error BadKeepers();
    error NotKeeper();
    error ZeroTime();
    error AlreadyReported();
    error Open();

    event Reported(bytes32 indexed heat, address indexed keeper, uint32 timeMs);
    event Official(bytes32 indexed heat, uint32 timeMs);

    address[3] public keepers;
    mapping(bytes32 => uint32) public officialTimes;
    mapping(bytes32 => bool) public finalised;
    mapping(bytes32 => uint32[3]) public reportedTimes;
    mapping(bytes32 => mapping(address => bool)) public hasReported;
    mapping(bytes32 => uint8) public reportCount;

    constructor(address[3] memory _keepers) {
        if (_keepers[0] == address(0) || _keepers[1] == address(0) || _keepers[2] == address(0)) {
            revert BadKeepers();
        }
        if (_keepers[0] == _keepers[1] || _keepers[0] == _keepers[2] || _keepers[1] == _keepers[2]) {
            revert BadKeepers();
        }
        keepers[0] = _keepers[0];
        keepers[1] = _keepers[1];
        keepers[2] = _keepers[2];
    }

    function report(bytes32 heat, uint32 timeMs) external {
        if (timeMs == 0) {
            revert ZeroTime();
        }
        bool isKeeper = false;
        for (uint8 i = 0; i < 3; i++) {
            if (keepers[i] == msg.sender) {
                isKeeper = true;
                break;
            }
        }
        if (!isKeeper) {
            revert NotKeeper();
        }
        if (hasReported[heat][msg.sender]) {
            revert AlreadyReported();
        }
        hasReported[heat][msg.sender] = true;
        reportedTimes[heat][reportCount[heat]] = timeMs;
        reportCount[heat]++;

        emit Reported(heat, msg.sender, timeMs);

        if (reportCount[heat] == 3) {
            finalised[heat] = true;
            uint32 t0 = reportedTimes[heat][0];
            uint32 t1 = reportedTimes[heat][1];
            uint32 t2 = reportedTimes[heat][2];
            uint32 median;
            if (t0 >= t1) {
                if (t1 >= t2) {
                    median = t1;
                } else if (t0 >= t2) {
                    median = t2;
                } else {
                    median = t0;
                }
            } else {
                if (t0 >= t2) {
                    median = t0;
                } else if (t1 >= t2) {
                    median = t2;
                } else {
                    median = t1;
                }
            }
            officialTimes[heat] = median;
            emit Official(heat, median);
        }
    }

    function officialTime(bytes32 heat) external view returns (uint32) {
        if (!finalised[heat]) {
            revert Open();
        }
        return officialTimes[heat];
    }
}

contract HeatCard {
    HeatClock public immutable clock;

    constructor(address _clock) {
        clock = HeatClock(_clock);
    }

    function timeOf(bytes32 heat) external view returns (uint32) {
        return clock.officialTime(heat);
    }
}
