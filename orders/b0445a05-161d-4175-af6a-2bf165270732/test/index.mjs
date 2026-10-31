import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { processEntry } from '../src/index.mjs';

test('import test - module loads and exposes entry point', () => {
  assert.ok(typeof processEntry === 'function');
});

test('valid input test - returns result conforming to data model', () => {
  const input = { id: 'abc-123', value: 42 };
  const result = processEntry(input);

  assert.ok(typeof result === 'object' && result !== null);
  assert.strictEqual(result.id, 'abc-123');
  assert.strictEqual(result.value, 42);
  assert.strictEqual(result.processed, true);
  assert.ok(typeof result.timestamp === 'number');
});

test('invalid input test - missing required field throws predictable error', () => {
  assert.throws(() => processEntry({ value: 1 }), /missing required field 'id'/);
  assert.throws(() => processEntry({ id: 'x' }), /missing required field 'value'/);
});

test('invalid input test - wrong types throw predictable error', () => {
  assert.throws(() => processEntry({ id: 123, value: 42 }), /field 'id' must be a non-empty string/);
  assert.throws(() => processEntry({ id: 'x', value: 'not a number' }), /field 'value' must be a finite number/);
  assert.throws(() => processEntry(null), /expected a JSON object/);
  assert.throws(() => processEntry('string'), /expected a JSON object/);
});

test('edge-case test - empty object, null, and extreme numbers do not crash', () => {
  assert.throws(() => processEntry({}), /missing required field/);
  assert.throws(() => processEntry(null), /expected a JSON object/);
  assert.throws(() => processEntry({ id: 'x', value: Infinity }), /field 'value' must be a finite number/);
  assert.throws(() => processEntry({ id: 'x', value: -Infinity }), /field 'value' must be a finite number/);
  assert.throws(() => processEntry({ id: 'x', value: NaN }), /field 'value' must be a finite number/);
  assert.throws(() => processEntry({ id: '', value: 0 }), /field 'id' must be a non-empty string/);
});

test('determinism test - same input produces identical output shape', () => {
  const input = { id: 'deterministic', value: 7 };
  const first = processEntry(input);
  const second = processEntry(input);

  assert.strictEqual(first.id, second.id);
  assert.strictEqual(first.value, second.value);
  assert.strictEqual(first.processed, second.processed);
  assert.ok(typeof first.timestamp === 'number');
  assert.ok(typeof second.timestamp === 'number');
});