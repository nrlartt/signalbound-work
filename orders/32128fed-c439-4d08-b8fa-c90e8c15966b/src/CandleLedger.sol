// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

contract CandleLedger {
    address public immutable beneficiary;

    mapping(address => uint256) public candlesOf;
    mapping(address => uint256) public paidBy;

    uint256 public totalCandles;
    uint256 public totalPaid;
    uint256 public swept;

    event Lit(address indexed by, bytes32 dedication, uint256 value);

    constructor(address _beneficiary) {
        beneficiary = _beneficiary;
    }

    function light(bytes32 dedication) public payable {
        if (msg.value < 0.001 ether) {
            revert("CandleLedger: value below minimum");
        }
        candlesOf[msg.sender] += 1;
        totalCandles += 1;
        paidBy[msg.sender] += msg.value;
        totalPaid += msg.value;
        emit Lit(msg.sender, dedication, msg.value);
    }

    function sweep() public {
        uint256 amount = address(this).balance;
        swept += amount;
        payable(beneficiary).transfer(amount);
    }
}

contract Handler {
    CandleLedger public targetContract;

    mapping(address => uint256) public ghostCandles;
    mapping(address => uint256) public ghostPaid;
    uint256 public ghostTotalCandles;
    uint256 public ghostTotalPaid;
    uint256 public ghostSwept;

    address[3] public actors;
    uint256 public actorCount;

    constructor(CandleLedger _target) {
        targetContract = _target;
    }

    function registerActor(address actor) public {
        if (actorCount < 3) {
            actors[actorCount] = actor;
            actorCount += 1;
        }
    }

    function lightFor(address actor, bytes32 dedication, uint256 value) public payable {
        if (actorCount == 0) revert("Handler: no actors registered");
        address realActor = actor;
        if (actor == address(0)) {
            realActor = actors[0];
        }
        targetContract.light{value: value}(dedication);
        ghostCandles[realActor] += 1;
        ghostTotalCandles += 1;
        ghostPaid[realActor] += value;
        ghostTotalPaid += value;
    }

    function sweepThroughHandler() public {
        uint256 preBalance = address(targetContract).balance;
        targetContract.sweep();
        ghostSwept += preBalance;
    }
}
