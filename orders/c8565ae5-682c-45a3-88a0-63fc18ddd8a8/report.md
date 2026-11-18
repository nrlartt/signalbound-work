# Mathematical investigation

## Problem statement

OBSERVATION: Investigate whether there exists a natural number n such that (n * (n + 1)) % 2 = 1 over the finite domain n ∈ {0, 1, ..., 1000}. (source: Task brief)

## Assumptions and definitions

OBSERVATION: The expression (n * (n + 1)) % 2 computes the parity of the product of two consecutive natural numbers. The domain is bounded to n ∈ {0, ..., 1000} for computational search. (source: Task brief)
OBSERVATION: Lean 4 with pinned Mathlib v4.35.0 and import Mathlib.Data.Nat.Basic provides Nat.mul_mod and Nat.mod_lt as the only available modular arithmetic lemmas. (source: Task brief)

## Computational search

OBSERVATION: The Python script iterated n from 0 to 1000 inclusive, tested (n * (n + 1)) % 2 == 1, and found zero counterexamples. (source: search.py output)

## Formal verification

INFERENCE: The Lean theorem no_product_consecutive_odd_mod2 proves that for all n : Nat, (n * (n + 1)) % 2 = 0 using only rcases, rw, simp, and omega from Mathlib.Data.Nat.Basic with zero warnings under -DwarningAsError=true. (source: Main.lean compilation)

## Findings

OBSERVATION: No n in the searched domain {0,...,1000} satisfies (n * (n + 1)) % 2 = 1; the computational search returned an empty counterexample list. (source: search.py output)
INFERENCE: The Lean formalization establishes the result for all natural numbers, not just the finite domain searched. (source: Main.lean theorem)

## Reproduction

OBSERVATION: Running search.py again with the same bounds (0..1000) reproduces the same output: domain 0..1000, counterexamples [], total 0. (source: search.py re-run)

## Limitations

UNKNOWN: The parity result for (n * (n + 1)) % 2 = 1 could not be established for n > 1000 beyond the computational search bounds; the formal Lean theorem covers all Nat but the empirical domain is limited to 0..1000. (source: Task brief domain constraint)
UNKNOWN: Whether any n exists outside the searched domain where (n * (n + 1)) % 2 = 1 remains unknown; the search was bounded and the formal proof is independent of the search bounds. (source: Task brief domain constraint)

## Sources

OBSERVATION: Task brief dated 2026-11-18 defining the step objective and delivery contract. (source: Task brief)
OBSERVATION: Mathlib.Data.Nat.Basic module SHA-256 3acde740ae618c93431f89b06d0b00904e9d6565330667085bb713536e409295 providing Nat.mul_mod and Nat.mod_lt. (source: Mathlib pinned module)
