// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title NumberRegistry
 * @dev A registry where each address can store one uint256 favourite number.
 */
contract NumberRegistry {
    /**
     * @dev Emitted when a favourite number is set.
     * @param who The address that set the number.
     * @param n The favourite number stored.
     */
    event NumberSet(address indexed who, uint256 n);

    /**
     * @dev Emitted when a favourite number entry is cleared.
     * @param who The address that cleared its entry.
     */
    event NumberCleared(address indexed who);

    /**
     * @dev Reverted when clearing an entry that does not exist.
     */
    error NoEntry();

    /**
     * @dev Mapping from address to stored favourite number.
     */
    mapping(address => uint256) private _numbers;

    /**
     * @dev Tracking whether an address currently has an entry.
     */
    mapping(address => bool) private _exists;

    /**
     * @dev Number of addresses with an active entry.
     */
    uint256 private _count;

    /**
     * @dev Stores the caller's favourite number.
     * @param n The favourite number to store.
     */
    function set(uint256 n) external {
        if (!_exists[msg.sender]) {
            _exists[msg.sender] = true;
            _count += 1;
        }
        _numbers[msg.sender] = n;
        emit NumberSet(msg.sender, n);
    }

    /**
     * @dev Returns whether an address has an entry and its favourite number.
     * @param who The address to look up.
     * @return exists Whether the address has an entry.
     * @return n The stored favourite number, or 0 if none.
     */
    function get(address who) external view returns (bool exists, uint256 n) {
        exists = _exists[who];
        n = _numbers[who];
    }

    /**
     * @dev Deletes the caller's favourite number entry.
     */
    function clear() external {
        if (!_exists[msg.sender]) {
            revert NoEntry();
        }
        _exists[msg.sender] = false;
        _numbers[msg.sender] = 0;
        unchecked { _count -= 1; }
        emit NumberCleared(msg.sender);
    }

    /**
     * @dev Returns the number of addresses with an active entry.
     * @return The count of addresses with an entry.
     */
    function count() external view returns (uint256) {
        return _count;
    }
}
