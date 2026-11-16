# spec.md

## Interfaces

The contract exposes two external functions.

One function accepts native currency with no parameters and credits the caller's balance.

One function takes a single unsigned integer amount and attempts to send that amount of native currency to the caller, then reduces the caller's recorded balance if the send succeeds.

A public balance getter is implicitly available for the internal balance mapping, keyed by address.

## Data model

The contract stores one mapping from address to unsigned integer representing each account's recorded native currency balance in the smallest currency unit.

No other persistent state is defined.

## Requirements

1. The deposit function must accept native currency sent with the transaction and add the full sent amount to the caller's recorded balance.

2. The deposit function must impose no minimum, maximum, whitelist, or access restriction on who may deposit.

3. The withdraw function must accept a non-negative integer amount.

4. The withdraw function must revert when the caller's recorded balance is less than the requested amount.

5. The withdraw function must send the requested amount of native currency to the caller using a low-level value transfer with empty data.

6. The withdraw function must revert if the low-level value transfer to the caller fails or returns false.

7. The withdraw function must subtract the requested amount from the caller's recorded balance only after the value transfer succeeds.

8. The contract must provide no owner, administrator, pause, or emergency withdrawal function.

9. The contract must not implement any fungible or non-fungible token standard interface.

## Formats

Native currency amounts are unsigned 256-bit integers in the smallest currency unit.

The balance mapping key is a 20-byte address.

The low-level value transfer uses empty calldata and forwards no gas stipend beyond default call behaviour.

## Errors

The withdraw function reverts with an insufficient balance error when the caller's recorded balance is below the requested amount.

The withdraw function reverts when the low-level value transfer to the caller returns false.

No explicit revert message strings are defined in the source.

## Test cases

1. Deposit native currency from an externally owned account and verify the recorded balance increases by exactly the deposited amount.

2. Deposit native currency from a contract and verify the contract's recorded balance increases by exactly the deposited amount.

3. Attempt to withdraw more than the recorded balance and verify the transaction reverts.

4. Withdraw an amount equal to the full recorded balance from an externally owned account and verify the balance becomes zero and the account receives the native currency.

5. Withdraw a partial amount from an externally owned account and verify the recorded balance decreases by exactly that amount and the account receives the native currency.

6. Attempt to withdraw from a contract that lacks a payable fallback or receive function and verify the transaction reverts.

7. Deposit, then withdraw part of the balance, then withdraw the remainder, and verify the final recorded balance is zero.

8. Verify no function exists to change ownership, pause the contract, or withdraw funds on behalf of another user.

9. Verify the contract does not expose functions matching a standard token interface such as transfer, approve, or balanceOf with token-standard semantics.