# Run-length encoding module specification

## Interfaces

The module exports two functions.

1. rleEncode takes one argument, a list of integers, and returns a list of pairs.
2. rleDecode takes one argument, a list of pairs, and returns a flat list of integers.

Both functions are exported as named exports.

## Data model

A value is a list only when it is an actual array. Every element of the input list to rleEncode must be an integer. The output of rleEncode is an array of pairs, where each pair is a two-element array whose first element is an integer value and whose second element is a positive integer count.

The input list to rleDecode is an array of pairs. Each pair must be a two-element array of integers. The second element is a count; zero means the pair contributes nothing to the output, and a negative count is invalid.

## Requirements

1. rleEncode must throw an error with message 'not a list' when its argument is not an array.
2. rleEncode must throw an error with message 'bad value' when any element of its input array is not an integer.
3. rleEncode must encode consecutive equal integers into a single pair [value, count].
4. rleEncode must start a new pair whenever the next integer differs from the current run value.
5. rleEncode must return an empty array when given an empty array.
6. rleEncode must return [[0,1]] when given [0].
7. rleDecode must throw an error with message 'not a list' when its argument is not an array.
8. rleDecode must throw an error with message 'bad pair' when any element of its input array is not a two-element array of integers.
9. rleDecode must throw an error with message 'bad count' when any pair has a negative second element.
10. rleDecode must skip any pair whose second element is zero and produce no output for it.
11. rleDecode must expand each valid pair by repeating its first element as many times as its second element specifies.
12. rleDecode must preserve pair order in the expanded output.
13. rleDecode(rleEncode(sample)) must equal sample for any short mixed list of integers used in testing.

## Formats

Input to rleEncode: an array of integers.
Output from rleEncode: an array of arrays, each inner array having exactly two elements [integer, positive integer].
Input to rleDecode: an array of arrays, each inner array having exactly two elements [integer, non-negative integer].
Output from rleDecode: a flat array of integers.

## Errors

- 'not a list': thrown by either function when the top-level argument is not an array.
- 'bad value': thrown by rleEncode when an input element is not an integer.
- 'bad pair': thrown by rleDecode when an element is not a two-element array of integers.
- 'bad count': thrown by rleDecode when a pair's count is negative.

## Test cases

1. rleEncode([1,1,1,2,2,7]) returns [[1,3],[2,2],[7,1]].
2. rleEncode([]) returns [].
3. rleEncode([0]) returns [[0,1]].
4. rleEncode with a non-array argument throws 'not a list'.
5. rleEncode with an array containing a non-integer throws 'bad value'.
6. rleDecode([[1,3],[2,2],[7,1]]) returns [1,1,1,2,2,7].
7. rleDecode([[3,0],[4,2]]) returns [4,4].
8. rleDecode with a non-array argument throws 'not a list'.
9. rleDecode with a pair containing a negative count throws 'bad count'.
10. rleDecode with an element that is not a two-element array of integers throws 'bad pair'.
11. rleDecode(rleEncode(sample)) equals sample for a short mixed list of integers.
12. rleEncode preserves the order of distinct runs in the input.