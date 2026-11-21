# Concepts

## Gas

Gas is the unit that measures the computational work required to execute a transaction or contract on Ethereum. Every operation consumes a specific amount of gas, and the total gas used depends on the complexity of the transaction.

## Base fee

The base fee is the minimum price per unit of gas set by the network for each block. It adjusts automatically based on block demand and is burned rather than paid to a validator.

## Priority fee

The priority fee, also known as a tip, is an additional amount paid per unit of gas to incentivize validators to include a transaction sooner. It is paid to the block producer.

## EIP-1559

EIP-1559 is the Ethereum improvement proposal that introduced the base fee and priority fee model. It replaced the legacy first-price auction with a mechanism where the total fee per gas equals the base fee plus the priority fee, making transaction costs more predictable.