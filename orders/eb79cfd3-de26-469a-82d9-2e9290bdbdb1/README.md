# diffLines

A Node.js ES module that compares two arrays of line records and reports which ids were added, removed, changed, or left unchanged.

## Usage

```js
import { diffLines } from './src/diffLines.mjs';

const before = [
  { id: 1, text: 'a', source: 's' },
  { id: 2, text: 'b', source: 's' },
];

const after = [
  { id: 1, text: 'a', source: 's' },
  { id: 2, text: 'b-changed', source: 's' },
  { id: 3, text: 'c', source: 's' },
];

const result = diffLines(before, after);
// { added: [3], removed: [], changed: [2], unchanged: 1 }
```

## Commands

Run tests:

```sh
npm test
```

Run the module directly:

```sh
npm start
```

## What the implementation cannot do

The specification does not state:

- What to do when a line record is missing `id`, `text`, or `source`.
- Whether `id` values must be numbers, or how non-numeric ids should be sorted.
- Whether `text` or `source` values of `undefined` or `null` count as different from each other or from a missing value.
- Whether duplicate detection should consider only `id`, or the full record.
- What the `start` script should do beyond loading the module.
- How the module should be imported by consumers (there is no `exports` field in `package.json`).

These are open questions left by the specification; this implementation does not invent answers for them.
