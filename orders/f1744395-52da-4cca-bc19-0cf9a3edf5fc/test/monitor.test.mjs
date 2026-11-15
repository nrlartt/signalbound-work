import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { loadConfig, getConfig, evaluateResult, check, start, stop, getState } from '../src/monitor.mjs';

test('loadConfig reads endpoint and thresholds', () => {
  const cfg = loadConfig({ endpoint: 'http://localhost:1/healthz', intervalMs: 60000, failureThreshold: 3, timeoutMs: 5000 });
  assert.strictEqual(cfg.endpoint, 'http://localhost:1/healthz');
  assert.strictEqual(cfg.intervalMs, 60000);
  assert.strictEqual(cfg.failureThreshold, 3);
  assert.strictEqual(cfg.timeoutMs, 5000);
});

test('loadConfig rejects missing endpoint', () => {
  assert.throws(() => loadConfig({}), /required/);
});

test('evaluateResult alarms after threshold consecutive failures', () => {
  const state = { consecutiveFailures: 2, wasHealthy: true, running: true };
  const decision = evaluateResult(false, state);
  assert.strictEqual(decision.consecutiveFailures, 3);
  assert.strictEqual(decision.shouldAlarm, true);
  assert.strictEqual(decision.shouldRecover, false);
});

test('evaluateResult resets on success', () => {
  const state = { consecutiveFailures: 5, wasHealthy: false, running: true };
  const decision = evaluateResult(true, state);
  assert.strictEqual(decision.consecutiveFailures, 0);
  assert.strictEqual(decision.shouldAlarm, false);
  assert.strictEqual(decision.shouldRecover, true);
});

test('check succeeds against healthy loopback fixture', async () => {
  const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  loadConfig({ endpoint: `http://127.0.0.1:${port}/healthz`, failureThreshold: 3, timeoutMs: 5000 });
  const decision = await check();
  assert.strictEqual(decision.ok, true);
  assert.strictEqual(decision.consecutiveFailures, 0);
  server.close();
});

test('check records failure against unreachable loopback fixture', async () => {
  loadConfig({ endpoint: 'http://127.0.0.1:1/healthz', failureThreshold: 3, timeoutMs: 500 });
  const decision = await check();
  assert.strictEqual(decision.ok, false);
  assert.strictEqual(decision.consecutiveFailures, 1);
  assert.strictEqual(decision.shouldAlarm, false);
});

test('start and stop control the monitor loop', () => {
  loadConfig({ endpoint: 'http://127.0.0.1:1/healthz', intervalMs: 50, failureThreshold: 3, timeoutMs: 100 });
  start();
  assert.strictEqual(getState().running, true);
  stop();
  assert.strictEqual(getState().running, false);
});