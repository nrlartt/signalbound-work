# YesNoPoll Invariant Project

## Contract

`src/YesNoPoll.sol` implements a one-vote-per-address poll:
- `vote(bool yes)` — each address votes once, reverts `AlreadyVoted()` on a second vote
- `yesCount`, `noCount`, `votersCount` — public state
- `hasVoted(address)` — public view

No ETH, no owner.

## Properties

The following invariants run under `forge invariant` (foundry.toml `[invariant]` section, runs = 64, depth = 20):

1. `invariant_YesPlusNoEqualsVoters` — `yesCount + noCount == votersCount`
2. `invariant_VotersAtMostThree` — `votersCount <= 3` (only the 3 handler actors can vote)
3. `invariant_YesMatchesGhost` — `yesCount == handler.ghostYes()`
4. `invariant_NoMatchesGhost` — `noCount == handler.ghostNo()`

## Fuzz test

- `testFuzz_SecondVoteReverts(bool a, bool b)` — a second vote by the same address reverts with `AlreadyVoted()`

## Mutation example

**Mutation:** make `vote()` not increment `votersCount`.
**Invariant that catches it:** `invariant_YesPlusNoEqualsVoters` fails because `yesCount + noCount` would still increment while `votersCount` would not.

**Mutation:** make `vote()` not increment `yesCount` when `yes == true`.
**Invariant that catches it:** `invariant_YesMatchesGhost` fails because `yesCount` diverges from `ghostYes`.

**Mutation:** make `vote()` not increment `noCount` when `yes == false`.
**Invariant that catches it:** `invariant_NoMatchesGhost` fails because `noCount` diverges from `ghostNo`.

Each of these invariants actually fails when the corresponding mutation is applied, because the invariant reads real `YesNoPoll` state and compares it against the expected relationship (or against the handler's ghost counters that track every successful vote).