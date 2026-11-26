# API reference

## Constants

- `WORDS` = 5: the number of words required to close a round.
- `MAX_ROUNDS` = 3: the number of rounds after which the game is over.

## Functions

### addWord(string word)

Adds one word to the current round.

- Reverts `GameOver()` after 3 rounds have closed.
- Reverts `BadWord()` unless the word is 1 to 20 bytes of lowercase a-z only.
- Reverts `AlreadyWrote()` if the caller already wrote in the current round.
- Emits `WordAdded(uint256 indexed round, address indexed author, uint8 slot, string word)` with slot 0..4.
- On the fifth word, also emits `RoundClosed(uint256 indexed round, string phrase)` with the words joined by single spaces.

### currentRound()

A view that returns the current round number.

### phraseOf(uint256 round)

A view that returns the completed phrase for a closed round.

## Errors

### GameOver()

Fires when `addWord` is called after 3 rounds have closed.

### BadWord()

Fires when the word is not 1 to 20 bytes of lowercase a-z only.

### AlreadyWrote()

Fires when the caller already wrote in the current round.

## Events

### WordAdded(uint256 indexed round, address indexed author, uint8 slot, string word)

Fires on every accepted word, with slot 0..4.

### RoundClosed(uint256 indexed round, string phrase)

Fires on the fifth word of a round, with the words joined by single spaces.

## Open questions

- The brief does not state the visibility or mutability modifiers for `currentRound` and `phraseOf` beyond describing them as views.
- The brief does not state what `currentRound()` returns while a round is in progress versus after it closes.
- The brief does not state what `phraseOf(uint256 round)` returns for a round that has not yet closed.