// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SeasonPass.sol";

contract SeasonPassTest is Test {
    SeasonPass public pass;
    uint256 public constant PRICE = 0.0001 ether;

    function setUp() public {
        pass = new SeasonPass{value: 0}(PRICE);
    }

    function test_ConstructorZeroPriceReverts() public {
        vm.expectRevert(abi.encodeWithSelector(SeasonPass.ZeroPrice.selector));
        new SeasonPass{value: 0}(0);
    }

    function test_BuyStartsNow() public {
        vm.deal(address(this), PRICE);
        vm.prank(address(this));
        pass.buy{value: PRICE}();

        uint256 expiry = pass.expiresAt(address(this));
        assertTrue(expiry > block.timestamp, "expires in future");
        assertTrue(expiry <= block.timestamp + 7 days + 1, "within 7 days");
        assertTrue(pass.isActive(address(this)), "is active");
    }

    function test_BuyWhileActiveExtends() public {
        vm.deal(address(this), PRICE * 2);
        vm.prank(address(this));
        pass.buy{value: PRICE}();
        uint256 firstExpiry = pass.expiresAt(address(this));

        vm.warp(block.timestamp + 1 days);
        vm.prank(address(this));
        pass.buy{value: PRICE}();
        uint256 secondExpiry = pass.expiresAt(address(this));

        assertTrue(secondExpiry > firstExpiry, "extended from current expiry");
        assertTrue(secondExpiry == firstExpiry + 7 days, "exactly 7 days extension");
        assertTrue(pass.isActive(address(this)), "still active");
    }

    function test_BuyAfterExpiryStartsNow() public {
        vm.deal(address(this), PRICE);
        vm.prank(address(this));
        pass.buy{value: PRICE}();
        uint256 firstExpiry = pass.expiresAt(address(this));

        vm.warp(firstExpiry + 1);
        assertFalse(pass.isActive(address(this)), "expired");

        vm.deal(address(this), PRICE);
        vm.prank(address(this));
        pass.buy{value: PRICE}();
        uint256 secondExpiry = pass.expiresAt(address(this));

        assertTrue(secondExpiry > block.timestamp, "starts from now");
        assertTrue(secondExpiry <= block.timestamp + 7 days + 1, "within 7 days");
        assertTrue(secondExpiry > firstExpiry, "new expiry after old");
    }

    function test_WrongPriceReverts() public {
        vm.deal(address(this), PRICE + 1);
        vm.expectRevert(abi.encodeWithSelector(SeasonPass.WrongPrice.selector, PRICE));
        vm.prank(address(this));
        pass.buy{value: PRICE + 1}();
    }

    function test_IsActiveBoundary() public {
        vm.deal(address(this), PRICE);
        vm.prank(address(this));
        pass.buy{value: PRICE}();
        uint256 expiry = pass.expiresAt(address(this));

        vm.warp(expiry);
        assertFalse(pass.isActive(address(this)), "exactly at expiry is not active");
    }

    function test_OnlyOwnerWithdraws() public {
        address payable beneficiary = payable(address(0x5678));
        vm.deal(address(pass), PRICE);

        vm.expectRevert(abi.encodeWithSelector(SeasonPass.NotOwner.selector));
        vm.prank(address(0x5678));
        pass.withdraw(beneficiary);
    }

    function test_OwnerWithdrawsSuccessfully() public {
        address payable beneficiary = payable(address(0x5678));
        vm.deal(address(this), PRICE);
        vm.prank(address(this));
        pass.buy{value: PRICE}();

        uint256 balanceBefore = address(pass).balance;
        vm.prank(address(this));
        pass.withdraw(beneficiary);

        assertEq(address(beneficiary).balance, balanceBefore, "beneficiary received full balance");
        assertEq(address(pass).balance, 0, "contract balance drained");
    }
}