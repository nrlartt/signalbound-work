# Specification

## Interfaces

dailyGdd(minT, maxT, base, cap) returns a number.
seasonGdd(days, base, cap) returns an object with fields sum, skipped, and counted.
chillHours(samples, low, high) returns a number.

## Data model

dailyGdd accepts four finite numbers.
seasonGdd accepts an array of day objects, each with numeric min and max fields, plus finite base and cap numbers.
chillHours accepts an array of numeric samples plus low and high bounds.
seasonGdd result object contains sum as a number, skipped as a count of days not added, and counted as the number of days added.

## Requirements

1. dailyGdd must throw a TypeError when any argument is not a finite number.
2. dailyGdd must return zero when cap is less than base.
3. dailyGdd must treat minT and maxT as unordered by swapping them when minT is greater than maxT.
4. dailyGdd must return zero when the entire temperature interval is below base.
5. dailyGdd must return cap minus base when the entire temperature interval is above cap.
6. dailyGdd must clip the lower bound up to base when it is below base.
7. dailyGdd must clip the upper bound down to cap when it is above cap.
8. dailyGdd must return the average of the clipped lower and upper bounds minus base.
9. seasonGdd must throw a TypeError when days is not an array.
10. seasonGdd must skip any day that is falsy or lacks numeric min or max fields.
11. seasonGdd must skip any day for which dailyGdd throws.
12. seasonGdd must return sum, skipped, and counted where counted equals array length minus skipped.
13. chillHours must return zero when samples is not an array.
14. chillHours must skip non-numeric and non-finite samples.
15. chillHours must count samples in the half-open interval from low inclusive to high exclusive.
16. chillHours must return the total count of qualifying samples.

## Formats

Input temperatures, bases, caps, and bounds are finite numbers.
seasonGdd input days are objects with numeric min and max properties.
seasonGdd output is a plain object with numeric sum, skipped, and counted fields.
chillHours output is a non-negative integer count.

## Errors
dailyGdd throws TypeError for non-finite or non-numeric arguments.
seasonGdd throws TypeError when days is not an array.
seasonGdd does not throw for invalid day contents; those days are skipped.
chillHours does not throw for non-array samples; it returns zero.
chillHours does not throw for invalid sample contents; those samples are skipped.

## Test cases

dailyGdd(5, 15, 10, 30) -> 0
dailyGdd(20, 25, 10, 21) -> 7.5
dailyGdd(16, 8, 10, 30) -> 0
dailyGdd(0, 5, 10, 30) -> 0
dailyGdd(32, 40, 10, 30) -> 20
dailyGdd(10, 20, 30, 10) -> 0
dailyGdd(10, 20, 'a', 30) throws TypeError
dailyGdd(10, 20, 10, Infinity) throws TypeError
seasonGdd([{min: 5, max: 15}, {min: 'x', max: 10}], 10, 30) -> { sum: 0, skipped: 1, counted: 1 }
seasonGdd([{min: 10, max: 20}, {min: 0, max: 5}], 10, 30) -> { sum: 5, skipped: 0, counted: 2 }
seasonGdd('not an array', 10, 30) throws TypeError
chillHours([1, 7, 7.5, 8, 12, NaN], 0, 8) -> 3
chillHours([8, 8, 8], 0, 8) -> 0
chillHours([0, 7.999], 0, 8) -> 2
chillHours('not an array', 0, 8) -> 0
chillHours([1, NaN, Infinity, 7], 0, 8) -> 2