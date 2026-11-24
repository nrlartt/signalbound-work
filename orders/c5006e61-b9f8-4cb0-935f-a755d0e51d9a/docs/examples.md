# Examples

## Show the age of the latest Sepolia block

Fetch the latest Sepolia block timestamp and display its age.

```js
import { blockAge, formatAge } from 'block-age';

const latestBlock = await fetchSepoliaHead();
const age = blockAge(latestBlock.timestamp);
console.log(`Sepolia head is ${formatAge(age)} old`);
```

Expected output when the head is 12 seconds old:

```
Sepolia head is 12s old
```

## Warn when an RPC head is older than 60 seconds

Check an RPC node's head block and warn if it is stale.

```js
import { isStale } from 'block-age';

const head = await getRpcHeadTimestamp();
if (isStale(head, 60)) {
  console.warn('RPC head is older than 60 seconds');
}
```

Expected output when stale:

```
RPC head is older than 60 seconds
```

## Format ages in a table

Display several block ages in a readable table.

```js
import { blockAge, formatAge } from 'block-age';

const blocks = [1700000000, 1700000120, 1700000400];
const now = 1700000500;

console.table(blocks.map((ts) => ({
  timestamp: ts,
  age: formatAge(blockAge(ts, now)),
})));
```

Expected output:

```
┌─────────┬────────────┬─────────┐
│ (index) │ timestamp  │ age     │
├─────────┼────────────┼─────────┤
│    0    │ 1700000000 │ "500s"  │
│    1    │ 1700000120 │ "380s"  │
│    2    │ 1700000400 │ "100s"  │
└─────────┴────────────┴─────────┘
```

## Open questions

- The brief does not name the functions used to fetch Sepolia or RPC block timestamps; `fetchSepoliaHead` and `getRpcHeadTimestamp` are placeholders and must be replaced with real calls.
- The brief does not state the exact `console.table` rendering, so the table output above is illustrative rather than guaranteed.