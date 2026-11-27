# Integration recipes

These ethers v6 recipes show how to interact with WikiPages from JavaScript. Each recipe lists the minimal human-readable ABI it uses.

## Recipe 1: validate a slug client-side and create the page

```js
import { ethers } from 'ethers';

const abi = [
  'function create(string slug) external',
  'event Created(bytes32 indexed slugHash, string slug, address maintainer)'
];

const slug = 'getting-started';

if (!/^[a-z0-9-]{3,32}$/.test(slug)) throw new Error('BadSlug');
if (slug.startsWith('-') || slug.endsWith('-')) throw new Error('BadSlug');

const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);
const tx = await contract.create(slug);
const receipt = await tx.wait();
console.log(receipt);
```

Replace `privateKey`, `provider`, and `contractAddress` with values for your network. This step does not provide an RPC URL, chain ID, or contract address.

## Recipe 2: revise a page with ethers.id(text) as the hash

```js
import { ethers } from 'ethers';

const abi = [
  'function revise(string slug, bytes32 contentHash) external',
  'event Revised(bytes32 indexed slugHash, uint32 revision, bytes32 contentHash)'
];

const slug = 'getting-started';
const text = 'page body here';
const contentHash = ethers.id(text);

const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);
const tx = await contract.revise(slug, contentHash);
const receipt = await tx.wait();
console.log(receipt);
```

`ethers.id(text)` returns `keccak256(utf8 bytes of text)` as a bytes32 hash, which satisfies the non-zero hash requirement for ordinary text.

## Recipe 3: find a page's history by filtering Revised logs on slugHash

```js
import { ethers } from 'ethers';

const abi = [
  'event Revised(bytes32 indexed slugHash, uint32 revision, bytes32 contentHash)'
];

const slug = 'getting-started';
const slugHash = ethers.keccak256(ethers.toUtf8Bytes(slug));

const contract = new ethers.Contract(contractAddress, abi, provider);
const filter = contract.filters.Revised(slugHash);
const logs = await contract.queryFilter(filter);

for (const log of logs) {
  console.log(log.args.revision.toString(), log.args.contentHash);
}
```

The `slugHash` topic is computed as `keccak256(bytes(slug))`, matching the on-chain event topic.

## Open questions

- What is the deployed contract address?
- Which RPC provider URL should be used?
- What chain ID is the contract on?
- How should private keys be stored and loaded in production?