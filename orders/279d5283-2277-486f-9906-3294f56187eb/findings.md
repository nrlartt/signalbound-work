# Findings

## Source

The target is a single JavaScript module containing four exported functions: isqrt, mulDivRound, popcount32 and clampShift. Line 1 is a comment line. (source: supplied source, line 1)

## OBSERVATION lines

OBSERVATION: isqrt rejects non-number and non-integer inputs by throwing TypeError with message 'integer required'. (source: supplied source, line 2)
OBSERVATION: isqrt returns -1 for any negative integer input. (source: supplied source, line 3)
OBSERVATION: isqrt returns n unchanged for n equal to 0 or 1. (source: supplied source, line 4)
OBSERVATION: isqrt initialises x to n and y to Math.floor((x + 1) / 2). (source: supplied source, lines 5-6)
OBSERVATION: isqrt loops while y is strictly less than x, assigning x = y then y = Math.floor((x + Math.floor(n / x)) / 2) each iteration. (source: supplied source, lines 7-8)
OBSERVATION: isqrt returns x when the loop condition fails. (source: supplied source, line 9)
OBSERVATION: mulDivRound returns null when d is exactly 0. (source: supplied source, line 11)
OBSERVATION: mulDivRound computes p as a * b using JavaScript multiplication. (source: supplied source, line 12)
OBSERVATION: mulDivRound computes q as Math.trunc(p / d), truncating toward zero. (source: supplied source, line 13)
OBSERVATION: mulDivRound computes r as p - q * d, the remainder after truncated division. (source: supplied source, line 14)
OBSERVATION: mulDivRound adjusts q by -1 when p and d have opposite signs and 2 * abs(r) >= abs(d). (source: supplied source, line 15)
OBSERVATION: mulDivRound adjusts q by +1 when p and d have the same sign and 2 * abs(r) >= abs(d). (source: supplied source, line 15)
OBSERVATION: mulDivRound returns q unchanged when 2 * abs(r) < abs(d). (source: supplied source, line 16)
OBSERVATION: popcount32 converts v to an unsigned 32-bit integer via v >>> 0 before counting. (source: supplied source, line 18)
OBSERVATION: popcount32 counts set bits by repeatedly clearing the lowest set bit with v &= v - 1 and incrementing c until v is zero. (source: supplied source, lines 19-20)
OBSERVATION: popcount32 returns the count c. (source: supplied source, line 21)
OBSERVATION: clampShift returns -1 when s >= 32 and x is negative. (source: supplied source, line 23)
OBSERVATION: clampShift returns 0 when s >= 32 and x is non-negative. (source: supplied source, line 23)
OBSERVATION: clampShift returns 0 when s <= -32. (source: supplied source, line 24)
OBSERVATION: clampShift returns x >> s when s is between 0 and 31 inclusive. (source: supplied source, line 25)
OBSERVATION: clampShift returns x << -s when s is between -31 and -1 inclusive. (source: supplied source, line 25)

## INFERENCE lines

INFERENCE: isqrt terminates because x strictly decreases each iteration while y < x, and y is bounded below by the integer square root of n. (source: OBSERVATION lines for isqrt initialisation and loop update)
INFERENCE: isqrt returns the floor of the real square root for non-negative n. (source: OBSERVATION lines for isqrt loop and return)
INFERENCE: mulDivRound rounds to nearest integer, with halves rounded away from zero when p and d have the same sign, and toward more negative when signs differ, because the adjustment uses q + 1 or q - 1 based on the sign comparison. (source: OBSERVATION lines for mulDivRound adjustment)
INFERENCE: mulDivRound's exact integer result depends on a * b being representable exactly; once |a * b| exceeds 2^53, JavaScript multiplication may round the product, so q and r can be wrong relative to the mathematical product. (source: OBSERVATION lines for mulDivRound product and division)
INFERENCE: popcount32 treats negative inputs as their two's complement 32-bit representation because >>> 0 converts to unsigned 32-bit. (source: OBSERVATION lines for popcount32 conversion)
INFERENCE: clampShift with s = 31 performs an arithmetic right shift by 31, yielding -1 for negative x and 0 for non-negative x. (source: OBSERVATION lines for clampShift positive shift branch)
INFERENCE: clampShift with s = 32 returns -1 for negative x and 0 for non-negative x, matching the s = 31 arithmetic shift result for all 32-bit values. (source: OBSERVATION lines for clampShift s >= 32 branch)
INFERENCE: clampShift with s = -31 performs a left shift by 31, which for 32-bit signed values yields 0 for even x and -2147483648 for odd x due to sign-bit overflow. (source: OBSERVATION lines for clampShift negative shift branch)
INFERENCE: clampShift with s = -32 returns 0 unconditionally because the s <= -32 branch is taken before any shift. (source: OBSERVATION lines for clampShift s <= -32 branch)

## UNKNOWN lines

UNKNOWN: Whether isqrt throws or returns a non-integer result when n is a very large integer beyond safe integer range, because the source does not state a maximum and no execution was observed. (source: supplied source, lines 2-9; no runtime behaviour observed)
UNKNOWN: Whether mulDivRound throws or returns Infinity when a * b overflows to Infinity, because no execution with such inputs was observed. (source: supplied source, lines 11-16; no runtime behaviour observed)
UNKNOWN: Whether popcount32 receives non-number values and how they coerce, because the source performs no type check and no execution was observed. (source: supplied source, lines 18-21; no runtime behaviour observed)
UNKNOWN: Whether clampShift receives non-integer shift values such as 31.5 and how the shift operators handle them, because the source performs no validation on s and no execution was observed. (source: supplied source, lines 23-25; no runtime behaviour observed)

## Surprising behaviours

1. isqrt(-4) returns -1 instead of throwing, so negative inputs produce a sentinel value rather than an error. (source: supplied source, line 3)
2. mulDivRound(1, 1, 0) returns null rather than throwing or returning Infinity, because division by zero is short-circuited before any product is computed. (source: supplied source, line 11)
3. popcount32(-1) returns 32, because >>> 0 converts -1 to the unsigned 32-bit value 4294967295 whose every bit is set. (source: supplied source, line 18)
4. clampShift(-9, 1) returns -5, because JavaScript >> is an arithmetic shift that preserves the sign bit, so negative values shift toward zero but never become positive. (source: supplied source, line 25)
5. clampShift(-8, 40) returns -1, because any shift of 32 or more collapses all negative values to -1 regardless of magnitude. (source: supplied source, line 23)
6. clampShift(3, -2) returns 12, because a negative shift becomes a left shift by 2, multiplying by 4. (source: supplied source, line 25)
7. mulDivRound(-7, 3, 2) returns -4, because the remainder magnitude meets the half threshold and the signs of product and divisor differ, so the quotient moves one step further from zero. (source: supplied source, lines 12-15)

## Coverage checklist

- Input validation: covered by OBSERVATION for isqrt type check; mulDivRound and popcount32 and clampShift perform no explicit type validation. (source: supplied source, lines 2, 11, 18, 23)
- Loop and termination of isqrt: covered by OBSERVATION and INFERENCE for initialisation, update and exit condition. (source: supplied source, lines 5-9)
- Rounding rule of mulDivRound for each sign combination: covered by OBSERVATION for same-sign and opposite-sign adjustment. (source: supplied source, lines 12-16)
- What happens when a * b exceeds 2^53: covered by INFERENCE about inexact multiplication; exact failure case not observed. (source: supplied source, line 12)
- popcount32 for negative inputs: covered by OBSERVATION and INFERENCE for unsigned conversion. (source: supplied source, line 18)
- Every branch of clampShift including s = 31, 32, -31 and -32: covered by OBSERVATION and INFERENCE. (source: supplied source, lines 23-25)