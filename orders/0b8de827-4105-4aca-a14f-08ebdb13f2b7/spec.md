# Specification

## Interfaces

The module exports one function named formatTokenAmount.

The function accepts three parameters: raw, decimals, and maxFraction.

raw is required and must be a bigint or a value that BigInt can convert to a bigint.

decimals is optional and defaults to 18 when omitted.

maxFraction is optional and defaults to 4 when omitted.

The function returns a string.

## Data model

Input raw represents an integer amount in the smallest token unit.

Input decimals is the number of fractional digits, constrained to the inclusive range 0 through 36.

Input maxFraction is the maximum number of fractional digits to show after truncation and trailing-zero removal.

Output is a human-readable decimal string with optional comma thousands separators in the whole part, an optional decimal point and fractional part, and an optional leading minus sign.

## Requirements

1. If raw is not already a bigint, it is converted to a bigint using BigInt before any other processing.

2. If decimals is provided, it must be an integer between 0 and 36 inclusive; otherwise the function throws a RangeError.

3. When decimals is omitted, it behaves as if 18 were supplied.

4. When maxFraction is omitted, it behaves as if 4 were supplied.

5. Negative raw values are formatted as their absolute value with a leading minus sign, except when the formatted result is exactly '0', in which case no minus sign appears.

6. The whole part is the integer quotient of the absolute value of raw divided by 10 raised to the power of decimals.

7. The fractional part is the remainder of that division, expressed as a zero-padded string of length decimals.

8. The fractional part is truncated to at most maxFraction characters; no rounding is performed.

9. After truncation, trailing zeros are removed from the fractional part.

10. If the fractional part is empty after truncation and trailing-zero removal, the output contains no decimal point.

11. The whole part is formatted with comma thousands separators every three digits from the right.

12. The whole part and fractional part are joined by a single dot when the fractional part is non-empty.

13. A negative zero result is output as '0' without a minus sign.

## Formats

Input raw: bigint or any value accepted by the BigInt constructor.

Input decimals: integer in the inclusive range 0 to 36.

Input maxFraction: non-negative integer.

Output: a string consisting of an optional leading minus sign, digits with comma thousands separators every three digits from the right, and optionally a dot followed by one or more digits with no trailing zeros.

## Errors

A RangeError is thrown when decimals is not an integer or is less than 0 or greater than 36.

Errors from BigInt conversion of raw, if any, are not handled by this function and propagate to the caller.

## Test cases

formatTokenAmount(1234567890000000000000n) returns "1,234.5678".

formatTokenAmount(1n) returns "0".

formatTokenAmount(-5000000000000000000n) returns "-5".

formatTokenAmount(1500000, 6, 2) returns "1.5".

formatTokenAmount(1234567890n, 18, 4) returns "0.000000001234567890".

formatTokenAmount(1000000000000000000n, 18, 4) returns "1".

formatTokenAmount(1234567890123456789012n, 18, 4) returns "1,234.5678".

formatTokenAmount(0n) returns "0".

formatTokenAmount(-0n) returns "0".

formatTokenAmount(1234567890n, 0) returns "1,234,567,890".

formatTokenAmount(1234567890n, 18, 0) returns "0".

formatTokenAmount(1000000000000000000000n, 18, 4) returns "1,000".

formatTokenAmount(999999999999999999999n, 18, 4) returns "0.9999".

formatTokenAmount(10000000000000000000000n, 18, 4) returns "10".

formatTokenAmount(123456789012345678901234567890n, 18, 4) returns "123,456,789,012,345.6789".

formatTokenAmount(-1n, 18, 4) returns "-0.000000000000000001".

Calling the function with decimals equal to 37 throws a RangeError.

Calling the function with decimals equal to -1 throws a RangeError.

Calling the function with decimals equal to 3.5 throws a RangeError.

formatTokenAmount("1234567890000000000000", 18, 4) returns "1,234.5678".