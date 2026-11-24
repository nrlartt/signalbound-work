# spec.md

## Interfaces

The behaviour is exposed as a single function named splitByBps.
It accepts two inputs: a total amount in wei and a list of recipients.
It returns a list of payment entries.
Each payment entry contains a lowercased address and an amount in wei.

## Data model

Total wei is a non-negative integer.
A recipient is an object with an address field and a bps field.
The address field is a string.
The bps field is a positive integer.
The output entry is an object with an address field and an amount field.
The address field in output is the input address converted to lowercase.
The amount field in output is a non-negative integer in wei.

## Requirements

1. The function must reject a totalWei value that is not a non-negative integer with a type error.
2. The function must reject a recipients value that is not an array, is empty, or contains more than ten entries with a range error.
3. The function must reject any recipient whose bps is not a positive integer with a range error.
4. The function must reject any recipient list containing the same address more than once when compared case-insensitively with an error.
5. The function must reject any recipient list whose bps values do not sum to exactly ten thousand with a range error.
6. Each output address must be the lowercased form of the corresponding input address.
7. Each base amount must be computed by multiplying total wei by the recipient bps and dividing by ten thousand, discarding any fraction.
8. The sum of base amounts must be subtracted from total wei to determine the leftover wei.
9. The leftover wei must be added to the amount of the recipient with the highest bps value.
10. If several recipients share the highest bps value, the leftover wei must go to the first such recipient in the input order.
11. The function must return all output entries in the same order as the input recipients.
12. The total of all output amounts must equal the original total wei.

## Formats

Input total wei is an integer value.
Input bps is an integer measured in basis points, where ten thousand represents the whole.
Output amount is an integer value in wei.
Output address is a lowercase string.
Error messages are free-form text and must not be relied upon for programmatic decisions.

## Errors

A type error is thrown when totalWei is not a non-negative integer.
A range error is thrown when the recipient count is outside one to ten.
A range error is thrown when any bps is not a positive integer.
An error is thrown when any address appears more than once ignoring case.
A range error is thrown when bps values do not sum to ten thousand.

## Test cases

1. splitByBps(100n, [A 5000, B 5000]) returns A 50, B 50.
2. splitByBps(101n, [A 5000, B 5000]) returns A 51, B 50.
3. splitByBps(10n, [A 3333, B 3333, C 3334]) returns A 3, B 3, C 4.
4. splitByBps(7n, [A 7000, B 3000]) returns A 5, B 2.
5. splitByBps(1000n, [A 2500, B 2500, C 2500, D 2500]) returns A 250, B 250, C 250, D 250.
6. splitByBps(9999n, [A 5000, B 5000]) returns A 5000, B 4999.
7. splitByBps(1n, [A 1, B 9999]) returns A 0, B 1.
8. splitByBps(10000n, [A 10000]) returns A 10000.
9. splitByBps(0n, [A 5000, B 5000]) returns A 0, B 0.
10. splitByBps(100n, [a 5000, A 5000]) throws an error for duplicate recipient.
11. splitByBps(100n, [A 5000, B 4999]) throws a range error because bps sum is 9999.
12. splitByBps(100n, [A 0, B 10000]) throws a range error because bps is not positive.
13. splitByBps(100n, []) throws a range error because there are zero recipients.
14. splitByBps(100n, [A 1000, B 1000, C 1000, D 1000, E 1000, F 1000, G 1000, H 1000, I 1000, J 1000, K 1000]) throws a range error because there are eleven recipients.
15. splitByBps(-1n, [A 5000, B 5000]) throws a type error because totalWei is negative.