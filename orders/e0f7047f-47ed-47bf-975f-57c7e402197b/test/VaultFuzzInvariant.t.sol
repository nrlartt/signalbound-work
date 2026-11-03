// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {Vault} from "src/Vault.sol";

contract VaultFuzzInvariant is Test {
    Vault vault;
    address[] users;

    function setUp() public {
        vault = new Vault();
        users = new address[](5);
        for (uint256 i = 0; i < 5; ++i) {
            users[i] = makeAddr(string(abi.encodePacked("user", vm.toString(i))));
        }
    }

    function testFuzz_AccountingInvariant(
        uint8 numActions,
        uint8[10] calldata whoIdx,
        uint256[10] calldata amounts,
        bool[10] calldata isDeposit
    ) public {
        uint8 n = numActions % 10;
        for (uint256 i = 0; i < users.length; ++i) {
            vm.deal(users[i], 1_000_000 ether);
        }

        for (uint8 i = 0; i < n; ++i) {
            address user = users[whoIdx[i] % users.length];
            uint256 amt = amounts[i] % 1_000 ether;
            if (isDeposit[i]) {
                vm.startPrank(user);
                if (amt > 0 && address(user).balance >= amt) {
                    (bool ok, ) = address(vault).call{value: amt}(abi.encodeWithSelector(Vault.deposit.selector));
                    ok;
                }
                vm.stopPrank();
            } else {
                uint256 bal = vault.balances(user);
                if (amt > 0 && bal >= amt) {
                    vm.prank(user);
                    vault.withdraw(amt);
                }
            }
            uint256 sum;
            for (uint8 j = 0; j < users.length; ++j) {
                sum += vault.balances(users[j]);
            }
            assertLe(sum, vault.totalDeposited(), "Accounting invariant failed: sum(balances) > totalDeposited");
            assertEq(address(vault).balance, sum, "Vault ETH mismatch");
        }
    }
}
