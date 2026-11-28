# Specification

## Interfaces

The module exposes three functions.

correct takes two numeric arguments, observedCm and gaugeCm, and returns a number.

isDry takes one numeric argument, correctedCm, and returns a boolean.

toFathoms takes one numeric argument, correctedCm, and returns an object with two numeric properties named fathoms and feet.

## Data model

All depth and gauge values are whole centimetres represented as integers.

The station uses 183 centimetres per fathom and 30 centimetres per foot.

a toFathoms result is a pair of non-negative integers: fathoms and feet.

## Requirements

1. correct shall accept observedCm only when it is an integer greater than or equal to zero.
2. correct shall accept gaugeCm only when it is an integer, including negative integers.
3. correct shall return observedCm plus gaugeCm when both arguments are accepted.
4. correct shall reject observedCm when it is not an integer or is negative.
5. correct shall reject gaugeCm when it is not an integer.
6. isDry shall accept correctedCm only when it is an integer.
7. isDry shall return true when correctedCm is less than or equal to zero.
8. isDry shall return false when correctedCm is greater than zero.
9. isDry shall reject correctedCm when it is not an integer.
10. toFathoms shall accept correctedCm only when it is an integer greater than or equal to zero.
11. toFathoms shall compute fathoms as the whole number of 183-centimetre fathoms in correctedCm.
12. toFathoms shall compute feet as the whole number of 30-centimetre feet in the remainder after removing whole fathoms.
13. toFathoms shall return an object with fathoms and feet.
14. toFathoms shall reject correctedCm when it is not an integer or is negative.

## Formats

correct input: two integers.
correct output: one integer.
isDry input: one integer.
isDry output: boolean true or false.
toFathoms input: one non-negative integer.
toFathoms output: an object with integer properties fathoms and feet.

## Errors

correct shall throw an error with the message "bad observed" when observedCm is not an integer or is negative.
correct shall throw an error with the message "bad gauge" when gaugeCm is not an integer.
isDry shall throw an error with the message "bad depth" when correctedCm is not an integer.
toFathoms shall throw an error with the message "bad depth" when correctedCm is not an integer or is negative.

## Test cases

correct with observedCm 400 and gaugeCm -50 returns 350.
correct with observedCm 0 and gaugeCm 0 returns 0.
correct with a negative observedCm throws "bad observed".
correct with a non-integer observedCm throws "bad observed".
correct with a non-integer gaugeCm throws "bad gauge".
correct with a negative integer gaugeCm is accepted and returns the sum.
isDry with 0 returns true.
isDry with 1 returns false.
isDry with -1 returns true.
isDry with a non-integer throws "bad depth".
toFathoms with 0 returns fathoms 0 and feet 0.
toFathoms with 183 returns fathoms 1 and feet 0.
toFathoms with 213 returns fathoms 1 and feet 1.
toFathoms with 182 returns fathoms 0 and feet 6.
toFathoms with -5 throws "bad depth".