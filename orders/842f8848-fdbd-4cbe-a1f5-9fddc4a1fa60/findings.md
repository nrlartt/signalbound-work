# Findings

## Source material

OBSERVATION: The brief supplies a complete JavaScript module source defining a single exported function named toBps (source: paid brief source block).

OBSERVATION: The function normalises basket weights to basis points that sum to exactly 10000 (source: paid brief source block comment).

## Input validation

OBSERVATION: If weights is not an array or is an empty array, the function throws an Error with message 'empty' (source: paid brief source block, first conditional).

OBSERVATION: If any element is not a number, is not finite, or is negative, the function throws an Error with message 'bad weight' (source: paid brief source block, second conditional).

OBSERVATION: NaN fails the Number.isFinite check and therefore triggers 'bad weight' (source: paid brief source block, second conditional).

OBSERVATION: Negative numbers fail the w < 0 check and therefore trigger 'bad weight' (source: paid brief source block, second conditional).

OBSERVATION: Infinity fails the Number.isFinite check and therefore triggers 'bad weight' (source: paid brief source block, second conditional).

OBSERVATION: If the sum of all weights equals zero, the function throws an Error with message 'zero total' (source: paid brief source block, third conditional).

## Normalisation algorithm

OBSERVATION: Each exact share is computed as (weight * 10000) / total (source: paid brief source block, exact mapping).

OBSERVATION: Each exact share is floored to an integer (source: paid brief source block, floors mapping).

OBSERVATION: The remaining points to distribute equal 10000 minus the sum of the floors (source: paid brief source block, left calculation).

OBSERVATION: Remaining points are assigned one at a time to entries with the largest fractional remainder of their exact share (source: paid brief source block, order sorting and distribution loop).

OBSERVATION: Ties in fractional remainder are broken by lower index first (source: paid brief source block, sort comparator a.i - b.i).

OBSERVATION: The function returns an array of integers whose sum is exactly 10000 (source: paid brief source block, return statement and algorithm structure).

## Example behaviours from the brief

OBSERVATION: Input [1,1,1] produces [3334,3333,3333] (source: paid brief example list).

OBSERVATION: Input [2,1] produces [6667,3333] (source: paid brief example list).

OBSERVATION: Input [0,5] produces [0,10000] (source: paid brief example list).

OBSERVATION: Input [1,2,3,4] produces [1000,2000,3000,4000] (source: paid brief example list).

OBSERVATION: Input [1,1,1,1,1,1,1] produces seven values summing to 10000 with extra points on the lowest indexes (source: paid brief example list).

OBSERVATION: Input [] throws 'empty' (source: paid brief example list).

OBSERVATION: Input [1,-1] throws 'bad weight' (source: paid brief example list).

OBSERVATION: Input [1,NaN] throws 'bad weight' (source: paid brief example list).

OBSERVATION: Input [0,0] throws 'zero total' (source: paid brief example list).

## Unknowns

UNKNOWN: Behaviour for non-array iterable inputs such as array-like objects cannot be established from the source because the check requires Array.isArray specifically (source: paid brief source block, first conditional).

UNKNOWN: Behaviour for extremely large weights that may cause floating-point precision issues cannot be established from the source alone because no test data or execution results were provided (source: paid brief source block, arithmetic operations; no execution output available).

UNKNOWN: Behaviour for weights containing very small positive numbers whose exact share floors to zero cannot be fully established without execution because fractional remainder distribution depends on computed values (source: paid brief source block, exact and floors mappings; no execution output available).

UNKNOWN: The runtime environment or Node.js version under which the original module was tested cannot be established because the brief supplies only source text and no execution output (source: paid brief; no execution environment described).