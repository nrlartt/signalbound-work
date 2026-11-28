# Specification

## Interfaces

- cones(): returns a list of cone label strings.
- normalize(cone): accepts a cone label and returns its canonical string label, or rejects it.
- celsius(cone): accepts a cone label and returns its Celsius temperature as an integer, or rejects it.
- midpoint(a, b): accepts two cone labels and returns an integer Celsius midpoint.
- inBand(cone, temp, band): accepts a cone label, a temperature, and a band, and returns a boolean.

## Data model

- Cone labels are strings drawn from a fixed table of 32 entries.
- Labels include unpadded numbers "1" through "10", padded two-digit forms "01" through "10", and three-digit forms "020" through "022".
- Each label maps to a unique integer Celsius value.
- The band is a non-negative integer.
- The temperature is a finite number.

## Requirements

1. cones() shall return exactly 32 label strings.
2. The number 1 through 10 shall be accepted by normalize and celsius, returning the corresponding unpadded string label.
3. The string "1" through "10" shall be accepted by normalize and celsius, returning the same string.
4. The string "06" shall be accepted and resolve to its table entry.
5. The string "022" shall be accepted and resolve to its table entry.
6. The number 0 shall be rejected with the error "unknown cone".
7. The number 22 shall be rejected with the error "unknown cone".
8. The string "0" shall be rejected with the error "unknown cone".
9. The string "06 " (with trailing space) shall be rejected with the error "unknown cone".
10. The empty string shall be rejected with the error "unknown cone".
11. Non-integer numbers shall be rejected with the error "unknown cone".
12. Numbers below 1 or above 10 shall be rejected with the error "unknown cone".
13. celsius("06") shall return 996.
14. celsius("6") shall return 1222.
15. midpoint("06", 6) shall return 1109.
16. inBand("6", 1222, 0) shall return true.
17. inBand("10", 1233, 10) shall return false.
18. inBand shall treat the band as inclusive at both edges.
19. A negative band shall cause inBand to throw "bad band".
20. A non-integer band shall cause inBand to throw "bad band".
21. A non-finite temperature shall cause inBand to throw "bad band".
22. An invalid cone passed to inBand shall result in the "unknown cone" error.
23. The table values are the sole authority for Celsius temperatures; no external pyrometric chart applies.

## Formats

- Cone labels are case-sensitive strings with no surrounding whitespace.
- Temperatures are finite numbers.
- Bands are non-negative integers.
- Midpoint results are integers produced by flooring the average of two Celsius values.

## Errors

- "unknown cone" is thrown for any cone label that is not an exact table key, for the number 0, for the string "0", for numbers outside 1..10, for non-integer numbers, and for empty strings.
- "bad band" is thrown when the temperature is not finite, the band is not an integer, or the band is negative.

## Test cases

1. cones() returns 32 entries.
2. celsius(1) returns 1154.
3. celsius(10) returns 1305.
4. celsius("06") returns 996.
5. celsius("022") returns 586.
6. celsius("06 ") throws "unknown cone".
7. celsius(0) throws "unknown cone".
8. celsius(22) throws "unknown cone".
9. celsius("0") throws "unknown cone".
10. celsius("") throws "unknown cone".
11. celsius(1.5) throws "unknown cone".
12. midpoint("06", 6) returns 1109.
13. inBand("6", 1222, 0) returns true.
14. inBand("10", 1233, 10) returns false.
15. inBand("6", 1223, 0) returns false.
16. inBand("6", 1221, 0) returns false.
17. inBand("6", 1222, 1) returns true.
18. inBand("6", 1223, 1) returns true.
19. inBand("6", 1221, 1) returns true.
20. inBand("6", 1222, -1) throws "bad band".
21. inBand("6", 1222, 1.5) throws "bad band".
22. inBand("6", Infinity, 0) throws "bad band".
23. inBand("6", NaN, 0) throws "bad band".
24. inBand("99", 1000, 0) throws "unknown cone".