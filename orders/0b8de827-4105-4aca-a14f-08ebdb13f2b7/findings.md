# Findings

## Source examined

OBSERVATION: The target is a single exported JavaScript function named formatTokenAmount with parameters raw, decimals defaulting to 18, and maxFraction defaulting to 4 (source: the paid brief source block, function declaration line).

OBSERVATION: The first statement converts raw to bigint if it is not already a bigint (source: the paid brief source block, first statement inside the function body).

OBSERVATION: The second statement throws a RangeError with message 'decimals' when decimals is not an integer or is outside 0 to 36 inclusive (source: the paid brief source block, second statement inside the function body).

OBSERVATION: The third statement records whether raw is negative, then negates raw if it is negative (source: the paid brief source block, third statement inside the function body).

OBSERVATION: The fourth statement computes base as 10 raised to the power of decimals (source: the paid brief source block, fourth statement inside the function body).

OBSERVATION: The fifth statement computes whole as raw divided by base and frac as the remainder converted to a zero-padded string of length decimals (source: the paid brief source block, fifth statement inside the function body).

OBSERVATION: The sixth statement truncates frac to maxFraction characters and removes trailing zeros (source: the paid brief source block, sixth statement inside the function body).

OBSERVATION: The seventh statement formats whole with comma thousands separators using a regular expression (source: the paid brief source block, seventh statement inside the function body).

OBSERVATION: The eighth statement joins wholeStr and frac with a dot when frac is non-empty, otherwise returns wholeStr alone (source: the paid brief source block, eighth statement inside the function body).

OBSERVATION: The ninth statement prepends a minus sign when the original value was negative and the formatted output is not '0' (source: the paid brief source block, ninth statement inside the function body).

## Behavioural conclusions

INFERENCE: The function accepts bigint, number, string, or any value coercible by BigInt for raw, because non-bigint values are passed to BigInt() (source: OBSERVATION about the first statement).

INFERENCE: decimals must be an integer between 0 and 36 inclusive, otherwise a RangeError is thrown before any formatting occurs (source: OBSERVATION about the second statement).

INFERENCE: Negative inputs are formatted as positive values with a minus sign prepended, except when the formatted result is exactly '0' (source: OBSERVATION about the third and ninth statements).

INFERENCE: The fractional part is truncated to at most maxFraction digits, not rounded, because slice is used without any rounding operation (source: OBSERVATION about the sixth statement).

INFERENCE: Trailing zeros in the fractional part are removed after truncation (source: OBSERVATION about the sixth statement).

INFERENCE: The whole part uses comma thousands separators every three digits from the right (source: OBSERVATION about the seventh statement).

INFERENCE: When the fractional part becomes empty after truncation and zero-stripping, the output contains no decimal point (source: OBSERVATION about the eighth statement).

INFERENCE: A negative value whose formatted magnitude is zero returns '0' without a minus sign (source: OBSERVATION about the ninth statement).

## Open questions

UNKNOWN: Whether BigInt(raw) throws for a given non-bigint input cannot be established without executing the function, because the source does not list every value that BigInt accepts or rejects (source: the paid brief source block, first statement; no execution was performed).

UNKNOWN: The exact error message text for invalid decimals beyond the word 'decimals' cannot be confirmed without execution, because only the source text is available (source: the paid brief source block, second statement; no execution was performed).

UNKNOWN: Performance characteristics for very large raw values or very large decimals cannot be established from source alone (source: the paid brief source block; no execution or benchmarking was performed).