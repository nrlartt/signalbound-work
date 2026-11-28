# Investigation findings

## Source material

OBSERVATION: The brief supplies complete source for two exported functions, rleEncode and rleDecode, described as run-length encoding of a ghost-tape of integer positions. (source: paid brief in the task message)

OBSERVATION: rleEncode is declared as an exported function taking one parameter named xs. (source: paid brief source excerpt)

OBSERVATION: rleDecode is declared as an exported function taking one parameter named pairs. (source: paid brief source excerpt)

## rleEncode behaviour

OBSERVATION: rleEncode throws an Error with message 'not a list' when xs is not an array. (source: paid brief source excerpt, first statement of rleEncode)

OBSERVATION: rleEncode iterates over each element x of xs in order. (source: paid brief source excerpt, for-of loop)

OBSERVATION: rleEncode throws an Error with message 'bad value' when an element x is not an integer according to Number.isInteger. (source: paid brief source excerpt, validation inside the loop)

OBSERVATION: rleEncode inspects the last entry of the output array; if it exists and its first element equals x, it increments the second element by one. (source: paid brief source excerpt, last and last[0] === x branch)

OBSERVATION: rleEncode otherwise appends a new two-element array [x, 1] to the output. (source: paid brief source excerpt, else branch)

OBSERVATION: rleEncode returns the output array of pairs. (source: paid brief source excerpt, return statement)

OBSERVATION: For input [1,1,1,2,2,7], rleEncode returns [[1,3],[2,2],[7,1]]. (source: paid brief required matching case)

OBSERVATION: For input [], rleEncode returns []. (source: paid brief required matching case)

OBSERVATION: For input [0], rleEncode returns [[0,1]]. (source: paid brief required matching case)

## rleDecode behaviour

OBSERVATION: rleDecode throws an Error with message 'not a list' when pairs is not an array. (source: paid brief source excerpt, first statement of rleDecode)

OBSERVATION: rleDecode iterates over each element p of pairs in order. (source: paid brief source excerpt, for-of loop)

OBSERVATION: rleDecode throws an Error with message 'bad pair' when p is not an array, does not have length 2, or either element is not an integer. (source: paid brief source excerpt, pair validation condition)

OBSERVATION: rleDecode throws an Error with message 'bad count' when the second element of a pair is negative. (source: paid brief source excerpt, p[1] < 0 check)

OBSERVATION: rleDecode skips a pair entirely when its second element is zero. (source: paid brief source excerpt, p[1] === 0 continue)

OBSERVATION: rleDecode appends the first element of a pair to the output once for each count indicated by the second element. (source: paid brief source excerpt, inner loop pushing p[0])

OBSERVATION: rleDecode returns the decoded flat array. (source: paid brief source excerpt, return statement)

OBSERVATION: For input [[1,3],[2,2],[7,1]], rleDecode returns [1,1,1,2,2,7]. (source: paid brief required matching case)

OBSERVATION: For input [[3,0],[4,2]], rleDecode returns [4,4], demonstrating that a zero count is skipped. (source: paid brief required matching case)

## Round-trip behaviour

OBSERVATION: The brief requires rleDecode(rleEncode(sample)) to equal sample for a short mixed list included in the tests. (source: paid brief required matching case)

## Errors and messages

OBSERVATION: Both functions use the same message 'not a list' for a non-array input. (source: paid brief source excerpt)

OBSERVATION: rleEncode uses 'bad value' for a non-integer element. (source: paid brief source excerpt)

OBSERVATION: rleDecode uses 'bad pair' for a malformed pair and 'bad count' for a negative count. (source: paid brief source excerpt)

## Unknowns

UNKNOWN: Whether the original module was ever published as a package, because the brief supplies only source text and no package metadata. (source: paid brief; no package files were provided)

UNKNOWN: Whether the original module handles sparse arrays or array-like objects in any special way, because the source uses Array.isArray and for-of without any additional handling. (source: paid brief source excerpt; no behaviour outside normal dense arrays is specified)

UNKNOWN: Whether very large counts cause performance or memory issues in rleDecode, because the source contains no count limit and no tests for scale were provided. (source: paid brief source excerpt; no performance requirements or large-count examples were given)