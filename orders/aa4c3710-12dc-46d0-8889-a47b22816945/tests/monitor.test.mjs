import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { loadConfig, isAlert, parseBalanceEth, runCheck } from '../src/monitor.mjs';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

test('loadConfig reads endpoint from environment', () => {
  const dir = mkdtempSync(join(tmpdir(), 'monitor-test-'));
  const path = join(dir, 'config.json');
  writeFileSync(path, JSON.stringify({ endpoint: 'http://127.0.0.1:9999', contractAddress: '0xabc' }));
  process.env.MONITOR_ENDPOINT = 'http://127.0.0.1:5555';
  try {
    const config = loadConfig(path);
    assert.strictEqual(config.endpoint, 'http://127.0.0.1:5555');
  } finally {
    delete process.env.MONITOR_ENDPOINT;
    rmSync(dir, { recursive: true, force: true });
  }
});

test('loadConfig fails when endpoint is absent', () => {
  const dir = mkdtempSync(join(tmpdir(), 'monitor-test-'));
  const path = join(dir, 'config.json');
  writeFileSync(path, JSON.stringify({ contractAddress: '0xabc' }));
  delete process.env.MONITOR_ENDPOINT;
  assert.throws(() => loadConfig(path), /Configuration error/);
  rmSync(dir, { recursive: true, force: true });
});

test('isAlert detects high tx count', () => {
  const result = isAlert({ txCount: 25, balanceEth: 5 }, { maxTxPerInterval: 20, minBalanceEth: undefined });
  assert.strictEqual(result.alert, true);
  assert.match(result.reason, /txCount/);
});

test('isAlert detects low balance', () => {
  const result = isAlert({ txCount: 1, balanceEth: 0.1 }, { maxTxPerInterval: 100, minBalanceEth: 1 });
  assert.strictEqual(result.alert, true);
  assert.match(result.reason, /balance/);
});

test('isAlert is silent when within thresholds', () => {
  const result = isAlert({ txCount: 5, balanceEth: 5 }, { maxTxPerInterval: 20, minBalanceEth: 1 });
  assert.strictEqual(result.alert, false);
  assert.strictEqual(result.reason, '');
});

test('parseBalanceEth converts wei to eth', () => {
  assert.strictEqual(parseBalanceEth('0xde0b6b3a7640000'), 1);
});

test('runCheck works with mocked fetch', async () => {
  const calls = [];
  globalThis.fetch = async (input, init) => {
    calls.push({ url: String(input), body: init.body });
    const payload = JSON.parse(init.body);
    if (payload.method === 'eth_blockNumber') {
      return { ok: true, json: async () => ({ jsonrpc: '2.0', id: 1, result: '0x2' }) };
    }
    if (payload.method === 'eth_getBlockByNumber') {
      const block = Number(payload.params[0]);
      return {
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          id: 2,
          result: {
            number: '0x2',
            transactions: block === 2 ? [{ to: '0xabc' }] : [],
          },
        }),
      };
    }
    if (payload.method === 'eth_getBalance') {
      return { ok: true, json: async () => ({ jsonrpc: '2.0', id: 3, result: '0xde0b6b3a7640000' }) };
    }
    return { ok: true, json: async () => ({}) };
  };

  const logs = [];
  const originalLog = console.log;
  console.log = (message) => logs.push(message);
  try {
    await import('../src/monitor.mjs').then(async (mod) => {
      await mod.runCheck('http://127.0.0.1:5555', '0xabc', undefined);
    });
  } finally {
    console.log = originalLog;
  }

  const last = JSON.parse(logs[logs.length - 1]);
  assert.strictEqual(last.txCount, 1);
  assert.strictEqual(last.balanceEth, 1);
  assert.strictEqual(calls.some((c) => c.url === 'http://127.0.0.1:5555'), true);
});