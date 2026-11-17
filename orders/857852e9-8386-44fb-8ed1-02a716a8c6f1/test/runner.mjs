import assert from 'node:assert';
import ms from '../src/index.mjs';

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL ${name}: ${err.message}`);
  }
}

function expectThrows(fn) {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  return threw;
}

// Parsing cases
check("parsing '1s' returns 1000", () => {
  assert.strictEqual(ms('1s'), 1000);
});

check("parsing '1m' returns 60000", () => {
  assert.strictEqual(ms('1m'), 60000);
});

check("parsing '1h' returns 3600000", () => {
  assert.strictEqual(ms('1h'), 3600000);
});

check("parsing '1d' returns 86400000", () => {
  assert.strictEqual(ms('1d'), 86400000);
});

check("parsing '1 ms' returns 1", () => {
  assert.strictEqual(ms('1 ms'), 1);
});

check("parsing '-1s' returns -1000", () => {
  assert.strictEqual(ms('-1s'), -1000);
});

check("parsing '-1m' returns -60000", () => {
  assert.strictEqual(ms('-1m'), -60000);
});

check("parsing '-1h' returns -3600000", () => {
  assert.strictEqual(ms('-1h'), -3600000);
});

check("parsing '-1d' returns -86400000", () => {
  assert.strictEqual(ms('-1d'), -86400000);
});

check("parsing '1.5s' returns 1500", () => {
  assert.strictEqual(ms('1.5s'), 1500);
});

check("parsing '1.5m' returns 90000", () => {
  assert.strictEqual(ms('1.5m'), 90000);
});

check("parsing '-1.5h' returns -5400000", () => {
  assert.strictEqual(ms('-1.5h'), -5400000);
});

check("parsing '1 day' returns 86400000", () => {
  assert.strictEqual(ms('1 day'), 86400000);
});

check("parsing '1 hour' returns 3600000", () => {
  assert.strictEqual(ms('1 hour'), 3600000);
});

check("parsing '1 minute' returns 60000", () => {
  assert.strictEqual(ms('1 minute'), 60000);
});

check("parsing '1 second' returns 1000", () => {
  assert.strictEqual(ms('1 second'), 1000);
});

check("parsing '1 millisecond' returns 1", () => {
  assert.strictEqual(ms('1 millisecond'), 1);
});

check("parsing '' throws an error", () => {
  assert.ok(expectThrows(() => ms('')));
});

check("parsing 'abc' throws an error", () => {
  assert.ok(expectThrows(() => ms('abc')));
});

check("parsing '100' throws an error", () => {
  assert.ok(expectThrows(() => ms('100')));
});

check("parsing '100 years' throws an error", () => {
  assert.ok(expectThrows(() => ms('100 years')));
});

// Formatting cases
check("formatting 1000 returns '1s'", () => {
  assert.strictEqual(ms(1000), '1s');
});

check("formatting 60000 returns '1m'", () => {
  assert.strictEqual(ms(60000), '1m');
});

check("formatting 3600000 returns '1h'", () => {
  assert.strictEqual(ms(3600000), '1h');
});

check("formatting 86400000 returns '1d'", () => {
  assert.strictEqual(ms(86400000), '1d');
});

check("formatting -1000 returns '-1s'", () => {
  assert.strictEqual(ms(-1000), '-1s');
});

check("formatting 0 returns '0ms'", () => {
  assert.strictEqual(ms(0), '0ms');
});

check("formatting 90000 returns '1m' or '90s'", () => {
  const result = ms(90000);
  assert.ok(result === '1m' || result === '90s', `got ${result}`);
});

check("formatting 900000 returns '15m'", () => {
  assert.strictEqual(ms(900000), '15m');
});

check("formatting 1000 with long option returns '1 second'", () => {
  assert.strictEqual(ms(1000, { long: true }), '1 second');
});

check("formatting 60000 with long option returns '1 minute'", () => {
  assert.strictEqual(ms(60000, { long: true }), '1 minute');
});

check("formatting 3600000 with long option returns '1 hour'", () => {
  assert.strictEqual(ms(3600000, { long: true }), '1 hour');
});

check("formatting 86400000 with long option returns '1 day'", () => {
  assert.strictEqual(ms(86400000, { long: true }), '1 day');
});

check("formatting -1000 with long option returns '-1 second'", () => {
  assert.strictEqual(ms(-1000, { long: true }), '-1 second');
});

check("formatting 0 with long option returns '0 milliseconds'", () => {
  assert.strictEqual(ms(0, { long: true }), '0 milliseconds');
});

check("formatting 'abc' throws an error", () => {
  assert.ok(expectThrows(() => ms('abc')));
});

check("formatting NaN throws an error", () => {
  assert.ok(expectThrows(() => ms(NaN)));
});

check("formatting Infinity throws an error", () => {
  assert.ok(expectThrows(() => ms(Infinity)));
});

// Rounding cases
check("rounding 999 returns '1s'", () => {
  assert.strictEqual(ms(999), '1s');
});

check("rounding 999999 returns '17m' or '16m'", () => {
  const result = ms(999999);
  assert.ok(result === '17m' || result === '16m', `got ${result}`);
});

check("rounding 1500 returns '2s' or '1s'", () => {
  const result = ms(1500);
  assert.ok(result === '2s' || result === '1s', `got ${result}`);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
