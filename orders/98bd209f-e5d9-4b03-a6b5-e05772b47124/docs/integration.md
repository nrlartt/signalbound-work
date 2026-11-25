# Integration guide

## Recipe 1: Build the arrays from a CSV in JavaScript

Read a CSV with columns `address,amount` where amounts are in wei. Split each line, trim whitespace, skip the header, and push each address and amount into parallel arrays. Pass those arrays to `pay` with `--value` equal to the sum of all amounts.

Example: two rows, `0xRecipientOne,10000000000000000` and `0xRecipientTwo,20000000000000000`, produce arrays `[0xRecipientOne,0xRecipientTwo]` and `[10000000000000000,20000000000000000]` with `--value 0.03ether`, since 10000000000000000 + 20000000000000000 = 30000000000000000 wei = 0.03 ETH.

## Recipe 2: Estimate gas before sending

Call `estimateGas` on the `pay` function with the same recipients, amounts, and value you intend to send. Use the returned gas estimate as the gas limit for the `cast send` transaction. If estimation reverts, one of the batch errors above will fire on-chain.

## Recipe 3: Handle a recipient contract that rejects ETH

If a recipient contract reverts on receiving ETH, `pay` reverts with `TransferFailed(index)` at that index. Because BatchPay is all-or-nothing, no earlier recipient is paid. Inspect the revert reason to find the failing index, remove or fix that recipient, rebuild the arrays, and resend with `--value` equal to the new sum.

## Open questions

The brief does not state the CSV file path or encoding, the JavaScript library to use, the gas price or gas limit settings, the RPC endpoint, or how to parse the revert reason from a failed transaction.