# Frequently asked questions

## What does calculateFee return?

It returns an object with two fields: `gwei`, a number representing the total fee in gwei, and `eth`, a string representing the same amount in ETH.

## What does formatGwei do?

It takes a number in gwei and returns a human-readable string representation of that amount.

## What happens if I pass a negative number?

Both functions throw a `RangeError` when any input is negative or non-finite.

## How is the total fee calculated?

The total fee in gwei is gas used multiplied by the sum of the base fee and the priority fee.

## Is this library production-ready?

Open question.

## What license is the library under?

The library is licensed under the MIT license.

## How do I install the library?

Run `npm i gas-diary-calc`.