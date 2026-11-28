# TidePost

A Foundry oracle project for a single-writer tide gauge.

## Contract

`TidePost` is a single-coxswain post, not a median of many sensors. One
coxswain address, fixed at construction, is the only writer of tide level
readings.

## Units

- Level: `int32 centimetresX10`, tenths of a centimetre relative to chart
  datum. Signed so the gauge can sit below chart datum (negative values).
- `windowMinutes`: observation window carried with each reading.
- `maxAge`: freshness window in seconds.
- `maxJump`: maximum absolute change in `centimetresX10` between consecutive
  posts, enforced only after the first post.

## Trust boundary

- Only the coxswain may call `setLevel`; anyone else reverts `NotCoxswain`.
- The first post is unrestricted; `windowMinutes` may be zero.
- Later posts revert `StaleWriter` when the previous post is older than
  `maxAge` seconds, and `Jump` when the absolute change exceeds `maxJump`.
- `read()` reverts `Unset` when nothing has been posted, and `Stale` when
  `block.timestamp - updatedAt` exceeds `maxAge`.

## Views

`coxswain`, `maxAge`, `maxJump`.

## Tests

Seven named tests: `testFirstSet`, `testJumpReverts`, `testWithinJump`,
`testStaleWriter`, `testReadStale`, `testReadUnset`, `testNonCoxswainReverts`.
Run with `forge test`.
