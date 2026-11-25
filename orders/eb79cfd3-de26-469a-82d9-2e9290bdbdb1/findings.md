# Investigation findings

## Source material

OBSERVATION: The brief supplies a complete JavaScript module defining an exported function named diffLines (source: paid brief source block).
OBSERVATION: The function takes two parameters named before and after (source: paid brief source block).
OBSERVATION: Each parameter is expected to be an array of objects with id, text, and source properties (source: paid brief source block).
OBSERVATION: The function builds a Map from before keyed by id (source: paid brief source block).
OBSERVATION: The function builds a Map from after keyed by id (source: paid brief source block).
OBSERVATION: If the size of the before Map differs from before.length, the function throws Error("duplicate id") (source: paid brief source block).
OBSERVATION: If the size of the after Map differs from after.length, the function throws Error("duplicate id") (source: paid brief source block).
OBSERVATION: The function iterates over entries of the after Map (source: paid brief source block).
OBSERVATION: When an id from after is absent from before, the id is pushed to added (source: paid brief source block).
OBSERVATION: When an id from after exists in before and either text or source differs, the id is pushed to changed (source: paid brief source block).
OBSERVATION: The function iterates over keys of the before Map (source: paid brief source block).
OBSERVATION: When an id from before is absent from after, the id is pushed to removed (source: paid brief source block).
OBSERVATION: A local sort function sorts arrays numerically ascending using p - q (source: paid brief source block).
OBSERVATION: added, removed, and changed are each sorted before return (source: paid brief source block).
OBSERVATION: unchanged is computed as before.length minus removed.length minus changed.length (source: paid brief source block).
OBSERVATION: The function returns an object with added, removed, changed, and unchanged (source: paid brief source block).
OBSERVATION: Example: diffLines(B, [{id 1,"a","s"},{id 3,"C","s"},{id 5,"e","s"}]) returns added [5], removed [2], changed [3], unchanged 1 (source: paid brief behaviour block).
OBSERVATION: Example: reordering lines is not a change, but a different source is; only id 2's source changed gives changed [2], unchanged 2 (source: paid brief behaviour block).
OBSERVATION: Example: diffLines([], [{id 9,"x","s"}]) returns added [9], unchanged 0 (source: paid brief behaviour block).
OBSERVATION: Example: duplicate ids in either list throw Error("duplicate id") (source: paid brief behaviour block).
OBSERVATION: Example: diffLines(B, []) returns removed [1,2,3] (source: paid brief behaviour block).
OBSERVATION: Example: id lists are sorted ascending numerically (source: paid brief behaviour block).

## Inferences

INFERENCE: The function treats id as the stable identity of a line (source: OBSERVATION lines about Map construction and id-based lookups).
INFERENCE: Moving a line to a different position without changing id, text, or source produces no changed entry (source: OBSERVATION lines about changed detection and the reordering example).
INFERENCE: A change in text or source for the same id counts as changed (source: OBSERVATION lines about changed detection).
INFERENCE: unchanged counts only ids present in both lists that were not changed (source: OBSERVATION line about unchanged computation).
INFERENCE: Duplicate detection relies on Map size collapsing duplicate keys (source: OBSERVATION lines about Map construction and size comparison).

## Unknowns

UNKNOWN: The behaviour when before or after is not an array is not established (source: paid brief source block; it assumes array inputs and calls .map and .length without validation).
UNKNOWN: The behaviour when an element lacks id, text, or source is not established (source: paid brief source block; it reads those properties without validation).
UNKNOWN: The behaviour when id values are not numbers is not established (source: paid brief source block; sorting uses numeric subtraction, so non-numeric ids may produce non-numeric ordering).
UNKNOWN: The behaviour when text or source is undefined is not established (source: paid brief source block; strict inequality would treat undefined as different from a string).
UNKNOWN: Whether the function mutates its input arrays is not established (source: paid brief source block; it reads inputs but does not obviously write to them, though mutation is not explicitly addressed).
UNKNOWN: The behaviour when before or after is null or undefined is not established (source: paid brief source block; accessing .map on null or undefined would throw a TypeError).