# Findings

## Source examined

OBSERVATION: The target is a single JavaScript module exporting applyEdits plus a helper rank function. (source: supplied paid brief)
OBSERVATION: applyEdits takes two parameters named page and edits. (source: supplied paid brief)
OBSERVATION: page is expected to have a lines property holding an array of line objects with id, text, source, kind and optionally removed fields. (source: supplied paid brief)
OBSERVATION: edits is expected to be an array of edit objects each carrying an op field. (source: supplied paid brief)

## Copying and indexing

OBSERVATION: lines is built by mapping page.lines and shallow-copying each line object. (source: supplied paid brief)
OBSERVATION: byId is a Map from line id to the copied line object. (source: supplied paid brief)
OBSERVATION: nextId starts at one more than the maximum existing line id, or 1 if there are no lines. (source: supplied paid brief)
INFERENCE: Existing line ids are not reused after removal; new ids always increase. (source: supplied paid brief)

## Add operation

OBSERVATION: An edit with op equal to "add" is treated as an addition. (source: supplied paid brief)
OBSERVATION: Add is rejected with reason "bad-text" when e.text is falsy or longer than 280 characters. (source: supplied paid brief)
OBSERVATION: Add is rejected with reason "no-source" when e.source is falsy. (source: supplied paid brief)
OBSERVATION: Accepted adds create a line with id nextId, text trimmed from e.text, source from e.source, and kind from e.kind or "claimed" when e.kind is absent. (source: supplied paid brief)
OBSERVATION: Accepted adds push the line onto lines and record it in byId, then increment nextId. (source: supplied paid brief)
INFERENCE: Whitespace-only text passes the length check but is stored as an empty string after trimming. (source: supplied paid brief)
INFERENCE: A missing kind defaults to "claimed", which has rank 0. (source: supplied paid brief)

## Fix operation

OBSERVATION: An edit with op equal to "fix" is treated as a modification of an existing line. (source: supplied paid brief)
OBSERVATION: Fix is rejected with reason "unknown-id" when no line exists for e.id or the line is already removed. (source: supplied paid brief)
OBSERVATION: Fix is rejected with reason "upgrade-needs-source" when the new kind ranks higher than the current kind and e.source is falsy. (source: supplied paid brief)
OBSERVATION: When e.text is not undefined, the line text is replaced with e.text trimmed. (source: supplied paid brief)
OBSERVATION: When e.kind is not undefined, the line kind is replaced with e.kind. (source: supplied paid brief)
OBSERVATION: When e.source is truthy, the line source is replaced with e.source. (source: supplied paid brief)
INFERENCE: Downgrading kind is accepted without a source because the upgrade check only fires when the new rank is strictly greater. (source: supplied paid brief)
INFERENCE: Setting kind to an unknown value is accepted because no validation is performed on kind. (source: supplied paid brief)
INFERENCE: An empty-string source is treated as absent for both add and upgrade checks. (source: supplied paid brief)

## Remove operation

OBSERVATION: An edit with op equal to "remove" is treated as a deletion request. (source: supplied paid brief)
OBSERVATION: Remove is rejected with reason "unknown-id" when no line exists for e.id or the line is already removed. (source: supplied paid brief)
OBSERVATION: Accepted remove sets line.removed to true but does not delete the line from the array or from byId. (source: supplied paid brief)
INFERENCE: Removed lines are excluded from the returned lines array by the final filter. (source: supplied paid brief)
INFERENCE: A removed line can still be looked up by id in byId, but fix and remove treat it as unknown and reject it. (source: supplied paid brief)

## Unknown operation

OBSERVATION: Any edit whose op is not "add", "fix", or "remove" is rejected with reason "unknown-op". (source: supplied paid brief)

## Return value

OBSERVATION: The function returns an object with lines and rejected properties. (source: supplied paid brief)
OBSERVATION: lines contains only copied line objects whose removed flag is not true, in original array order. (source: supplied paid brief)
OBSERVATION: rejected contains objects with edit and reason properties, in the order rejections occurred. (source: supplied paid brief)

## Kind ranking

OBSERVATION: rank maps claimed to 0, inferred to 1, observed to 2, verified to 3, and any other value to -1. (source: supplied paid brief)
OBSERVATION: The upgrade check compares rank(e.kind) against rank(line.kind). (source: supplied paid brief)
INFERENCE: An unknown current kind has rank -1, so almost any kind edit counts as an upgrade and requires a source. (source: supplied paid brief)
INFERENCE: An unknown new kind has rank -1, so it never counts as an upgrade and never triggers the source requirement. (source: supplied paid brief)

## Unguarded inputs

UNKNOWN: Whether page is null, undefined, or missing lines causes a runtime error, because the code does not guard page before accessing page.lines. (source: supplied paid brief; examined the entire function body and found no page validation)
UNKNOWN: Whether edits is null, undefined, or non-iterable causes a runtime error, because the code iterates edits directly without validation. (source: supplied paid brief; examined the entire function body and found no edits validation)
UNKNOWN: Whether individual edit objects lack op, id, text, kind, or source is handled only implicitly through comparisons and property reads, with no explicit schema validation. (source: supplied paid brief; examined the entire function body and found no edit schema validation)
UNKNOWN: Whether line objects lack id, text, source, kind, or removed affects byId construction, nextId calculation, and removal checks, with no validation of incoming page lines. (source: supplied paid brief; examined the entire function body and found no line validation)
UNKNOWN: Whether e.text is a non-string value such as a number affects the length check and trim call in ways not determined from the source alone. (source: supplied paid brief; the source reads e.text.length and calls e.text.trim() without type checking)
UNKNOWN: Whether e.kind is a non-string value affects rank lookup and assignment in ways not determined from the source alone. (source: supplied paid brief; the source indexes rank object with e.kind without type checking)
UNKNOWN: Whether e.source is a non-string truthy value is accepted as a source, with no type constraint visible in the source. (source: supplied paid brief; the source only tests e.source for truthiness)
UNKNOWN: Whether negative or non-integer line ids in page affect nextId and byId behaviour is not addressed by the source. (source: supplied paid brief; nextId uses Math.max over ids without constraining them)
UNKNOWN: Whether duplicate line ids in page affect byId behaviour is not addressed by the source, because later entries overwrite earlier ones in the Map. (source: supplied paid brief; byId construction overwrites on duplicate keys)
UNKNOWN: Whether extremely large ids cause nextId overflow is not addressed by the source. (source: supplied paid brief; nextId is computed with arithmetic and no bounds)
UNKNOWN: Whether the caller relies on the original page object being unmutated is partially addressed: lines are shallow-copied, but nested objects inside line values are shared references. (source: supplied paid brief; spread copy copies property references, not nested structures)

## Ordering and side effects

OBSERVATION: Edits are processed in array order, and later edits can see the effects of earlier accepted edits. (source: supplied paid brief)
OBSERVATION: The original page.lines array is not replaced, but its line objects are shallow-copied so the copies are mutated instead of the originals. (source: supplied paid brief)
INFERENCE: The returned lines array is a new array containing references to the copied line objects. (source: supplied paid brief)
