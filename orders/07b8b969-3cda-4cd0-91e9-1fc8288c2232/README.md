# PeakHold Oracle

A single-steward oracle for kiln peak-and-hold postings used by a loft diary.

## Units

- `celsiusX10`: temperature in tenths of a degree Celsius (e.g. `2500` means 250.0 °C).
- `holdMinutes`: hold duration in whole minutes.
- `maxAge`: maximum age of a posted value in seconds.
- `maxJump`: maximum absolute change in `celsiusX10` between consecutive posts.

## Trust boundary

- Only the steward (set at construction) may call `setPeak`. Any other caller reverts with `NotSteward`.
- After the first post, a new post older than `maxAge` seconds reverts with `StaleWriter`.
- After the first post, a jump larger than `maxJump` reverts with `Jump`.
- `read()` reverts with `Stale` if the value is older than `maxAge` seconds.
- `read()` reverts with `Unset` if nothing has ever been posted.

This is a single-steward posting, not a median of many sensors.

## Tests

Run with `forge test`. Seven tests cover first set, jump reversion, within-jump acceptance, stale writer rejection, stale read, unset read, and non-steward rejection.
