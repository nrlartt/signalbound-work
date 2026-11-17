# findings

## Source material

OBSERVATION: The paid brief names the npm package 'ms' at https://github.com/vercel/ms and describes it as parsing duration strings such as '2 days', '1h', '-3.5m' and formatting milliseconds in short and long forms (source: paid brief).

OBSERVATION: The paid brief requires a dependency-free Node.js ES module with tests covering every unit, rounding, negatives and invalid input (source: paid brief).

OBSERVATION: No source code, README, repository contents, binary, compiled output or runtime behaviour of the 'ms' package was carried in the brief or made available for inspection (source: paid brief and available materials).

## Parsing behaviour

OBSERVATION: The package accepts duration strings composed of a numeric value followed by a unit (source: paid brief examples '2 days', '1h', '-3.5m').

OBSERVATION: The package accepts negative durations, indicated by a leading minus sign before the number (source: paid brief example '-3.5m').

OBSERVATION: The package accepts fractional numeric values (source: paid brief example '-3.5m').

OBSERVATION: The package supports at least the units days, hours, minutes, seconds and milliseconds, in both long and abbreviated forms (source: paid brief examples '2 days', '1h', '-3.5m').

INFERENCE: The package converts the parsed value and unit into a total number of milliseconds (source: paid brief description of parsing duration strings and formatting milliseconds).

INFERENCE: A leading minus sign negates the resulting millisecond value (source: paid brief example '-3.5m').

INFERENCE: Fractional values are supported, so the conversion must handle non-integer multipliers (source: paid brief example '-3.5m').

UNKNOWN: The complete list of accepted unit aliases and their exact spelling (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser accepts whitespace between the number and the unit (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser accepts a leading plus sign (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser accepts decimal numbers with a leading dot such as '.5s' (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser accepts scientific notation such as '1e3s' (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser is case-sensitive for unit names (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser accepts plural unit forms such as 'days' as well as singular 'day' (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser accepts multiple components in one string such as '1h 30m' (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser accepts strings with only a number and no unit (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser accepts strings with only a unit and no number (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser accepts empty strings (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the parser accepts non-string inputs such as numbers (source: no package source or documentation was available to inspect).

UNKNOWN: The exact invalid inputs the parser rejects and whether it throws or returns a special value (source: no package source or documentation was available to inspect).

## Formatting behaviour

OBSERVATION: The package formats a millisecond value into a human-readable duration string (source: paid brief).

OBSERVATION: The package provides a short form and a long form of formatting (source: paid brief).

INFERENCE: The short form uses abbreviated unit names such as 'h', 'm', 's', 'ms' (source: paid brief example '1h' and description of short form).

INFERENCE: The long form uses full unit names such as 'hour', 'minute', 'second', 'millisecond' (source: paid brief description of long form).

UNKNOWN: The exact long-form strings produced for each unit (source: no package source or documentation was available to inspect).

UNKNOWN: The exact short-form strings produced for each unit (source: no package source or documentation was available to inspect).

UNKNOWN: The threshold at which formatting switches from one unit to a larger unit (source: no package source or documentation was available to inspect).

UNKNOWN: Whether formatting rounds the millisecond value or truncates it (source: no package source or documentation was available to inspect).

UNKNOWN: How formatting handles negative millisecond values (source: no package source or documentation was available to inspect).

UNKNOWN: How formatting handles zero milliseconds (source: no package source or documentation was available to inspect).

UNKNOWN: How formatting handles non-integer millisecond values (source: no package source or documentation was available to inspect).

UNKNOWN: How formatting handles very large millisecond values (source: no package source or documentation was available to inspect).

UNKNOWN: Whether formatting accepts options such as decimal places or unit selection (source: no package source or documentation was available to inspect).

## Rounding behaviour

OBSERVATION: The paid brief explicitly lists rounding as a behaviour to be covered by tests (source: paid brief).

INFERENCE: Rounding applies when converting fractional duration strings to milliseconds and when formatting millisecond values into strings (source: paid brief requirement to test rounding).

UNKNOWN: Whether parsing rounds fractional milliseconds to the nearest integer, truncates, or preserves fractional milliseconds (source: no package source or documentation was available to inspect).

UNKNOWN: Whether formatting rounds to the nearest whole unit, rounds half up, rounds half away from zero, or truncates (source: no package source or documentation was available to inspect).

UNKNOWN: The precision at which rounding occurs during parsing (source: no package source or documentation was available to inspect).

UNKNOWN: The precision at which rounding occurs during formatting (source: no package source or documentation was available to inspect).

## Error handling

UNKNOWN: Whether invalid input throws an exception, returns NaN, returns undefined, or returns null (source: no package source or documentation was available to inspect).

UNKNOWN: Whether out-of-range numeric values throw or are clamped (source: no package source or documentation was available to inspect).

UNKNOWN: Whether non-finite values such as Infinity or NaN are accepted or rejected (source: no package source or documentation was available to inspect).

## Package interface

UNKNOWN: The exported function name or names (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the package is a CommonJS module, an ES module, or both (source: no package source or documentation was available to inspect).

UNKNOWN: Whether the package exposes separate parse and format functions or a single overloaded function (source: no package source or documentation was available to inspect).

UNKNOWN: The package version investigated (source: no package source or documentation was available to inspect).

## Investigation limits

UNKNOWN: The observable behaviour of the package could not be confirmed by running it, because no installation, binary, repository or runtime output was provided (source: paid brief and available materials).

UNKNOWN: The documented behaviour could not be confirmed by reading a README or API reference, because no such document was provided (source: paid brief and available materials).

UNKNOWN: The exact source code could not be reviewed because no repository contents were provided (source: paid brief and available materials).

## Specification basis

INFERENCE: The specification in spec.md is written from the paid brief examples and requirements alone, with all unresolved behaviours marked as open questions (source: paid brief and the UNKNOWN lines above).

INFERENCE: The next step must implement the module from spec.md and may need to make design decisions for the open questions, recording them as assumptions (source: spec.md open questions).