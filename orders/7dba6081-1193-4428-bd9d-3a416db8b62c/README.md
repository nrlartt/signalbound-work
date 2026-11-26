# PhraseRounds

## What it is

PhraseRounds is a small Solidity contract in which five different wallets each add one word, and the words become one phrase. Each round accepts exactly five words from five distinct callers. After three rounds have closed, the game is over and no more words can be added. No ETH is accepted by the contract.

## Rules

- `WORDS` is 5 and `MAX_ROUNDS` is 3.
- `addWord(string word)` reverts `GameOver()` after 3 rounds have closed.
- `addWord(string word)` reverts `BadWord()` unless the word is 1 to 20 bytes of lowercase a-z only.
- `addWord(string word)` reverts `AlreadyWrote()` if the caller already wrote in the current round.
- `addWord(string word)` emits `WordAdded(uint256 indexed round, address indexed author, uint8 slot, string word)` with slot 0..4.
- On the fifth word, `addWord(string word)` also emits `RoundClosed(uint256 indexed round, string phrase)` with the words joined by single spaces.
- `currentRound()` returns the current round number.
- `phraseOf(uint256 round)` returns the completed phrase for a closed round.

## Quick start

Add the word "kite" from your wallet:

```bash
cast send <CONTRACT_ADDRESS> "addWord(string)" "kite" --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
```

Read the phrase for round 0:

```bash
cast call <CONTRACT_ADDRESS> "phraseOf(uint256)(string)" 0 --rpc-url <RPC_URL>
```

Replace `<CONTRACT_ADDRESS>`, `<RPC_URL>`, and `<PRIVATE_KEY>` with your own values. The brief does not provide a contract address, an RPC URL, or a private key.

## Pages

- [API reference](docs/reference.md) - every function, error, event, and constant with when it fires.
- [Integration recipes](docs/integration.md) - ethers v6 JavaScript recipes for validation, event listening, and reading closed phrases.

## Open questions

- What is the deployed contract address?
- What is the RPC URL to use with cast?
- What private key should sign the cast send transaction?