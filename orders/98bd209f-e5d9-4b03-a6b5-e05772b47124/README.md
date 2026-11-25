# BatchPay

BatchPay is a small Solidity contract that pays many recipients ETH in one all-or-nothing transaction.

## What it is

BatchPay exposes a single payable function, `pay(address[] recipients, uint256[] amounts)`. A caller sends ETH with the transaction and lists recipients and amounts. If every check passes, all recipients are paid in the same transaction. If any check fails, the transaction reverts and nobody is paid.

## All-or-nothing guarantee

The contract makes no partial payments. It validates the batch before sending anything. If a transfer fails partway through, the transaction reverts with `TransferFailed(index)` and no recipient receives ETH. The contract keeps no ETH and has no owner and no fee.

## Quick start

This example pays two recipients, 0.01 ETH and 0.02 ETH, for a total of 0.03 ETH:

```bash
cast send <BATCHPAY_ADDRESS> "pay(address[],uint256[])" \
  "[0xRecipientOne,0xRecipientTwo]" \
  "[10000000000000000,20000000000000000]" \
  --value 0.03ether
```

`--value 0.03ether` equals the sum of the two amounts exactly. If the value does not equal the sum, the transaction reverts with `WrongValue(expected, sent)`.

## Pages

- [API reference](docs/reference.md) — the function, every error, and the event.
- [Integration guide](docs/integration.md) — building arrays from CSV, estimating gas, and handling recipient contracts that reject ETH.

## Open questions

The brief does not state the Solidity compiler version, the contract name or source file layout, the deployment address, or how the contract is compiled and deployed.