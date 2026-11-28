import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rleEncode, rleDecode } from '../src/rle.mjs';

test('rleEncode([1,1,1,2,2,7]) returns [[1,3],[2,2],[7,1]]', () => {
  assert.deepStrictEqual(rleEncode([1, 1, 1, 2, 2, 7]), [[1, 3], [2, 2], [7, 1]]);
});

test('rleEncode([]) returns []', () => {
  assert.deepStrictEqual(rleEncode([]), []);
});

test('rleEncode([0]) returns [[0,1]]', () => {
  assert.deepStrictEqual(rleEncode([0]), [[0, 1]]);
});

test('rleEncode with a non-array argument throws not a list', () => {
  assert.throws(() => rleEncode('not a list'), { message: 'not a list' });
  assert.throws(() => rleEncode(null), { message: 'not a list' });
  assert.throws(() => rleEncode({}), { message: 'not a list' });
  assert.throws(() => rleEncode(42), { message: 'not a list' });
});

test('rleEncode with an array containing a non-integer throws bad value', () => {
  assert.throws(() => rleEncode([1, 2.5, 3]), { message: 'bad value' });
  assert.throws(() => rleEncode([1, '2', 3]), { message: 'bad value' });
  assert.throws(() => rleEncode([1, null, 3]), { message: 'bad value' });
  assert.throws(() => rleEncode([1, undefined, 3]), { message: 'bad value' });
  assert.throws(() => rleEncode([1, true, 3]), { message: 'bad value' });
});

test('rleDecode([[1,3],[2,2],[7,1]]) returns [1,1,1,2,2,7]', () => {
  assert.deepStrictEqual(rleDecode([[1, 3], [2, 2], [7, 1]]), [1, 1, 1, 2, 2, 7]);
});

test('rleDecode([[3,0],[4,2]]) returns [4,4]', () => {
  assert.deepStrictEqual(rleDecode([[3, 0], [4, 2]]), [4, 4]);
});

test('rleDecode with a non-array argument throws not a list', () => {
  assert.throws(() => rleDecode('not a list'), { message: 'not a list' });
  assert.throws(() => rleDecode(null), { message: 'not a list' });
  assert.throws(() => rleDecode({}), { message: 'not a list' });
  assert.throws(() => rleDecode(42), { message: 'not a list' });
});

test('rleDecode with a pair containing a negative count throws bad count', () => {
  assert.throws(() => rleDecode([[1, -1]]), { message: 'bad count' });
  assert.throws(() => rleDecode([[5, -100]]), { message: 'bad count' });
});

test('rleDecode with an element that is not a two-element array of integers throws bad pair', () => {
  assert.throws(() => rleDecode([[1]]), { message: 'bad pair' });
  assert.throws(() => rleDecode([[1, 2, 3]]), { message: 'bad pair' });
  assert.throws(() => rleDecode([['a', 2]]), { message: 'bad pair' });
  assert.throws(() => rleDecode([[1, 2.5]]), { message: 'bad pair' });
  assert.throws(() => rleDecode([[1, null]]), { message: 'bad pair' });
  assert.throws(() => rleDecode([1, 2]), { message: 'bad pair' });
  assert.throws(() => rleDecode([null]), { message: 'bad pair' });
});

test('rleDecode(rleEncode(sample)) equals sample for a short mixed list of integers', () => {
  const sample = [5, 5, 5, 0, -3, -3, 9, 9, 9, 9];
  assert.deepStrictEqual(rleDecode(rleEncode(sample)), sample);
});

test('rleEncode preserves the order of distinct runs in the input', () => {
  assert.deepStrictEqual(rleEncode([7, 7, 3, 3, 3, 7, 7]), [[7, 2], [3, 3], [7, 2]]);
});