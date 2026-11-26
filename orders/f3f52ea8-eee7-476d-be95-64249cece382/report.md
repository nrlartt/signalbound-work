# Mathematical investigation

## Problem statement

OBSERVATION: Investigate Euler's prime-generating polynomial f(n) = n^2 + n + 41 for integers n >= 0. (source: brief)

## Assumptions and definitions

OBSERVATION: f(n) := n^2 + n + 41 for n : Nat. (source: brief)

## Computational search

OBSERVATION: Smallest n >= 0 for which f(n) is not prime is n = 40. (source: search.py output)
OBSERVATION: Number of n in 0 <= n < 100 for which f(n) is prime is 31. (source: search.py output)
OBSERVATION: Number of n in 0 <= n < 1000 for which f(n) is prime is 168. (source: search.py output)
OBSERVATION: List of n below 100 for which f(n) is composite: [40, 57, 61, 63, 67, 71, 73, 77, 79, 81, 83, 87, 89, 91, 93, 97, 99]. (source: search.py output)

## Formal verification

INFERENCE: Lean theorem f40 proves 40^2 + 40 + 41 = 41 * 41. (source: Main.lean)
INFERENCE: Lean theorem f41 proves 41^2 + 41 + 41 = 41 * 43. (source: Main.lean)

## Findings

OBSERVATION: f(40) = 41 * 41 and f(41) = 41 * 43, so both are divisible by 41 because f(n) = n(n+1) + 41 and n(n+1) is a multiple of 41 at n = 40 and n = 41. (source: brief computation)
INFERENCE: The finite search results apply only to 0 <= n < 1000 and do not establish behavior beyond that domain. (source: search.py output)

## Reproduction

OBSERVATION: Re-run search.py with Python 3 to reproduce the exact finite search results for n < 1000. (source: search.py source code)

## Limitations

UNKNOWN: Behavior of f(n) for n >= 1000 is not covered by the finite search domain n < 1000. (source: brief domain restriction)
UNKNOWN: Whether f(n) produces infinitely many primes remains open; only computational evidence is available. (source: standard mathematical knowledge)

## Sources

OBSERVATION: Brief dated 2026-11-26T11:24:04.106Z defines the investigation of Euler's prime-generating polynomial f(n) = n^2 + n + 41. (source: worker-fetched sources)
