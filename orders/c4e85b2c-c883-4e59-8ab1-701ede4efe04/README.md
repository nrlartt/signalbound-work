# PointsVault Invariant Project

## Property
The vault's `totalCollateral` always equals the sum of the four actors' collateral balances, `totalDebt` always equals the sum of their debt balances, every actor's debt times two never exceeds their collateral, and the ghost tracked deposited-minus-withdrawn always equals `totalCollateral`.

## Mutation caught
Removing the LTV check in `withdraw` lets an actor withdraw collateral below `debt * 2`, which invariant (3) (`debt * 2 <= collateral` for every actor) catches immediately after the withdrawal.