// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title TidePost
 * @dev Single-writer tide gauge oracle. One coxswain posts water level
 * readings; readers consume the latest value subject to freshness rules.
 *
 * Trust boundary:
 * - Only the coxswain (set at construction) may write a level.
 * - A value older than maxAge seconds is stale and must be refused.
 * - Until the first post, the feed is unset and reads revert.
 * - After the first post, each new level may move by at most maxJump
 *   centimetresX10 from the previous post.
 *
 * Units: level is int32 centimetresX10 (tenths of a centimetre), signed so
 * the gauge can sit below chart datum. windowMinutes is carried with the
 * reading but is not validated beyond being stored.
 */
contract TidePost {
    // Custom errors defining the trust boundary.
    error NotCoxswain(address caller);
    error StaleWriter();
    error Jump(int32 delta, int32 maxJump);
    error Stale(uint256 age, uint256 maxAge);
    error Unset();

    address public coxswain;
    uint32 public maxAge;
    uint32 public maxJump;

    int32 public level;
    uint32 public windowMinutes;
    uint256 public updatedAt;

    bool public initialized;

    constructor(address _coxswain, uint32 _maxAge, uint32 _maxJump) {
        coxswain = _coxswain;
        maxAge = _maxAge;
        maxJump = _maxJump;
    }

    /**
     * @dev Post a new tide level. Only the coxswain may call.
     * @param centimetresX10 signed level in tenths of a centimetre relative
     *        to chart datum (negative = below chart datum).
     */
    function setLevel(int32 centimetresX10, uint32 windowMinutes_) public {
        if (msg.sender != coxswain) {
            revert NotCoxswain(msg.sender);
        }

        if (initialized) {
            uint256 elapsed = block.timestamp - updatedAt;
            if (elapsed > uint256(maxAge)) {
                revert StaleWriter();
            }

            int32 delta = centimetresX10 - level;
            if (delta < 0) {
                delta = -delta;
            }
            if (uint32(delta) > maxJump) {
                revert Jump(delta, int32(maxJump));
            }
        }

        level = centimetresX10;
        windowMinutes = windowMinutes_;
        updatedAt = block.timestamp;
        initialized = true;
    }

    /**
     * @dev Read the latest tide level.
     * @return centimetresX10 signed level in tenths of a centimetre.
     */
    function read() public view returns (int32 centimetresX10, uint32 windowMinutes_, uint256 updatedAt_) {
        if (!initialized) {
            revert Unset();
        }

        uint256 age = block.timestamp - updatedAt;
        if (age > uint256(maxAge)) {
            revert Stale(age, uint256(maxAge));
        }

        return (level, windowMinutes, updatedAt);
    }
}