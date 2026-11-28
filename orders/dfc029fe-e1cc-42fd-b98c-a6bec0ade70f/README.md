# Run-length encoding module

This project implements run-length encoding and decoding as described in the specification.

## Usage

Import the named exports:

```js
import { rleEncode, rleDecode } from './src/rle.mjs';

const encoded = rleEncode([1, 1, 1, 2, 2, 7]);
// [[1, 3], [2, 2], [7, 1]]

const decoded = rleDecode([[1, 3], [2, 2], [7, 1]]);
// [1, 1, 1, 2, 2, 7]
```

## Run the tests

```sh
npm test
```

Tests use Node's native test runner and require no installed dependencies.

## Run the program

```sh
npm start
```

The CLI accepts a JSON array to encode as the first argument and an optional JSON array of pairs to decode as the second argument.

## What the implementation cannot do

The specification does not state:

- Whether very large counts are supported or limited.
- The behaviour when rleDecode receives a pair whose count is zero but whose first element is not an integer.
- Whether boolean values count as integers.
- How the module should be bundled or distributed beyond the provided ES module entry point.
- Any behaviour for inputs beyond arrays, pairs, and integers described in the data model.

These are open questions left by the specification; this implementation does not invent answers for them.