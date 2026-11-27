# toBps

Allocates basis points across weights using the largest remainder method.

## Usage

```js
import { toBps } from './src/toBps.mjs';

const result = toBps([1, 1, 1]);
// [3334, 3333, 3333]
```

## Tests

Run the test suite with Node's native test runner:

```sh
npm test
```

Or directly:

```sh
node --test
```

## Start

The package includes a start script that runs the module entry point:

```sh
npm start
```

Or directly:

```sh
node src/toBps.mjs
```

## Behaviour

- `toBps` accepts one argument: an array of finite non-negative numbers.
- It returns an array of integers of the same length, summing to exactly 10000.
- It throws `'empty'` for non-array input or an empty array.
- It throws `'bad weight'` for any element that is not a finite non-negative number.
- It throws `'zero total'` when all weights sum to zero.
- Allocations use the largest remainder method: floor each exact share, then distribute remaining points to the largest fractional remainders, with lower index winning ties.

## Open questions

The specification does not state:
- What `src/toBps.mjs` should do when executed directly via the start script, since it exports a function and has no command-line behaviour defined.
- How the module should be named when published or imported beyond the local `./src/toBps.mjs` path.
- Whether non-array iterable inputs such as array-like objects should be accepted.
- What precision or rounding behaviour applies to extremely large or extremely small weights beyond the stated finite non-negative requirement.