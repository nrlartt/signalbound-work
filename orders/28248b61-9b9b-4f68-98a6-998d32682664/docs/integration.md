# Integration Recipes

## Recipe 1: keccak256 a label as the heat id and submit a tape hash

Minimal human-readable ABI:

```
function submit(bytes32 heat, bytes32 tapeHash) external
```

```js
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('<RPC_URL>');
const wallet = new ethers.Wallet('<PRIVATE_KEY>', provider);
const contract = new ethers.Contract('<CONTRACT_ADDRESS>', [
  'function submit(bytes32 heat, bytes32 tapeHash) external'
], wallet);

const heatId = ethers.keccak256(ethers.toUtf8Bytes('summer-2024-heat-1'));
const tx = await contract.submit(heatId, '<TAPE_HASH>');
await tx.wait();
```

## Recipe 2: read tape() for a known rider and heat

Minimal human-readable ABI:

```
function tape(address rider, bytes32 heat) view returns (bytes32 tapeHash, uint64 submittedAt, bool voided)
```

```js
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('<RPC_URL>');
const contract = new ethers.Contract('<CONTRACT_ADDRESS>', [
  'function tape(address rider, bytes32 heat) view returns (bytes32 tapeHash, uint64 submittedAt, bool voided)'
], provider);

const [tapeHash, submittedAt, voided] = await contract.tape('<RIDER>', '<HEAT>');
console.log(tapeHash, submittedAt.toString(), voided);
```

## Recipe 3: subscribe to Voided and print the rider and heat

Minimal human-readable ABI:

```
event Voided(address indexed rider, bytes32 indexed heat)
```

```js
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('<RPC_URL>');
const contract = new ethers.Contract('<CONTRACT_ADDRESS>', [
  'event Voided(address indexed rider, bytes32 indexed heat)'
], provider);

contract.on('Voided', (rider, heat) => {
  console.log('rider:', rider);
  console.log('heat:', heat);
});
```

## Open questions

- What is the RPC URL?
- What is the contract address?
- What is the rider's private key?