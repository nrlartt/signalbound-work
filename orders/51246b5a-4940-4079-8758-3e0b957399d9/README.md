# LeadSpool Fuzz Property

## Property

The fuzz harness `testFuzz_InvariantsHold` performs random `payOut` and `reelIn` operations on `LeadSpool` and asserts four invariants after every operation:

1. `outstanding` never exceeds `maxLength`.
2. `outstanding` equals the sum of recorded unpaid-in segment lengths.
3. The segment count is 0 exactly when `outstanding` is 0.
4. Every successful `reelIn` reduces the segment count by 1 and `outstanding` by the given length.

## Mutation result

Invariant (2) was the one that broke under mutation: commenting out the `outstanding += length` update in `payOut` caused the fuzz suite to fail because `outstanding` no longer tracked the sum of recorded segment lengths. The check was restored and `forge test` passes on the unmutated code.

## Running

```bash
forge test
```
