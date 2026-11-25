# Specification for diffLines

## Interfaces

The module exports a single function named diffLines.
It accepts two arguments: before and after.
Each argument is an array of line records.
Each line record has an id, a text, and a source.
The function returns an object with four fields: added, removed, changed, and unchanged.

## Data model

A line record is identified by its id.
The id is compared by value across the two arrays.
The text and source fields are compared for equality to detect changes.
The returned object contains arrays of ids for added, removed, and changed lines.
The returned object contains a number for unchanged lines.

## Requirements

1. The function must identify lines by id across the before and after arrays.
2. An id present in after but absent from before must appear in added.
3. An id present in before but absent from after must appear in removed.
4. An id present in both arrays whose text or source differs must appear in changed.
5. An id present in both arrays whose text and source are identical must not appear in changed.
6. Reordering lines without changing id, text, or source must not produce changed entries.
7. unchanged must equal the number of ids present in both arrays minus the number of changed ids.
8. added, removed, and changed must each be sorted in ascending numeric order.
9. If before contains duplicate ids, the function must throw an error with message "duplicate id".
10. If after contains duplicate ids, the function must throw an error with message "duplicate id".
11. The function must not treat a line moved to a different position as changed when its id, text, and source are unchanged.
12. The function must treat a different source for the same id as a change even when text is unchanged.

## Formats

Input arrays contain objects with properties id, text, and source.
Output is an object with fields added (array of ids), removed (array of ids), changed (array of ids), and unchanged (number).
Id arrays are sorted ascending numerically.

## Errors

Duplicate ids in before cause an error with message "duplicate id".
Duplicate ids in after cause an error with message "duplicate id".

## Test cases

1. Given before with ids 1, 2, 3 and after with ids 1, 3, 5 where id 3 text differs, expect added [5], removed [2], changed [3], unchanged 1.
2. Given before with ids 1, 2, 3 and after with the same ids reordered and id 2 source changed, expect added [], removed [], changed [2], unchanged 2.
3. Given before empty and after with one record id 9, expect added [9], removed [], changed [], unchanged 0.
4. Given before with ids 1, 2, 3 and after empty, expect added [], removed [1, 2, 3], changed [], unchanged 0.
5. Given before with duplicate id 1 twice, expect an error with message "duplicate id".
6. Given after with duplicate id 2 twice, expect an error with message "duplicate id".
7. Given before and after identical with ids 1, 2, 3, expect added [], removed [], changed [], unchanged 3.
8. Given before id 1 text "a" and after id 1 text "b", expect changed [1], unchanged 0.
9. Given before id 1 source "s" and after id 1 source "t" with same text, expect changed [1], unchanged 0.
10. Given before ids 1, 2 and after ids 2, 1 with same text and source, expect added [], removed [], changed [], unchanged 2.
11. Given before ids 10, 2, 30 and after ids 2, 10, 30 with same content, expect added [], removed [], changed [], unchanged 3.
12. Given before ids 1, 2 and after ids 1, 2, 3 where id 3 is new, expect added [3], removed [], changed [], unchanged 2.