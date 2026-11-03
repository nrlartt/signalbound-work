// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Vault - Secure deposit vault with strong accounting invariant
contract Vault {
    // Mapping of user address to their balance
    mapping(address => uint256) public balances;
    // Total amount ever deposited (cumulative)
    uint256 public totalDeposited;

    /// @notice Deposit Ether into the vault
    function deposit() external payable {
        require(msg.value > 0, "Cannot deposit zero");
        balances[msg.sender] += msg.value;
        totalDeposited += msg.value;
    }

    /// @notice Withdraw Ether from the vault
    /// @param amount The amount to withdraw
    function withdraw(uint256 amount) external {
        require(amount > 0, "Cannot withdraw zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        // Send after balance update (Checks-Effects-Interactions pattern)
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");
    }

    /// @notice Get the balance of an account
    /// @param user The address to look up
    /// @return Balance of the user
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    /// @notice Returns contract's ETH balance
    function vaultBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
