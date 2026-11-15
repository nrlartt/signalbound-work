# Bounded integer clamp specification

## Interfaces

The module exposes a single function named clamp.

The function accepts three arguments: x, min, and max.

The function returns a single numeric value.

When min is greater than max, the function throws an error instead of returning a value.

## Data model

All inputs and the output are numbers.

Inputs are constrained to finite integers.

The bounds min and max define an inclusive interval.

## Requirements

R1: Given finite integers x, min, and max where min is less than or equal to max, if x is less than min, the function returns min.

R2: Given finite integers x, min, and max where min is less than or equal to max, if x is greater than max, the function returns max.

R3: Given finite integers x, min, and max where min is less than or equal to max, if x is greater than or equal to min and less than or equal to max, the function returns x.

R4: Given finite integers x, min, and max where min equals max, the function returns that same value for any finite integer x.

R5: Given arguments where min is strictly greater than max, the function throws an error and does not return a clamped value.

R6: The error thrown for invalid bounds is a RangeError.

R7: The error message for invalid bounds identifies the bounds problem.

R8: The function does not perform any backend or deployment operation.

## Formats

Input format: three numeric arguments, each a finite integer.

Output format: one numeric value, a finite integer within the inclusive bounds.

Error format: a RangeError thrown synchronously.

## Errors

E1: If min is greater than max, the function throws a RangeError.

E2: The RangeError message conveys that the bounds are invalid.

E3: Behavior for inputs that are not finite integers is an open question and is not specified by this document.

E4: Behavior for bounds that are not finite integers is an open question and is not specified by this document.

## Test cases

T1: Boundary lower: x below min returns min.

T2: Boundary upper: x above max returns max.

T3: Boundary equal to min: x equal to min returns min.

T4: Boundary equal to max: x equal to max returns max.

T5: Interior value: x strictly between min and max returns x.

T6: Degenerate interval: min equals max returns that value for x below, equal to, and above the bound.

T7: Negative bounds: clamping works with negative min and max values.

T8: Zero bounds: clamping works when min or max is zero.

T9: Invalid bounds: min greater than max throws RangeError.

T10: Invalid bounds message: the thrown error message indicates bounds are invalid.

T11: Error type: the thrown error is specifically a RangeError, not a generic Error or other type.