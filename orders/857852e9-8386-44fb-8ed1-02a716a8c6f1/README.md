# signalbound-duration

Parses duration strings into milliseconds and formats millisecond values into short or long duration strings.

## How to run

Install dependencies (none required beyond Node.js):

```
npm install
```

Run the implementation:

```
npm start
```

Run the tests:

```
npm test
```

## What the implementation cannot do

This implementation is written from the specification alone. The specification leaves the following open, so the implementation makes design choices for them rather than following a confirmed source:

- The exact rounding rule for formatting is not established; this implementation rounds the displayed value to the nearest whole number.
- The exact unit selection threshold for formatting is not established; this implementation selects the largest unit such that the displayed value is at least one.
- The exact long-form pluralisation and singular forms are not established; this implementation adds 's' for plural long-form units except for the value one.
- Whether the parser accepts whitespace between number and unit is not established; this implementation accepts optional whitespace.
- Whether the parser accepts plural unit names is not established; this implementation accepts only the exact long and short unit names listed in the specification.

The implementation never claims to have been run against or compared with the original package, because the original was not available to inspect.
