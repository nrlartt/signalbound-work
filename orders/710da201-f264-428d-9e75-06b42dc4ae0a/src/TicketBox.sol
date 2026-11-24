// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TicketBox {
    uint256 public price;
    uint256 public maxTickets;
    uint256 public sold;
    mapping(address => uint256) public ticketsOf;

    constructor(uint256 _price, uint256 _maxTickets) {
        price = _price;
        maxTickets = _maxTickets;
    }

    function buy(uint256 n) public payable {
        if (n == 0) revert("zero tickets");
        if (msg.value != n * price) revert("wrong value");
        if (sold + n > maxTickets) revert("sold out");
        ticketsOf[msg.sender] += n;
        sold += n;
    }

    function refund(uint256 n) public {
        if (ticketsOf[msg.sender] < n) revert("not enough tickets");
        uint256 amount = n * price;
        ticketsOf[msg.sender] -= n;
        sold -= n;
        (bool ok, ) = payable(msg.sender).call{value: amount}(new bytes(0));
        if (!ok) revert("refund failed");
    }
}
