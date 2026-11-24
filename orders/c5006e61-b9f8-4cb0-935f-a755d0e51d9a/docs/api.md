# API reference

## blockAge(blockTimestamp, nowSeconds)

Returns the age of a block in whole seconds, never negative. A future timestamp returns 0.

### Signature

```js
blockAge(blockTimestamp, nowSeconds = Math.floor(Date.now() / 1000))
```

### Parameters

- `blockTimestamp` (number): the block timestamp in Unix seconds.
- `nowSeconds` (number, optional): the current time in Unix seconds. Defaults to `Math.floor(Date.now() / 1000)`.

### Return value

A whole number of seconds. Never negative.

### Errors

Throws `TypeError` if `blockTimestamp` is not a finite number.

### Examples

```js
blockAge(1700000000, 1700000060)
// 60

blockAge(1700000100, 1700000000)
// 0
```

## formatAge(seconds)

Returns a short human-readable string for an age in seconds.

### Signature

```js
formatAge(seconds)
```

### Parameters

- `seconds` (number): a non-negative number of seconds.

### Return value

- Under 60 seconds: `"Ns"`, for example `"12s"`.
- Under 3600 seconds: `"Nm Ns"`, for example `"3m 4s"`.
- Under 86400 seconds: `"Nh Nm"`, for example `"1h 2m"`.
- Otherwise: `"Nd Nh"`, for example `"2d 5h"`.

### Errors

Throws `RangeError` for negative input.

### Examples

```js
formatAge(12)
// "12s"

formatAge(184)
// "3m 4s"
```

## isStale(blockTimestamp, maxAgeSeconds, nowSeconds)

Returns true when the block age is greater than `maxAgeSeconds`.

### Signature

```js
isStale(blockTimestamp, maxAgeSeconds, nowSeconds?)
```

### Parameters

- `blockTimestamp` (number): the block timestamp in Unix seconds.
- `maxAgeSeconds` (number): the maximum acceptable age in seconds.
- `nowSeconds` (number, optional): the current time in Unix seconds.

### Return value

A boolean: `true` when `blockAge(blockTimestamp, nowSeconds) > maxAgeSeconds`, otherwise `false`.

### Errors

None documented beyond those thrown by `blockAge`.

### Examples

```js
isStale(1700000000, 30, 1700000060)
// true

isStale(1700000000, 60, 1700000060)
// false
```

## Open questions

- The brief does not state whether `formatAge` rounds, floors, or truncates non-integer seconds.
- The brief does not state the exact error message for the `TypeError` or `RangeError`.