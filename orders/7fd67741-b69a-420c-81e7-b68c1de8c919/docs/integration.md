# ethers v6 integration recipes

## Prerequisites

You need an ethers v6 provider or signer connected to the network where SpecimenTag is deployed, plus the contract address. The brief does not provide these.

## Recipe 1: keccak256 a label and tag it

Minimal human-readable ABI:

```ts
['function tag(bytes32 accession, string label)']
```

```ts
import { ethers } from 'ethers';

const label = 'Specimen-001';
const accession = ethers.keccak256(ethers.toUtf8Bytes(label));
const contract = new ethers.Contract(address, ['function tag(bytes32 accession, string label)'], signer);
const tx = await contract.tag(accession, label);
await tx.wait();
```

The brief does not state the resulting accession hash or transaction hash.

## Recipe 2: read count() and then info() for a known accession

Minimal human-readable ABI:

```ts
['function count() view returns (uint256)', 'function info(bytes32 accession) view returns (string label, uint64 taggedAt, bool retagged)']
```

```ts
import { ethers } from 'ethers';

const contract = new ethers.Contract(address, [
  'function count() view returns (uint256)',
  'function info(bytes32 accession) view returns (string label, uint64 taggedAt, bool retagged)',
], provider);

const total = await contract.count();
console.log('count:', total.toString());

const accession = '0x' + '01'.repeat(32);
const [label, taggedAt, retagged] = await contract.info(accession);
console.log({ label, taggedAt: taggedAt.toString(), retagged });
```

The brief does not provide a known accession or the expected return values.

## Recipe 3: subscribe to Retagged and print old and new labels

Minimal human-readable ABI:

```ts
['event Retagged(bytes32 indexed accession, string oldLabel, string newLabel)']
```

```ts
import { ethers } from 'ethers';

const contract = new ethers.Contract(address, [
  'event Retagged(bytes32 indexed accession, string oldLabel, string newLabel)',
], provider);

contract.on(contract.filters.Retagged(), (accession, oldLabel, newLabel, event) => {
  console.log('accession:', accession);
  console.log('oldLabel:', oldLabel);
  console.log('newLabel:', newLabel);
  console.log('blockNumber:', event.blockNumber);
});
```

The brief does not state how long to keep the subscription open or how to stop it.

## Open questions

- What is the contract address?
- What is the RPC URL or provider?
- What is the signer or private key for writing transactions?