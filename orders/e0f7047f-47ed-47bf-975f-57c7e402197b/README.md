# Vault Accounting Invariant Foundry Project

## Overview
This project implements a secure deposit Vault contract in Solidity, and a property-based fuzz test harness using Foundry. The key accounting invariant tested is:

> **The sum of all user balances must never exceed the total amount deposited.**

## What is tested
- The fuzz harness executes hundreds to thousands of deposit and withdrawal transactions across multiple randomized users.
- Edge cases (zero amounts, insufficient funds, large values) are covered by the randomized input generation and by Foundry's aggressive fuzzing.
- After each operation, two invariants are checked:
  1. `sum(balances) <= totalDeposited`
  2. `vault's ETH balance == sum(balances)`

## Methodology
- The test manipulates five test users, giving them all high balances and randomly assigning them deposit or withdrawal actions, with randomized amounts.
- When deposits or withdrawals are attempted, only valid actions execute; invalid (e.g. overdraw) are skipped.
- After each action, the accounting invariant is asserted.

## Limitations and Assumptions
- The test covers up to 10 actions per run with randomized parameters for practical runtime. Invariant is checked after *each* action, not just at the end.
- Fuzzing cannot guarantee absence of bugs; it only increases confidence if the invariant holds across many inputs and scenarios.
- The contracts use the standard Checks-Effects-Interactions withdrawal pattern and do not cover reentrancy or gas griefing in this simple model.

## How to Run
1. Install Foundry (https://getfoundry.sh/)
2. Run `forge test -vv` in the project directory.
3. The test `testFuzz_AccountingInvariant` will output results for thousands of randomized runs.

