# Findings

## Type checks
OBSERVATION: packCount throws TypeError('integers required') when any of sheetW, sheetH, frameW, frameH, margin, spacing is not an integer (source: paid brief source, lines 4-5).
OBSERVATION: frameRect throws TypeError('integers required') when any of index, cols, frameW, frameH, margin, spacing is not an integer (source: paid brief source, lines 23-24).
INFERENCE: Number.isInteger rejects NaN, Infinity, booleans, strings, null, undefined, objects, and non-integer numbers such as 1.5 (source: paid brief source, lines 4-5 and 23-24).
UNKNOWN: whether the runtime throws the TypeError before or after evaluating other argument expressions, because the source shows a single every() call with no ordering guarantee beyond argument evaluation (source: paid brief source, lines 4-5 and 23-24).

## Non-positive frame dimensions
OBSERVATION: packCount returns 0 when frameW <= 0 or frameH <= 0, after the integer type check passes (source: paid brief source, line 6).
INFERENCE: zero or negative frame width or height yields no packable frames regardless of sheet size, margin, or spacing (source: paid brief source, line 6).
UNKNOWN: whether packCount returns 0 or throws when frameW or frameH is NaN, because NaN fails the integer check before reaching line 6 (source: paid brief source, lines 4-6).

## Inner area smaller than one frame
OBSERVATION: packCount computes innerW = sheetW - 2 * margin and innerH = sheetH - 2 * margin (source: paid brief source, lines 7-8).
OBSERVATION: packCount returns 0 when innerW < frameW or innerH < frameH (source: paid brief source, line 9).
INFERENCE: if the sheet is too narrow or too short to fit even one frame inside the margins, the pack count is zero (source: paid brief source, lines 7-9).
UNKNOWN: whether innerW or innerH being exactly equal to frameW or frameH always yields at least one frame when spacing is zero, because the formula on line 10 would produce cols or rows of 1 in that case (source: paid brief source, lines 7-10).

## Packing formula including spacing and margin
OBSERVATION: packCount computes cols = Math.floor((innerW - frameW) / (frameW + spacing)) + 1 (source: paid brief source, line 10).
OBSERVATION: packCount computes rows = Math.floor((innerH - frameH) / (frameH + spacing)) + 1 (source: paid brief source, line 11).
OBSERVATION: packCount returns cols * rows (source: paid brief source, line 12).
INFERENCE: margin reduces the usable inner width and height by twice its value on each axis, while spacing increases the per-frame pitch on each axis (source: paid brief source, lines 7-11).
INFERENCE: the first frame always occupies the top-left corner of the inner area, and subsequent frames are placed left-to-right then top-to-bottom with spacing between them (source: paid brief source, lines 10-12).
UNKNOWN: whether packCount clamps cols or rows to a minimum of 1 when innerW equals frameW and spacing is positive, because the floor expression could yield 0 plus 1 (source: paid brief source, lines 7-11).

## Negative margin
OBSERVATION: packCount accepts negative margin because only integer-ness is validated, not sign (source: paid brief source, lines 4-5).
OBSERVATION: frameRect accepts negative margin for the same reason (source: paid brief source, lines 23-24).
INFERENCE: negative margin expands the inner area beyond the sheet edges and shifts frame origins outward from the sheet origin (source: paid brief source, lines 7-8 and 27-28).
UNKNOWN: whether callers are expected to handle negative x or y values produced by negative margin, because the module returns them without clamping or error (source: paid brief source, lines 7-8 and 27-28).

## frameRect with index < 0
OBSERVATION: frameRect returns null when index < 0, after the integer check and the cols <= 0 check (source: paid brief source, lines 25-26).
INFERENCE: negative indices are treated as "no frame" rather than wrapping around the sheet (source: paid brief source, line 26).
UNKNOWN: whether index < 0 should have been checked before cols <= 0, because the source checks cols first and would throw RangeError for cols <= 0 even when index is negative (source: paid brief source, lines 25-27).

## frameRect with cols <= 0
OBSERVATION: frameRect throws RangeError('cols') when cols <= 0 (source: paid brief source, line 27).
INFERENCE: zero or negative column count is invalid geometry and cannot produce a column index (source: paid brief source, line 27).
UNKNOWN: whether the error message 'cols' is part of a stable public contract or an internal label, because the source provides no documentation (source: paid brief source, line 27).

## Column and row derivation from index
OBSERVATION: frameRect computes col = index % cols (source: paid brief source, line 28).
OBSERVATION: frameRect computes row = Math.floor(index / cols) (source: paid brief source, line 29).
INFERENCE: index is laid out in row-major order: column is the remainder modulo column count, row is the quotient (source: paid brief source, lines 28-29).
INFERENCE: for non-negative index and positive cols, col is always in the range [0, cols-1] and row is always non-negative (source: paid brief source, lines 28-29).
UNKNOWN: whether index values greater than or equal to packCount's implied total are valid inputs to frameRect, because frameRect performs no bounds check against sheet dimensions (source: paid brief source, lines 23-31).

## Surprising behaviours
OBSERVATION: packCount(64, 32, 16, 16, 0, 0) returns 4, because innerW and innerH are 64 and 32, cols is 4 and rows is 2 (source: paid brief source, lines 7-12).
OBSERVATION: packCount(70, 32, 16, 16, 4, 2) returns 2, because innerW and innerH are 62 and 24, cols is floor(46/18)+1 = 3 and rows is floor(8/18)+1 = 1 (source: paid brief source, lines 7-12).
OBSERVATION: packCount(10, 10, 16, 16, 0, 0) returns 0, because innerW and innerH are 10, both smaller than frameW and frameH of 16 (source: paid brief source, lines 7-9).
OBSERVATION: packCount(32, 32, 8, 8, -4, 0) returns 25, because innerW and innerH are 40, cols is floor(32/8)+1 = 5 and rows is 5 (source: paid brief source, lines 7-11).
INFERENCE: negative margin can increase the pack count beyond what the sheet dimensions alone suggest, because it expands the inner area beyond the sheet bounds (source: paid brief source, lines 7-11 and the packCount(32, 32, 8, 8, -4, 0) observation).
OBSERVATION: frameRect(0, 4, 16, 16, 2, 1) returns { x: 2, y: 2, w: 16, h: 16, col: 0, row: 0 } (source: paid brief source, lines 23-31).
OBSERVATION: frameRect(5, 4, 16, 16, 2, 1) returns { x: 2, y: 19, w: 16, h: 16, col: 1, row: 1 } (source: paid brief source, lines 23-31).
OBSERVATION: frameRect(-1, 4, 16, 16, 0, 0) returns null (source: paid brief source, lines 25-26).
INFERENCE: frameRect can return x and y coordinates that lie outside the sheet when margin or spacing is large, because it never clamps positions to the sheet bounds (source: paid brief source, lines 27-28).
INFERENCE: packCount can return 0 while frameRect still returns a valid rectangle for index 0, because packCount checks sheet-level fit but frameRect only checks index sign and cols sign (source: paid brief source, lines 6-9 and 25-31).
INFERENCE: spacing of 0 with frameW equal to innerW yields exactly one column, because (innerW - frameW) / frameW is 0 and floor(0) + 1 is 1 (source: paid brief source, line 10).
INFERENCE: a non-integer argument such as 1.5 causes a TypeError even if all other arguments are valid integers, because the every() check fails on the first non-integer (source: paid brief source, lines 4-5 and 23-24).