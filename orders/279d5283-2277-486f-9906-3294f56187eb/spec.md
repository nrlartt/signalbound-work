# Specification

## Interfaces

- isqrt(n): accepts one numeric argument and returns an integer result or throws.
- mulDivRound(a, b, d): accepts three numeric arguments and returns a number or null.
- popcount32(v): accepts one numeric argument and returns an integer count.
- clampShift(x, s): accepts two numeric arguments and returns a number.

## Data model

- All numeric inputs and outputs are JavaScript numbers.
- isqrt input must be an integer; negative integers map to -1; zero and one map to themselves; integers greater than one map to their integer square root.
- mulDivRound inputs are three numbers; a zero divisor yields null; otherwise the product of the first two arguments is divided by the third and rounded according to the remainder rule.
- popcount32 input is converted to an unsigned 32-bit integer; the output is the number of set bits in that 32-bit value, in the range 0 to 32.
- clampShift input x is a number; input s is a number; shifts of magnitude 32 or more are clamped; smaller shifts apply a right shift for non-negative s and a left shift for negative s.

## Requirements

1. isqrt shall throw a TypeError when n is not a number or is not an integer.
2. isqrt shall return -1 when n is a negative integer.
3. isqrt shall return 0 when n is 0 and 1 when n is 1.
4. isqrt shall return the greatest integer x such that x * x is less than or equal to n for every integer n greater than 1.
5. isqrt shall terminate for every valid integer input.
6. mulDivRound shall return null when d is exactly 0.
7. mulDivRound shall compute the product p of a and b.
8. mulDivRound shall compute q as the truncated quotient of p divided by d, discarding any fractional part toward zero.
9. mulDivRound shall compute r as p minus q times d.
10. mulDivRound shall return q plus 1 when p and d have the same sign and twice the absolute value of r is greater than or equal to the absolute value of d.
11. mulDivRound shall return q minus 1 when p and d have opposite signs and twice the absolute value of r is greater than or equal to the absolute value of d.
12. mulDivRound shall return q unchanged when twice the absolute value of r is strictly less than the absolute value of d.
13. popcount32 shall convert v to an unsigned 32-bit integer before counting.
14. popcount32 shall return the number of bits set to 1 in the 32-bit representation.
15. clampShift shall return -1 when s is greater than or equal to 32 and x is negative.
16. clampShift shall return 0 when s is greater than or equal to 32 and x is zero or positive.
17. clampShift shall return 0 when s is less than or equal to -32.
18. clampShift shall return x arithmetically right-shifted by s when s is between 0 and 31 inclusive.
19. clampShift shall return x left-shifted by negative s when s is between -31 and -1 inclusive.

## Formats

- Inputs are plain JavaScript numbers; no other input format is accepted or defined.
- Outputs are plain JavaScript numbers, except mulDivRound may return the null value.
- No text, binary or file format is involved.

## Errors

- isqrt throws TypeError for non-number or non-integer input.
- mulDivRound returns null for a zero divisor rather than throwing.
- popcount32 performs no input validation; behaviour for non-number inputs is not specified by the source.
- clampShift performs no input validation; behaviour for non-number inputs is not specified by the source.
- Behaviour when products exceed safe integer range is not specified by the source.

## Test cases

1. isqrt(15) -> 3
2. isqrt(16) -> 4
3. isqrt(-4) -> -1
4. isqrt(2.5) throws TypeError
5. mulDivRound(7, 3, 2) -> 11
6. mulDivRound(-7, 3, 2) -> -4
7. mulDivRound(5, 1, -2) -> -2
8. mulDivRound(1, 1, 0) -> null
9. popcount32(-1) -> 32
10. clampShift(-8, 40) -> -1
11. clampShift(3, -2) -> 12
12. clampShift(-9, 1) -> -5
13. isqrt(0) -> 0
14. isqrt(1) -> 1
15. mulDivRound(7, 3, 3) -> 7
16. popcount32(0) -> 0
17. clampShift(0, 32) -> 0
18. clampShift(5, -32) -> 0