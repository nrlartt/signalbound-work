# CandleLedger Invariant Project

This project contains a small candle-lighting ledger and a Foundry invariant test suite.

## Contract

`src/CandleLedger.sol` — `CandleLedger`:
- `light(bytes32 dedication) payable` requires `msg.value >= 0.001 ether`, records candles and paid amounts per sender, and emits `Lit`.
- `sweep()` can be called by anyone and moves the contract balance to the constructor-set beneficiary, adding the amount to `swept`.

## Properties

Each property is its own function and reads real `CandleLedger` state:

- `invariant_TotalCandlesEqualsSumOfActors` — `totalCandles` equals the sum of `candlesOf` across the three actors.
- `invariant_TotalPaidEqualsSumOfActors` — `totalPaid` equals the sum of `paidBy` across the three actors.
- `invariant_BalancePlusSweptEqualsTotalPaid` — contract balance plus `swept` equals `totalPaid`.
- `invariant_BeneficiaryReceivedEqualsSwept` — the beneficiary's balance equals `swept`.

A property test must fail if the code is broken. Example mutation: remove the `totalCandles += 1;` line from `light()`. Then `invariant_TotalCandlesEqualsSumOfActors` fails because the actor sum grows while `totalCandles` stays stale.

## Fuzz test

`testFuzz_LightBelowMinimumReverts` fuzzes `light` with values below `0.001 ether` and asserts the revert.

## Configuration

`foundry.toml` sets `[invariant] runs = 128, depth = 32`. Run with `forge test --invariant-test`.
