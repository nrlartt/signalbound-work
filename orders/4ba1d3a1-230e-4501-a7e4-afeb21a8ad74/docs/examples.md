# Examples

The snippets below are written in ethers v6 syntax. The brief does not supply a contract address, an ABI JSON file, or a provider URL, so these examples cannot be run as written; they show the shape of the calls only.

## Appending a cast hash

```js
import { ethers } from 'ethers';

const contract = new ethers.Contract(address, abi, provider);
const tx = await contract.add('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
await tx.wait();
```

## Reading the row count

```js
const count = await contract.length();
console.log(count.toString());
```

## Reading a row by index

```js
const [caster, time, leadHash] = await contract.at(0);
console.log(caster, time.toString(), leadHash);
```

## Listening for CastRecorded

```js
contract.on('CastRecorded', (i, caster, leadHash, event) => {
  console.log(i.toString(), caster, leadHash, event.logIndex);
});
```

## Open questions

The brief does not provide a deployed address, an ABI, a provider, or a private key for signing transactions. It does not state the exact bytes32 hash format surveyors should use, nor does it give a worked example of a transaction receipt. These are unspecified.