// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

/**
 * @title PeakHold
 * @dev A single-steward oracle that posts a kiln peak temperature and a hold
 * duration. Values are expressed in tenths of a degree Celsius (celsiusX10).
 *
 * Trust boundary:
 * - Only the steward (set at construction) may write a value via setPeak.
 * - A value older than maxAge seconds is stale: readers must refuse it.
 * - Until the first post, the feed is unset and reads revert with Unset.
 * - After the first post, each new post must not jump more than maxJump
 *   tenths of a degree from the previous post.
 */
contract PeakHold {
    // Custom errors
    error NotSteward();
    error StaleWriter();
    error Jump();
    error Stale();
    error Unset();

    address public immutable steward;
    uint32 public immutable maxAge;
    uint32 public immutable maxJump;

    uint32 public celsiusX10;
    uint32 public holdMinutes;
    uint32 public updatedAt;

    bool public posted;

    constructor(address _steward, uint32 _maxAge, uint32 _maxJump) {
        steward = _steward;
        maxAge = _maxAge;
        maxJump = _maxJump;
    }

    /**
     * @dev Post a new peak temperature and hold duration.
     * @param _celsiusX10 temperature in tenths of a degree Celsius
     * @param _holdMinutes hold duration in minutes (0 is allowed on first set)
     */
    function setPeak(uint32 _celsiusX10, uint32 _holdMinutes) external {
        if (msg.sender != steward) {
            revert NotSteward();
        }

        if (posted) {
            // StaleWriter: previous post older than maxAge seconds
            if (uint32(block.timestamp) - updatedAt > maxAge) {
                revert StaleWriter();
            }

            // Jump: absolute difference exceeds maxJump (applied only after first post)
            uint32 diff = _celsiusX10 > celsiusX10
                ? _celsiusX10 - celsiusX10
                : celsiusX10 - _celsiusX10;
            if (diff > maxJump) {
                revert Jump();
            }
        }

        celsiusX10 = _celsiusX10;
        holdMinutes = _holdMinutes;
        updatedAt = uint32(block.timestamp);
        posted = true;
    }

    /**
     * @dev Read the latest posted value.
     * @return celsiusX10 temperature in tenths of a degree Celsius
     * @return holdMinutes hold duration in minutes
     * @return updatedAt block timestamp of the last post
     */
    function read() external view returns (uint32, uint32, uint32) {
        if (!posted) {
            revert Unset();
        }

        if (uint32(block.timestamp) - updatedAt > maxAge) {
            revert Stale();
        }

        return (celsiusX10, holdMinutes, updatedAt);
    }
}
