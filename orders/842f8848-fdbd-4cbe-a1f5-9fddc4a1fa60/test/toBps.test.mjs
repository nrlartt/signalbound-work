import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { toBps } from '../src/toBps.mjs';

test('Input [1,1,1] returns [3334,3333,3333]', () => {
  assert.deepStrictEqual(toBps([1, 1, 1]), [3334, 3333, 3333]);
});

test('Input [2,1] returns [6667,3333]', () => {
  assert.deepStrictEqual(toBps([2, 1]), [6667, 3333]);
});

test('Input [0,5] returns [0,10000]', () => {
  assert.deepStrictEqual(toBps([0, 5]), [0, 10000]);
});

test('Input [1,2,3,4] returns [1000,2000,3000,4000]', () => {
  assert.deepStrictEqual(toBps([1, 2, 3, 4]), [1000, 2000, 3000, 4000]);
});

test('Input [1,1,1,1,1,1,1] returns seven integers summing to 10000 with first receiving any extra point', () => {
  const result = toBps([1, 1, 1, 1, 1, 1, 1]);
  assert.strictEqual(result.length, 7);
  let sum = 0;
  for (const value of result) {
    sum += value;
  }
  assert.strictEqual(sum, 10000);
  assert.strictEqual(result[0], Math.ceil(10000 / 7));
});

test('Input [] throws empty', () => {
  assert.throws(() => toBps([]), { message: 'empty' });
});

test('Input null throws empty', () => {
  assert.throws(() => toBps(null), { message: 'empty' });
});

test('Input [1,-1] throws bad weight', () => {
  assert.throws(() => toBps([1, -1]), { message: 'bad weight' });
});

test('Input [1,NaN] throws bad weight', () => {
  assert.throws(() => toBps([1, NaN]), { message: 'bad weight' });
});

test('Input [0,0] throws zero total', () => {
  assert.throws(() => toBps([0, 0]), { message: 'zero total' });
});

test('Input [0,0,5] returns [0,0,10000]', () => {
  assert.deepStrictEqual(toBps([0, 0, 5]), [0, 0, 10000]);
});

test('Input [3,3,3,3] returns [2500,2500,2500,2500]', () => {
  assert.deepStrictEqual(toBps([3, 3, 3, 3]), [2500, 2500, 2500, 2500]);
});

test('Output array has same length as input array', () => {
  const input = [5, 3, 2];
  const result = toBps(input);
  assert.strictEqual(result.length, input.length);
});

test('Output array sums to exactly 10000', () => {
  const input = [7, 11, 13];
  const result = toBps(input);
  let sum = 0;
  for (const value of result) {
    sum += value;
  }
  assert.strictEqual(sum, 10000);
});