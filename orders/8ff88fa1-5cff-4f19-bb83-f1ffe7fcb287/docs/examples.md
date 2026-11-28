# Examples

This page shows short usage patterns for ShardLog using ethers v6. The brief does not provide a deployed address, an ABI, or example transaction outputs, so the snippets below are structural only and the values they would produce are open questions.

## Calling record

Using ethers v6, attach to the contract with its address and ABI, then send a transaction:

```js
const tx = await contract.record(glazeHash);
const receipt = await tx.wait();
```

The brief does not state what record returns, so no return value is shown. The Recorded event can be read from the receipt logs.

## Reading count

```js
const n = await contract.count();
```

The brief does not state the return type of count, so the exact shape of n is unspecified.

## Reading an entry

```js
const [potter, time, glazeHash] = await contract.entry(i);
```

If i is out of range, the call reverts with Index. If glazeHash is zero when calling record, the transaction reverts with ZeroHash.

## Open questions

- The contract address is unspecified.
- The ABI is not provided by the brief.
- Example return values and transaction hashes are not derivable from the brief and are left as open questions.
- Whether ethers v6 is the required library is not stated by the brief; this page uses it only as an illustrative choice and says so.