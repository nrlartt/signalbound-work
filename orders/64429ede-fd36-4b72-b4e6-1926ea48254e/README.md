# Vault Invariant Fuzz Test

## Invariant
The **Vault** contract must always satisfy the accounting invariant:
```
totalDeposits == sum_{user} balances[user]
```
`totalDeposits` is a public state variable that tracks the total amount of ETH held by the contract. Each user has an individual balance stored in a private mapping, exposed via `balanceOf(address)`. The invariant guarantees that the contract never loses or creates ETH out of thin air.

## Why fuzz testing?
A property‑based fuzz test exercises many random sequences of deposits and withdrawals for multiple users. By checking the invariant after each operation, we gain confidence that the contract logic preserves accounting under a wide range of inputs, including edge cases such as zero deposits, maximum uint256 values (bounded by the test to keep gas reasonable), and attempts to over‑withdraw.

## Test strategy
1. Deploy a fresh `Vault`.
2. Generate two distinct user addresses and random deposit/withdraw amounts.
3. Fund the users with enough ETH for the deposits.
4. Perform deposits, then optional withdrawals.
5. After each step, assert:
   * `vault.totalDeposits()` equals the sum of the locally tracked balances.
   * `vault.balanceOf(user)` matches the expected balance.
6. A separate fuzz test ensures that withdrawing more than the stored balance reverts with the custom `InsufficientBalance` error.

## Limitations & assumptions
* The fuzz inputs are bounded (`depositAmt <= 1e24`) to keep gas usage manageable; extremely large values are not explored.
* The invariant is only checked for the two users involved in a single test run. The contract’s logic is generic, so the property should hold for any number of users.
* The test assumes the `deposit` function is called with `msg.value` equal to the intended deposit amount and that the caller has sufficient ETH (`vm.deal`).
* Re‑entrancy is prevented by the simple withdraw pattern (checks‑effects‑interactions) and the contract does not expose any external callbacks.

## Running the tests
```bash
forge test -vv
```
The test suite uses `testFuzz_` functions, so Foundry will automatically generate thousands of random inputs. The invariant should hold for all runs; any failure indicates a breach of the accounting guarantee.