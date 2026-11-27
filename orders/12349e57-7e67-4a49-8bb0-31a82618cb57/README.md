# WeightBook

A curator-managed list of target weights for a 3-asset demo basket with a timelock. No ETH or tokens move.

## Functions

- `constructor(address curator, uint16[3] memory initial)` — Sets the curator and initial weights. Weights must sum to 10000 basis points; curator must be non-zero.
- `propose(uint16[3] calldata w)` — Only curator. Proposes new weights summing to 10000, replacing any pending proposal. Sets `eta = block.timestamp + 2 days`.
- `execute()` — Anyone. Applies the pending weights if a proposal exists, `block.timestamp >= eta`, and `block.timestamp <= eta + 7 days`. Clears the proposal.
- `cancel()` — Only curator. Clears the pending proposal if one exists.
- `weights()` — Returns the 3 current weights.
- `pending()` — Returns `(uint16[3] w, uint64 eta, bool exists)` for the pending proposal.

## Errors

- `BadWeights()` — Weights do not sum to exactly 10000 basis points.
- `ZeroCurator()` — Curator address is zero.
- `NotCurator()` — Caller is not the curator.
- `NoProposal()` — No proposal is pending.
- `TooEarly()` — `execute()` called before `eta`.
- `Expired()` — `execute()` called later than `eta + 7 days`.

## Events

- `Proposed(uint16[3] w, uint64 eta)` — Emitted on a new proposal.
- `Executed(uint16[3] w)` — Emitted when weights are applied.
- `Cancelled()` — Emitted when a proposal is cancelled.

## Timelock

- `DELAY = 2 days` between proposal and execution.
- Execution window closes `eta + 7 days`.
