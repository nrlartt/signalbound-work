import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { calculateFee, formatGwei } from '../src/index.mjs';

test('calculateFee(21000, 2, 1) returns gwei 63000 and eth "0.000063"', () => {
  const result = calculateFee(21000, 2, 1);
  assert.strictEqual(result.gwei, 63000);
  assert.strictEqual(result.eth, '0.000063');
});

test('calculateFee with negative gasUsed throws RangeError', () => {
  assert.throws(() => calculateFee(-1, 2, 1), RangeError);
});

test('calculateFee with negative baseFeeGwei throws RangeError', () => {
  assert.throws(() => calculateFee(21000, -2, 1), RangeError);
});

test('calculateFee with negative priorityFeeGwei throws RangeError', () => {
  assert.throws(() => calculateFee(21000, 2, -1), RangeError);
});

test('calculateFee with NaN as any input throws RangeError', () => {
  assert.throws(() => calculateFee(NaN, 2, 1), RangeError);
  assert.throws(() => calculateFee(21000, NaN, 1), RangeError);
  assert.throws(() => calculateFee(21000, 2, NaN), RangeError);
});

test('calculateFee with Infinity as any input throws RangeError', () => {
  assert.throws(() => calculateFee(Infinity, 2, 1), RangeError);
  assert.throws(() => calculateFee(21000, Infinity, 1), RangeError);
  assert.throws(() => calculateFee(21000, 2, Infinity), RangeError);
});

test('calculateFee with -Infinity as any input throws RangeError', () => {
  assert.throws(() => calculateFee(-Infinity, 2, 1), RangeError);
  assert.throws(() => calculateFee(21000, -Infinity, 1), RangeError);
  assert.throws(() => calculateFee(21000, 2, -Infinity), RangeError);
});

test('formatGwei with a negative number throws RangeError', () => {
  assert.throws(() => formatGwei(-1), RangeError);
});

test('formatGwei with NaN throws RangeError', () => {
  assert.throws(() => formatGwei(NaN), RangeError);
});

test('formatGwei with Infinity throws RangeError', () => {
  assert.throws(() => formatGwei(Infinity), RangeError);
});

test('formatGwei with -Infinity throws RangeError', () => {
  assert.throws(() => formatGwei(-Infinity), RangeError);
});

test('formatGwei returns a string for a valid finite input', () => {
  assert.strictEqual(typeof formatGwei(63000), 'string');
});