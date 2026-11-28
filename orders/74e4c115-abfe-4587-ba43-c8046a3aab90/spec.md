# Specification

## Interfaces
- packCount(sheetW, sheetH, frameW, frameH, margin, spacing): returns the number of frames that fit in the sheet.
- frameRect(index, cols, frameW, frameH, margin, spacing): returns the geometry of one frame or null.

## Data model
- All inputs are integers.
- packCount returns a non-negative integer count.
- frameRect returns null for negative index.
- frameRect returns an object with fields x, y, w, h, col, row when successful.
- x and y are the top-left origin of the frame.
- w and h are the frame width and height.
- col is the zero-based column index.
- row is the zero-based row index.

## Requirements
1. packCount must throw TypeError when any argument is not an integer.
2. frameRect must throw TypeError when any argument is not an integer.
3. packCount must return 0 when frameW is not positive.
4. packCount must return 0 when frameH is not positive.
5. packCount must return 0 when the inner width is smaller than frameW.
6. packCount must return 0 when the inner height is smaller than frameH.
7. The inner width is sheet width minus twice the margin.
8. The inner height is sheet height minus twice the margin.
9. Columns equal floor((inner width minus frame width) divided by (frame width plus spacing)) plus one.
10. Rows equal floor((inner height minus frame height) divided by (frame height plus spacing)) plus one.
11. packCount returns columns multiplied by rows.
12. frameRect must throw RangeError when cols is zero or negative.
13. frameRect must return null when index is negative.
14. Column equals index modulo cols.
15. Row equals floor(index divided by cols).
16. x equals margin plus col times (frame width plus spacing).
17. y equals margin plus row times (frame height plus spacing).
18. w equals frame width.
19. h equals frame height.

## Formats
- Inputs are integer numbers.
- packCount output is an integer number.
- frameRect success output is an object with numeric fields x, y, w, h, col, row.
- frameRect failure output for negative index is null.
- frameRect failure output for invalid cols is a RangeError.
- type validation failure output is a TypeError.

## Errors
- TypeError with message 'integers required' when any argument to packCount is not an integer.
- TypeError with message 'integers required' when any argument to frameRect is not an integer.
- RangeError with message 'cols' when cols is zero or negative in frameRect.
- No error is thrown for negative margin or negative spacing.
- No error is thrown for index values beyond the computed pack count.

## Test cases
1. packCount(64, 32, 16, 16, 0, 0) -> 4
2. packCount(70, 32, 16, 16, 4, 2) -> 2
3. packCount(10, 10, 16, 16, 0, 0) -> 0
4. packCount(32, 32, 8, 8, -4, 0) -> 25
5. packCount(64, 32, 0, 16, 0, 0) -> 0
6. packCount(64, 32, 16, 0, 0, 0) -> 0
7. packCount(64, 32, -1, 16, 0, 0) -> 0
8. packCount(64, 32, 16, -1, 0, 0) -> 0
9. packCount(16, 16, 16, 16, 0, 0) -> 1
10. packCount(16, 16, 16, 16, 1, 0) -> 0
11. frameRect(0, 4, 16, 16, 2, 1) -> { x: 2, y: 2, w: 16, h: 16, col: 0, row: 0 }
12. frameRect(5, 4, 16, 16, 2, 1) -> { x: 2, y: 19, w: 16, h: 16, col: 1, row: 1 }
13. frameRect(-1, 4, 16, 16, 0, 0) -> null
14. frameRect(0, 0, 16, 16, 0, 0) throws RangeError
15. packCount(1.5, 32, 16, 16, 0, 0) throws TypeError