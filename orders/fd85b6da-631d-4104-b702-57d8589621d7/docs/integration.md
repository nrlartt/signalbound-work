# EditionLog Integration

Three practical recipes using ethers v6 to interact with `EditionLog`. Each recipe includes the minimal human-readable ABI needed.

## 1. Hash a text with ethers.id and publish it

The `cast keccak` command can produce the required `bytes32` hash. Using ethers v6:

```js
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("<RPC_URL>");
const wallet = new ethers.Wallet("<PRIVATE_KEY>", provider);

// Minimal ABI for EditionLog
const abi = [
  "function publish(bytes32 contentHash, string headline) external",
  "event Published(uint256 indexed number, bytes32 contentHash, string headline)"
];

const contract = new ethers.Contract("<CONTRACT_ADDRESS>", abi, wallet);

// Hash a headline with ethers.id
const headline = "Welcome Edition";
const contentHash = ethers.id(headline); // bytes32

// Publish
await contract.publish(contentHash, headline);
console.log("Published edition with hash:", contentHash);
```

## 2. List all editions from 1 to count()

```js
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("<RPC_URL>");
const wallet = new ethers.Wallet("<PRIVATE_KEY>", provider);

const abi = [
  "function count() view returns (uint256)",
  "function edition(uint256 number) view returns (bytes32 hash, string headline, uint64 publishedAt, bool corrected)"
];

const contract = new ethers.Contract("<CONTRACT_ADDRESS>", abi, wallet);

const total = await contract.count();
for (let i = 1; i <= total; i++) {
  const [hash, title, publishedAt, corrected] = await contract.edition(i);
  console.log({ i, title, hash, publishedAt, corrected });
}
```

## 3. Subscribe to Corrected and print old and new hash

```js
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("<RPC_URL>");

// Minimal ABI including the Corrected event
const abi = [
  "event Corrected(uint256 indexed number, bytes32 oldHash, bytes32 newHash)"
];

const contract = new ethers.Contract("<CONTRACT_ADDRESS>", abi, provider);

contract.on("Corrected", (number, oldHash, newHash) => {
  console.log(`Edition ${number} corrected: old=${oldHash} new=${newHash}`);
});

// Example correction call (editor only)
// const wallet = new ethers.Wallet("<EDITOR_PRIVKEY>", provider);
// const edited = new ethers.Contract("<CONTRACT_ADDRESS>", abi, wallet);
// await edited.correct(1, ethers.id("new hash");
```

---

*Open question: The brief does not specify whether `publishedAt` should be a block timestamp or an absolute Unix epoch value, nor whether the `edition` view should revert on out-of-range numbers.*