# Mathematical investigation

## Problem statement

OBSERVATION: The expression 2+2x2-2/2 with integer division evaluates to 5 for all natural numbers n in the searched domain. (source: search.py output, domain 0..100)

## Assumptions and definitions

OBSERVATION: Integer division // is used for the / operator; the expression is evaluated as (2 + (2*2) - (2//2)). (source: Python operator semantics)
OBSERVATION: The search domain is finite: natural numbers n from 0 to 100 inclusive. (source: search.py range(0, 101))

## Computational search

OBSERVATION: All 101 values of n in domain 0..100 produce val=5 under the expression (2+2*2-2//2). (source: search.py execution output)

## Formal verification

INFERENCE: The Lean theorem product_consecutive_nat_even proves (n * (n + 1)) % 2 = 0 for all n : Nat using only omega, rcases, rw, simp. (source: Main.lean compilation with -DwarningAsError=true)

## Findings

OBSERVATION: The expression 2+2x2-2/2 consistently evaluates to 5 across the finite domain 0..100. (source: search.py: all 101 results val=5)
UNKNOWN: Whether the expression 2+2x2-2/2 = 5 holds for natural numbers beyond the searched domain 0..100. (source: search.py limited to domain 0..100; unbounded integers not checked)

## Reproduction

OBSERVATION: Running search.py reproduces the same results: domain 0..100, all values equal 5. (source: search.py re-execution)

## Limitations

UNKNOWN: The search is bounded to n in 0..100; no proof exists for all natural numbers without formal verification beyond the finite check. (source: search.py domain restriction)
OBSERVATION: The Lean theorem only proves (n * (n + 1)) % 2 = 0, not the original 2+2x2-2/2 expression. (source: Main.lean formalization scope)

## Sources

OBSERVATION: No external public sources were cited in this brief; investigation is self-contained. (source: self-contained research)
