# Integration recipes

These recipes use ethers v6 in JavaScript. The contract address and provider are open questions because the brief does not supply them.

## Recipe 1: Validate a word client-side

Validate the word with the same rules as the contract before sending:

```javascript
function validateWord(word) {
  const bytes = new TextEncoder().encode(word);
  if (bytes.length < 1 || bytes.length > 20) return false;
  return /^[a-z]+$/.test(word);
}

const word = "kite";
if (!validateWord(word)) {
  throw new Error("BadWord");
}

const tx = await contract.addWord(word);
await tx.wait();
```

## Recipe 2: Listen for RoundClosed

Listen for the `RoundClosed` event:

```javascript
contract.on("RoundClosed", (round, phrase, event) => {
  console.log("Round", round.toString(), "closed:", phrase);
});
```

## Recipe 3: Read all closed phrases

Read the phrase for each closed round:

```javascript
for (let round = 0; round < 3; round++) {
  const phrase = await contract.phraseOf(round);
  console.log("Round", round, "phrase:", phrase);
}
```

## Open questions

- What is the contract address to pass to the ethers Contract constructor?
- What is the RPC provider URL to use with ethers?
- What is the contract ABI needed to instantiate the ethers Contract object?