import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { diffLines } from '../src/diffLines.mjs';

const line = (id, text = 't', source = 's') => ({ id, text, source });

test('test case 1: added, removed, changed, unchanged with differing text', () => {
  const before = [line(1, 'a', 's'), line(2, 'b', 's'), line(3, 'c', 's')];
  const after = [line(1, 'a', 's'), line(3, 'c-changed', 's'), line(5, 'e', 's')];
  const result = diffLines(before, after);
  assert.deepStrictEqual(result.added, [5]);
  assert.deepStrictEqual(result.removed, [2]);
  assert.deepStrictEqual(result.changed, [3]);
  assert.strictEqual(result.unchanged, 1);
});

test('test case 2: reordered ids with source change', () => {
  const before = [line(1, 'a', 's'), line(2, 'b', 's'), line(3, 'c', 's')];
  const after = [line(3, 'c', 's'), line(2, 'b', 's-changed'), line(1, 'a', 's')];
  const result = diffLines(before, after);
  assert.deepStrictEqual(result.added, []);
  assert.deepStrictEqual(result.removed, []);
  assert.deepStrictEqual(result.changed, [2]);
  assert.strictEqual(result.unchanged, 2);
});

test('test case 3: empty before with one after record', () => {
  const before = [];
  const after = [line(9, 't', 's')];
  const result = diffLines(before, after);
  assert.deepStrictEqual(result.added, [9]);
  assert.deepStrictEqual(result.removed, []);
  assert.deepStrictEqual(result.changed, []);
  assert.strictEqual(result.unchanged, 0);
});

test('test case 4: before with three ids and empty after', () => {
  const before = [line(1, 'a', 's'), line(2, 'b', 's'), line(3, 'c', 's')];
  const after = [];
  const result = diffLines(before, after);
  assert.deepStrictEqual(result.added, []);
  assert.deepStrictEqual(result.removed, [1, 2, 3]);
  assert.deepStrictEqual(result.changed, []);
  assert.strictEqual(result.unchanged, 0);
});

test('test case 5: duplicate id in before throws', () => {
  const before = [line(1, 'a', 's'), line(1, 'b', 's')];
  const after = [line(1, 'a', 's')];
  assert.throws(() => diffLines(before, after), { message: 'duplicate id' });
});

test('test case 6: duplicate id in after throws', () => {
  const before = [line(2, 'a', 's')];
  const after = [line(2, 'a', 's'), line(2, 'b', 's')];
  assert.throws(() => diffLines(before, after), { message: 'duplicate id' });
});

test('test case 7: identical before and after', () => {
  const before = [line(1, 'a', 's'), line(2, 'b', 's'), line(3, 'c', 's')];
  const after = [line(1, 'a', 's'), line(2, 'b', 's'), line(3, 'c', 's')];
  const result = diffLines(before, after);
  assert.deepStrictEqual(result.added, []);
  assert.deepStrictEqual(result.removed, []);
  assert.deepStrictEqual(result.changed, []);
  assert.strictEqual(result.unchanged, 3);
});

test('test case 8: same id different text', () => {
  const before = [line(1, 'a', 's')];
  const after = [line(1, 'b', 's')];
  const result = diffLines(before, after);
  assert.deepStrictEqual(result.changed, [1]);
  assert.strictEqual(result.unchanged, 0);
});

test('test case 9: same id different source with same text', () => {
  const before = [line(1, 'a', 's')];
  const after = [line(1, 'a', 't')];
  const result = diffLines(before, after);
  assert.deepStrictEqual(result.changed, [1]);
  assert.strictEqual(result.unchanged, 0);
});

test('test case 10: reordered ids with same content', () => {
  const before = [line(1, 'a', 's'), line(2, 'b', 's')];
  const after = [line(2, 'b', 's'), line(1, 'a', 's')];
  const result = diffLines(before, after);
  assert.deepStrictEqual(result.added, []);
  assert.deepStrictEqual(result.removed, []);
  assert.deepStrictEqual(result.changed, []);
  assert.strictEqual(result.unchanged, 2);
});

test('test case 11: unsorted ids reordered with same content', () => {
  const before = [line(10, 'a', 's'), line(2, 'b', 's'), line(30, 'c', 's')];
  const after = [line(2, 'b', 's'), line(10, 'a', 's'), line(30, 'c', 's')];
  const result = diffLines(before, after);
  assert.deepStrictEqual(result.added, []);
  assert.deepStrictEqual(result.removed, []);
  assert.deepStrictEqual(result.changed, []);
  assert.strictEqual(result.unchanged, 3);
});

test('test case 12: new id added to existing ids', () => {
  const before = [line(1, 'a', 's'), line(2, 'b', 's')];
  const after = [line(1, 'a', 's'), line(2, 'b', 's'), line(3, 'c', 's')];
  const result = diffLines(before, after);
  assert.deepStrictEqual(result.added, [3]);
  assert.deepStrictEqual(result.removed, []);
  assert.deepStrictEqual(result.changed, []);
  assert.strictEqual(result.unchanged, 2);
});