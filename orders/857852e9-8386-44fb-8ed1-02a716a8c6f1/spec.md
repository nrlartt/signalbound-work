# specification

## Interfaces

The module exports a single default function.

When called with one string argument, the function parses a duration string and returns a number of milliseconds.

When called with one numeric argument, the function formats a millisecond value into a short duration string.

When called with a numeric argument and a second object argument containing a long property set to true, the function formats the millisecond value into a long duration string.

## Data model

Duration values are represented as numbers of milliseconds.

Parsing input is a string containing an optional sign, a numeric value, and a unit.

Formatting input is a finite number of milliseconds.

Formatting output is a string composed of a number, a space, and a unit name.

Long-form output uses full unit names; short-form output uses abbreviated unit names.

## Requirements

R1: The parser accepts a positive integer followed by a supported unit and returns the equivalent milliseconds.

R2: The parser accepts a negative integer followed by a supported unit and returns the negated equivalent milliseconds.

R3: The parser accepts a positive fractional number followed by a supported unit and returns the equivalent milliseconds.

R4: The parser accepts a negative fractional number followed by a supported unit and returns the negated equivalent milliseconds.

R5: The parser accepts the long unit names day, hour, minute, second and millisecond.

R6: The parser accepts the short unit names d, h, m, s and ms.

R7: The formatter accepts a positive whole number of milliseconds and returns a short-form string using the largest applicable unit.

R8: The formatter accepts a negative whole number of milliseconds and returns a short-form string with a leading minus sign.

R9: The formatter accepts zero milliseconds and returns a short-form string representing zero.

R10: The formatter accepts a positive whole number of milliseconds with the long option and returns a long-form string using the largest applicable unit.

R11: The formatter accepts a negative whole number of milliseconds with the long option and returns a long-form string with a leading minus sign.

R12: The formatter accepts zero milliseconds with the long option and returns a long-form string representing zero.

R13: The formatter selects the largest unit such that the displayed value is at least one.

R14: The formatter rounds the displayed value to the nearest whole number.

R15: The parser rejects empty input.

R16: The parser rejects input with no numeric value.

R17: The parser rejects input with no unit.

R18: The parser rejects input with an unsupported unit.

R19: The parser rejects input that cannot be interpreted as a duration.

R20: The formatter rejects non-numeric input.

R21: The formatter rejects non-finite numeric input.

R22: Invalid input to the parser results in an error.

R23: Invalid input to the formatter results in an error.

## Formats

Short-form units: d, h, m, s, ms.

Long-form units: day, hour, minute, second, millisecond.

Parsed string format: optional sign, digits, optional decimal point and digits, optional whitespace, unit.

Formatted string format: optional minus sign, integer value, space, unit.

Long-form formatted string format: optional minus sign, integer value, space, full unit name.

## Errors

The parser throws an error for empty strings, strings without a number, strings without a unit, strings with an unsupported unit, and any string that cannot be parsed as a duration.

The formatter throws an error for non-numeric arguments and for non-finite numbers such as Infinity or NaN.

## Test cases

Parsing: '1s' returns 1000.

Parsing: '1m' returns 60000.

Parsing: '1h' returns 3600000.

Parsing: '1d' returns 86400000.

Parsing: '1 ms' returns 1.

Parsing: '-1s' returns -1000.

Parsing: '-1m' returns -60000.

Parsing: '-1h' returns -3600000.

Parsing: '-1d' returns -86400000.

Parsing: '1.5s' returns 1500.

Parsing: '1.5m' returns 90000.

Parsing: '-1.5h' returns -5400000.

Parsing: '1 day' returns 86400000.

Parsing: '1 hour' returns 3600000.

Parsing: '1 minute' returns 60000.

Parsing: '1 second' returns 1000.

Parsing: '1 millisecond' returns 1.

Parsing: '' throws an error.

Parsing: 'abc' throws an error.

Parsing: '100' throws an error.

Parsing: '100 years' throws an error.

Formatting: 1000 returns '1s'.

Formatting: 60000 returns '1m'.

Formatting: 3600000 returns '1h'.

Formatting: 86400000 returns '1d'.

Formatting: -1000 returns '-1s'.

Formatting: 0 returns '0ms'.

Formatting: 90000 returns '1m' or '90s' depending on the chosen largest-unit rule.

Formatting: 900000 returns '15m'.

Formatting: 1000 with long option returns '1 second'.

Formatting: 60000 with long option returns '1 minute'.

Formatting: 3600000 with long option returns '1 hour'.

Formatting: 86400000 with long option returns '1 day'.

Formatting: -1000 with long option returns '-1 second'.

Formatting: 0 with long option returns '0 milliseconds'.

Formatting: 'abc' throws an error.

Formatting: NaN throws an error.

Formatting: Infinity throws an error.

Rounding: 999 returns '1s'.

Rounding: 999999 returns '17m' or '16m' depending on the rounding rule.

Rounding: 1500 returns '2s' or '1s' depending on the rounding rule.

Open question: the exact rounding rule for formatting is not established by the source material.

Open question: the exact unit selection threshold for formatting is not established by the source material.

Open question: the exact long-form pluralisation and singular forms are not established by the source material.

Open question: whether the parser accepts whitespace between number and unit is not established by the source material.

Open question: whether the parser accepts plural unit names is not established by the source material.