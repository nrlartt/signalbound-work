# findings.md

## Source trace

OBSERVATION: The function is named splitByBps and takes two parameters, totalWei and recipients (source: supplied JavaScript source, line 1).
OBSERVATION: The first validation checks that totalWei is a bigint and is not negative, throwing TypeError with message "totalWei must be a non-negative bigint" otherwise (source: supplied JavaScript source, line 2).
OBSERVATION: The second validation checks that recipients is an array with length between 1 and 10 inclusive, throwing RangeError with message "1 to 10 recipients" otherwise (source: supplied JavaScript source, line 3).
OBSERVATION: Each recipient is validated so that bps is an integer greater than zero, throwing RangeError with message "bps must be a positive integer" otherwise (source: supplied JavaScript source, lines 5-6).
OBSERVATION: Each recipient address is lowercased and checked against a Set to reject duplicates, throwing Error with message "duplicate recipient " plus the lowercased address otherwise (source: supplied JavaScript source, lines 7-9).
OBSERVATION: The bps values are summed during the recipient loop (source: supplied JavaScript source, line 10).
OBSERVATION: After the loop, bpsSum must equal 10000, throwing RangeError with message "bps must sum to 10000, got " plus the sum otherwise (source: supplied JavaScript source, lines 12-13).
OBSERVATION: Each output amount is computed as (totalWei * BigInt(r.bps)) / 10000n using integer division that truncates toward zero (source: supplied JavaScript source, line 14).
OBSERVATION: Output addresses are lowercased strings (source: supplied JavaScript source, line 14).
OBSERVATION: The assigned total is the sum of all computed output amounts (source: supplied JavaScript source, line 15).
OBSERVATION: The leftover wei, totalWei minus assigned, is added to the amount of the recipient with the largest bps value (source: supplied JavaScript source, lines 16-18).
OBSERVATION: The largest recipient is found by scanning recipients starting at index 1 and replacing the current largest only when a strictly greater bps is found, so ties keep the first recipient with the maximum bps (source: supplied JavaScript source, lines 16-17).
OBSERVATION: The function returns an array of objects with address and amount properties (source: supplied JavaScript source, line 19).

## Rounding and remainder behaviour

OBSERVATION: Because each share uses integer division by 10000n, fractional wei are discarded per recipient before the remainder is added (source: supplied JavaScript source, line 14).
INFERENCE: The discarded fractional wei from every recipient accumulate into the leftover wei that is paid to the largest-bps recipient (source: findings lines about line 14 and lines 15-18).
INFERENCE: For totalWei 100n with two 5000 bps recipients, each share is exactly 50n and the leftover is 0n, so the result is A 50, B 50 (source: supplied JavaScript source, lines 14-18).
INFERENCE: For totalWei 101n with two 5000 bps recipients, each base share is 50n, assigned is 100n, leftover is 1n, and it goes to the first recipient because both bps values tie and the first is kept as largest, giving A 51, B 50 (source: supplied JavaScript source, lines 14-18).
INFERENCE: For totalWei 10n with bps 3333, 3333, 3334, base shares are 3n, 3n, 3n, assigned is 9n, leftover is 1n, and C has the unique largest bps, giving A 3, B 3, C 4 (source: supplied JavaScript source, lines 14-18).
INFERENCE: For totalWei 7n with bps 7000 and 3000, base shares are 4n and 2n, assigned is 6n, leftover is 1n, and A has the largest bps, giving A 5, B 2 (source: supplied JavaScript source, lines 14-18).

## Error cases

OBSERVATION: Passing a non-bigint or negative totalWei throws TypeError before any recipient validation (source: supplied JavaScript source, line 2).
OBSERVATION: Passing a non-array, empty array, or array with more than 10 recipients throws RangeError (source: supplied JavaScript source, line 3).
OBSERVATION: Passing a recipient with non-integer bps or bps less than or equal to zero throws RangeError (source: supplied JavaScript source, lines 5-6).
OBSERVATION: Passing two recipients whose lowercased addresses match throws Error (source: supplied JavaScript source, lines 7-9).
OBSERVATION: Passing recipients whose bps sum is not 10000 throws RangeError (source: supplied JavaScript source, lines 12-13).
INFERENCE: A duplicate address differing only in letter case is rejected because addresses are lowercased before the duplicate check (source: supplied JavaScript source, lines 7-8).
INFERENCE: A bps sum of 9999 is rejected by the final sum check (source: supplied JavaScript source, lines 12-13).
INFERENCE: Zero recipients and eleven recipients are both rejected by the length check (source: supplied JavaScript source, line 3).
INFERENCE: Negative totalWei is rejected by the first check (source: supplied JavaScript source, line 2).

## Unknowns

UNKNOWN: Whether the caller expects addresses to be checksummed or otherwise validated beyond lowercasing, because the source only lowercases the address string (source: supplied JavaScript source, lines 7-8 and 14).
UNKNOWN: Whether the function is ever called with non-object recipient entries, because the source assumes r.bps and r.address exist without checking them (source: supplied JavaScript source, lines 5-8).
UNKNOWN: What happens if totalWei is so large that multiplication overflows the bigint range, because bigint has no fixed overflow in JavaScript but the environment may impose limits (source: supplied JavaScript source, line 14).
UNKNOWN: Whether the returned array is frozen or mutable after return, because the source returns a freshly mapped array with no freezing call (source: supplied JavaScript source, line 19).