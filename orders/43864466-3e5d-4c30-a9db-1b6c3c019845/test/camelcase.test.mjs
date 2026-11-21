import assert from 'node:assert/strict';
import camelCase from '../src/index.mjs';

describe('camelCase', () => {
  it('camelCase(\'foo-bar\') returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('foo-bar'), 'fooBar');
  });

  it('camelCase(\'foo_bar\') returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('foo_bar'), 'fooBar');
  });

  it('camelCase(\'Foo-Bar\') returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('Foo-Bar'), 'fooBar');
  });

  it('camelCase(\'--foo.bar\') returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('--foo.bar'), 'fooBar');
  });

  it('camelCase(\'foo bar\') returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('foo bar'), 'fooBar');
  });

  it('camelCase([\'foo\', \'bar\']) returns \'fooBar\'', () => {
    assert.strictEqual(camelCase(['foo', 'bar']), 'fooBar');
  });

  it('camelCase(\'foo-bar\', {pascalCase: true}) returns \'FooBar\'', () => {
    assert.strictEqual(camelCase('foo-bar', { pascalCase: true }), 'FooBar');
  });

  it('camelCase(\'\') returns \'\'', () => {
    assert.strictEqual(camelCase(''), '');
  });

  it('camelCase(\'FOO\') returns \'foo\'', () => {
    assert.strictEqual(camelCase('FOO'), 'foo');
  });

  it('camelCase(\'foo\') returns \'foo\'', () => {
    assert.strictEqual(camelCase('foo'), 'foo');
  });

  it('camelCase(\'foo-bar-baz\') returns \'fooBarBaz\'', () => {
    assert.strictEqual(camelCase('foo-bar-baz'), 'fooBarBaz');
  });

  it('camelCase(\'foo__bar\') returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('foo__bar'), 'fooBar');
  });

  it('camelCase(\'-foo-\') returns \'foo\'', () => {
    assert.strictEqual(camelCase('-foo-'), 'foo');
  });

  it('camelCase(\'foo.bar.baz\') returns \'fooBarBaz\'', () => {
    assert.strictEqual(camelCase('foo.bar.baz'), 'fooBarBaz');
  });

  it('camelCase(\'foo  bar\') returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('foo  bar'), 'fooBar');
  });

  it('camelCase([\'foo\', \'bar\', \'baz\']) returns \'fooBarBaz\'', () => {
    assert.strictEqual(camelCase(['foo', 'bar', 'baz']), 'fooBarBaz');
  });

  it('camelCase([\'foo\']) returns \'foo\'', () => {
    assert.strictEqual(camelCase(['foo']), 'foo');
  });

  it('camelCase([]) returns \'\'', () => {
    assert.strictEqual(camelCase([]), '');
  });

  it('camelCase(\'foo-bar\', {pascalCase: false}) returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('foo-bar', { pascalCase: false }), 'fooBar');
  });

  it('camelCase(\'foo-bar\', {}) returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('foo-bar', {}), 'fooBar');
  });

  it('camelCase(\'foo-bar\', {preserveConsecutiveUppercase: true}) returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('foo-bar', { preserveConsecutiveUppercase: true }), 'fooBar');
  });

  it('camelCase(\'foo-bar\', {locale: \'en\'}) returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('foo-bar', { locale: 'en' }), 'fooBar');
  });

  it('camelCase(\'hello_world-example.test\') returns \'helloWorldExampleTest\'', () => {
    assert.strictEqual(camelCase('hello_world-example.test'), 'helloWorldExampleTest');
  });

  it('camelCase(\'ALREADY-CAMEL\') returns \'alreadyCamel\'', () => {
    assert.strictEqual(camelCase('ALREADY-CAMEL'), 'alreadyCamel');
  });

  it('camelCase(\'a-b-c\') returns \'aBC\'', () => {
    assert.strictEqual(camelCase('a-b-c'), 'aBC');
  });

  it('camelCase(\'foo-bar\', {pascalCase: true, preserveConsecutiveUppercase: true}) returns \'FooBar\'', () => {
    assert.strictEqual(camelCase('foo-bar', { pascalCase: true, preserveConsecutiveUppercase: true }), 'FooBar');
  });

  it('camelCase(\'foo-bar\', {locale: undefined}) returns \'fooBar\'', () => {
    assert.strictEqual(camelCase('foo-bar', { locale: undefined }), 'fooBar');
  });
});