# Specification

## Interfaces

The module exports a single function named toBps.

toBps accepts one argument, an array of numbers.

toBps returns an array of integers.

## Data model

Input: an array where each element is a finite non-negative number representing a weight.

Output: an array of the same length as the input, where each element is an integer basis-point allocation.

The sum of all output integers is exactly 10000.

## Requirements

1. If the argument is not an array, or is an empty array, the function throws an error with message 'empty'.
2. If any array element is not a number, is not finite, or is negative, the function throws an error with message 'bad weight'.
3. If the sum of all array elements is zero, the function throws an error with message 'zero total'.
4. For valid input, each output value is derived from the largest remainder method applied to the exact shares (weight * 10000) / total weight.
5. Each exact share is first floored to an integer.
6. The difference between 10000 and the sum of the floored values is distributed as single-point increments.
7. Increments are assigned to entries with the largest fractional remainder of their exact share.
8. When fractional remainders are equal, the entry with the lower index receives the increment first.
9. Every output array sums to exactly 10000.
10. The output array has the same length as the input array.

## Formats

Input format: JSON-compatible array of numbers.

Output format: JSON-compatible array of integers.

Error format: Error instances with message strings 'empty', 'bad weight', or 'zero total'.

## Errors

'empty' is thrown for non-array input or an empty array.

'bad weight' is thrown for any element that is not a finite non-negative number.

'zero total' is thrown when all weights sum to zero.

## Test cases

1. Input [1,1,1] returns [3334,3333,3333].
2. Input [2,1] returns [6667,3333].
3. Input [0,5] returns [0,10000].
4. Input [1,2,3,4] returns [1000,2000,3000,4000].
5. Input [1,1,1,1,1,1,1] returns seven integers summing to 10000, with the first value receiving any extra point.
6. Input [] throws 'empty'.
7. Input null throws 'empty'.
8. Input [1,-1] throws 'bad weight'.
9. Input [1,NaN] throws 'bad weight'.
10. Input [0,0] throws 'zero total'.
11. Input [0,0,5] returns [0,0,10000].
12. Input [3,3,3,3] returns [2500,2500,2500,2500].