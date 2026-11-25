// SPDX-License-Identifier: MIT
/// @title SeasonPass
/// @dev Sells a 7-day pass for a fixed price. The price is immutable after deployment.
contract SeasonPass {
    uint256 public immutable price;
    address public immutable owner;

    mapping(address => uint256) public expiresAt;

    /// @dev Emitted when a buyer purchases or extends a pass.
    event PassBought(address indexed buyer, uint256 expiresAt);

    /// @dev Emitted when the owner withdraws the contract balance.
    event Withdrawn(address to, uint256 amount);

    /// @dev Reverted when the constructor price is zero.
    error ZeroPrice();

    /// @dev Reverted when msg.value does not equal the fixed price.
    error WrongPrice(uint256 expected);

    /// @dev Reverted when a non-owner calls withdraw.
    error NotOwner();

    /**
     * @param price_ The fixed price in wei for a 7-day pass. Must be nonzero.
     */
    constructor(uint256 price_) payable {
        if (price_ == 0) {
            revert ZeroPrice();
        }
        price = price_;
        owner = msg.sender;
    }

    /**
     * @dev Buys or extends a 7-day pass. Requires msg.value == price.
     * If the caller's pass is still active, expiry extends from the current
     * expiresAt; otherwise it starts from block.timestamp.
     */
    function buy() public payable {
        if (msg.value != price) {
            revert WrongPrice(price);
        }

        uint256 now = block.timestamp;
        uint256 start = expiresAt[msg.sender] > now ? expiresAt[msg.sender] : now;
        expiresAt[msg.sender] = start + 7 days;

        emit PassBought(msg.sender, expiresAt[msg.sender]);
    }

    /**
     * @dev Returns true if the user's pass expires in the future.
     *
     * @param user The address whose pass status is checked.
     * @return true if the user's pass expires in the future.
     */
    function isActive(address user) public view returns (bool) {
        return expiresAt[user] > block.timestamp;
    }

    /**
     * @param to The address payable to receive the entire contract balance.
     * @dev Only the owner may call. Sends the whole balance and emits Withdrawn.
     */
    function withdraw(address payable to) public {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        uint256 amount = address(this).balance;
        (bool sent, ) = to.call{value: amount}(new bytes(0));
        if (!sent) {
            revert NotOwner();
        }
        emit Withdrawn(to, amount);
    }
}
