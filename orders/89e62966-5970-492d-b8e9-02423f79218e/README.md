# Bounded integer clamp

A Node.js ES module project implementing a bounded integer clamp function from the specification alone.

## How to run

Start the module:

```sh
npm start
```

Run the tests:

```sh
npm test
```

## Behaviour implemented

- `clamp(x, min, max)` returns `min` when `x` is below `min`.
- `clamp(x, min, max)` returns `max` when `x` is above `max`.
- `clamp(x, min, max)` returns `x` when `x` is within the inclusive interval `[min, max]`.
- When `min` equals `max`, the function returns that value for any `x`.
- When `min` is strictly greater than `max`, the function throws a `RangeError` whose message indicates the bounds are invalid.
- The function performs no backend or deployment operation.

## What the implementation cannot do

The specification leaves the following behaviour unspecified, so this implementation does not define it:

- Whether inputs that are not finite integers are rejected, and with what error type and message.
- Whether bounds that are not finite integers are rejected, and with what error type and message.

For any other input, including non-integer or non-finite values, the behaviour is whatever `Math.max` and `Math.min` produce, because the specification does not state validation rules for those cases.

## Notes

This project was built from `spec.md` only. It makes no claim of having been compared against or verified against any original implementation.