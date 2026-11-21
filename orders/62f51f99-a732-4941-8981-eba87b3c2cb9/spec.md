# gas-diary-calc behaviour specification

## Interfaces
The library exposes two public functions.

calculateFee takes three numeric arguments: gasUsed, baseFeeGwei and priorityFeeGwei. It returns an object with two properties: gwei, a number, and eth, a string.

formatGwei takes one numeric argument and returns a string.

## Data model
The gwei result is a finite number representing the total fee in gwei.
The eth result is a string representing the same quantity converted to ETH.
Inputs are finite numbers; negative or non-finite inputs are rejected.

## Requirements
1. calculateFee must accept gasUsed, baseFeeGwei and priorityFeeGwei as numbers.
2. calculateFee must return an object whose gwei property is the product of gasUsed and the sum of baseFeeGwei and priorityFeeGwei.
3. calculateFee must return an object whose eth property is the gwei value expressed in ETH as a string.
4. formatGwei must accept one number and return a string representation of that value.
5. Any negative or non-finite input to calculateFee or formatGwei must cause a RangeError to be thrown.
6. The library must be installable as an npm package named gas-diary-calc.

## Formats
Inputs are JavaScript numbers.
The gwei output is a JavaScript number.
The eth output is a string.
The formatGwei output is a string.

## Errors
RangeError is thrown when any input to calculateFee is negative or non-finite.
RangeError is thrown when the input to formatGwei is negative or non-finite.
No other error types are specified.

## Test cases
Test that calculateFee(21000, 2, 1) returns gwei equal to 63000 and eth equal to "0.000063".
Test that calculateFee with a negative gasUsed throws RangeError.
Test that calculateFee with a negative baseFeeGwei throws RangeError.
Test that calculateFee with a negative priorityFeeGwei throws RangeError.
Test that calculateFee with NaN as any input throws RangeError.
Test that calculateFee with Infinity as any input throws RangeError.
Test that calculateFee with -Infinity as any input throws RangeError.
Test that formatGwei with a negative number throws RangeError.
Test that formatGwei with NaN throws RangeError.
Test that formatGwei with Infinity throws RangeError.
Test that formatGwei with -Infinity throws RangeError.
Test that formatGwei returns a string for a valid finite input.