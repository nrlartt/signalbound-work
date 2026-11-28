# HeatClock Oracle

Foundry project (Solidity 0.8.24, forge-std only) implementing an official heat-time oracle.

## Contracts

- `HeatClock` — keeper-reported heat-time oracle. Three distinct, non-zero keepers each report a `(heat, timeMs)` once per heat. On the third report the heat finalises and the stored official time is the median of the three reported times. Reads before finalisation revert with `Open()`.
- `HeatCard` — consumer that exposes `timeOf(heat)` by reading `officialTime` from a `HeatClock` passed in the constructor.

## Errors

- `BadKeepers()` — constructor keepers are not distinct or one is zero.
- `NotKeeper()` — reporter is not one of the three keepers.
- `ZeroTime()` — reported `timeMs` is zero.
- `AlreadyReported()` — a keeper reports twice for the same heat.
- `Open()` — `officialTime` is read before a heat has finalised.

## Events

- `Reported(bytes32 indexed heat, address indexed keeper, uint32 timeMs)`
- `Official(bytes32 indexed heat, uint32 timeMs)`

## Tests

Run with `forge test`. The suite covers median finalisation (9000/4000/5000 → 5000, 1200/1200/8000 → 1200, 3000/3000/3000 → 3000), every error path, duplicate reports, and a fuzz invariant that the finalised time equals one of the reported values and lies between the min and max.