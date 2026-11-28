# Findings

## Source examined

OBSERVATION: The target is a JavaScript module exporting three functions: dailyGdd, seasonGdd, and chillHours (source: supplied module source, line 1 comment).
OBSERVATION: Line 1 is a comment describing growing-degree-day and chill-hour helpers for a conservatory log (source: supplied module source, line 1).

## dailyGdd type checks

OBSERVATION: dailyGdd throws TypeError with message 'numeric required' if any of minT, maxT, base, cap is not a number or is not finite (source: supplied module source, lines 2-4).
OBSERVATION: NaN, Infinity, -Infinity, strings, booleans, null, undefined, and objects all fail the type check (source: supplied module source, lines 2-4).
INFERENCE: The type check runs before any arithmetic, so no invalid numeric operation can occur inside dailyGdd (source: supplied module source, lines 2-4).
UNKNOWN: Whether callers catch the TypeError or let it propagate is not determined by the module source (source: supplied module source, lines 2-4).

## cap < base

OBSERVATION: dailyGdd returns 0 immediately when cap is less than base, after the type check (source: supplied module source, line 5).
INFERENCE: An inverted base/cap pair yields zero degree-days regardless of temperature values (source: supplied module source, line 5).

## minT > maxT swap

OBSERVATION: dailyGdd swaps lo and hi when minT is greater than maxT, so the lower temperature always becomes lo (source: supplied module source, lines 7-9).
INFERENCE: The function accepts unordered daily minimum and maximum temperatures and normalises them internally (source: supplied module source, lines 7-9).

## Whole interval below base

OBSERVATION: dailyGdd returns 0 when hi is less than base, after the swap (source: supplied module source, line 10).
INFERENCE: If the entire temperature interval lies below the base, no growing-degree days accumulate (source: supplied module source, line 10).

## Whole interval above cap

OBSERVATION: dailyGdd returns cap - base when lo is greater than cap (source: supplied module source, line 11).
INFERENCE: If the entire interval lies above the cap, the function returns the full capped range width rather than zero (source: supplied module source, line 11).

## Clipping of lo and hi

OBSERVATION: dailyGdd clips lo up to base when lo is below base (source: supplied module source, line 12).
OBSERVATION: dailyGdd clips hi down to cap when hi is above cap (source: supplied module source, line 13).
INFERENCE: After clipping, the returned value is the average of the clipped lo and hi minus base (source: supplied module source, line 14).

## seasonGdd missing or non-numeric days

OBSERVATION: seasonGdd throws TypeError with message 'array required' if days is not an array (source: supplied module source, line 16).
OBSERVATION: seasonGdd skips a day when d is falsy, or when d.min or d.max is not a number (source: supplied module source, line 19).
OBSERVATION: seasonGdd increments skipped and continues for each skipped day (source: supplied module source, line 19).
OBSERVATION: seasonGdd calls dailyGdd inside a try block and skips the day if dailyGdd throws (source: supplied module source, lines 20-22).
OBSERVATION: seasonGdd returns an object with sum, skipped, and counted, where counted equals days.length minus skipped (source: supplied module source, lines 23-24).
INFERENCE: A day with a missing min or max property is treated as non-numeric and skipped (source: supplied module source, line 19).
INFERENCE: A day whose min or max is NaN passes the typeof check but causes dailyGdd to throw, so it is caught and skipped (source: supplied module source, lines 19-22).
INFERENCE: A day whose min or max is Infinity passes the typeof check but causes dailyGdd to throw, so it is caught and skipped (source: supplied module source, lines 19-22).
UNKNOWN: Whether seasonGdd validates base and cap before delegating to dailyGdd cannot be determined from the source alone, because dailyGdd performs its own validation (source: supplied module source, lines 16-24).

## chillHours NaN or non-array

OBSERVATION: chillHours returns 0 immediately if samples is not an array (source: supplied module source, line 26).
OBSERVATION: chillHours skips any sample that is not a number or is not finite, including NaN, Infinity, and -Infinity (source: supplied module source, lines 28-29).
INFERENCE: A non-array input to chillHours yields zero hours with no error thrown (source: supplied module source, line 26).
INFERENCE: NaN values inside a valid array do not contribute to the chill-hour count (source: supplied module source, lines 28-29).

## Half-open chill-hour interval

OBSERVATION: chillHours counts a sample when it is greater than or equal to low and strictly less than high (source: supplied module source, line 30).
INFERENCE: The chill-hour interval is half-open: [low, high), including low but excluding high (source: supplied module source, line 30).

## Surprising behaviours

OBSERVATION: dailyGdd(10, 20, 30, 10) returns 0 because cap is less than base, even though the temperatures are valid (source: supplied module source, line 5).
OBSERVATION: dailyGdd(32, 40, 10, 30) returns 20, which is cap minus base, not zero, even though all temperatures exceed the cap (source: supplied module source, line 11).
OBSERVATION: seasonGdd counts a day as counted when dailyGdd throws due to invalid base or cap, even though the day object itself looked valid (source: supplied module source, lines 20-22).
OBSERVATION: chillHours returns 0 for a non-array input instead of throwing, unlike seasonGdd which throws TypeError for a non-array (source: supplied module source, lines 16 and 26).
OBSERVATION: dailyGdd(0, 5, 10, 30) returns 0 because the whole interval is below base (source: supplied module source, line 10).
OBSERVATION: dailyGdd(16, 8, 10, 30) swaps the arguments to lo=8 and hi=10 before clipping lo to base, yielding 0 (source: supplied module source, lines 7-10).

## Coverage limits

UNKNOWN: The runtime type of values passed at call sites cannot be established from the module source alone (source: supplied module source, all lines).
UNKNOWN: Performance characteristics for very large seasonGdd arrays cannot be established from the source alone (source: supplied module source, lines 16-24).