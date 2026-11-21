# gas-diary-calc

Calculate gas diary fees in gwei and ETH.

## Install

```
npm install gas-diary-calc
```

## Run

Start the entry point:

```
npm start
```

Run the tests:

```
npm test
```

## What the implementation cannot do

The specification does not state:

- How `formatGwei` should format its output beyond returning a string.
- How many decimal places the `eth` string should contain beyond the example given.
- What `calculateFee` should do when the product overflows JavaScript's safe integer range.
- What `start` should do beyond running `src/index.mjs`.
- Any behaviour for non-numeric input types other than negative or non-finite numbers.

This implementation was written from the specification alone and makes no claims about parity with any other implementation.