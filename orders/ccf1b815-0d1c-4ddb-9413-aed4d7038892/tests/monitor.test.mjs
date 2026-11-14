import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { loadConfig, readEndpoint, createMonitor, isRecoveryNoticeEnabled } from '../src/monitor.mjs';

function envWith(overrides = {}) {
  const original = { ...process.env };
  return {
    set() {
      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = String(value);
      }
    },
    restore() {
      for (const key of Object.keys(original)) {
        process.env[key] = original[key];
      }
      for (const key of Object.keys(overrides)) {
        if (!(key in original)) delete process.env[key];
      }
    },
  };
}

async function handlerServer(handler) {
  const server = createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  return {
    url: `http://127.0.0.1:${port}`,
    stop() {
      return new Promise((resolve) => server.close(resolve));
    },
  };
}

test('loadConfig reads endpoint and thresholds from environment', () => {
  const env = envWith({
    MONITOR_ENDPOINT: 'https://example.com/healthz',
    MONITOR_INTERVAL_MS: '120000',
    MONITOR_CONSECUTIVE_FAILURES: '5',
    MONITOR_RECOVERY_NOTICE: 'false',
    MONITOR_REQUEST_TIMEOUT_MS: '20000',
    MONITOR_BACKOFF_MS: '10000',
  });
  env.set();
  try {
    const config = loadConfig();
    assert.strictEqual(config.endpoint, 'https://example.com/healthz');
    assert.strictEqual(config.intervalMs, 120000);
    assert.strictEqual(config.consecutiveFailures, 5);
    assert.strictEqual(isRecoveryNoticeEnabled(config.recoveryNotice), false);
    assert.strictEqual(config.requestTimeoutMs, 20000);
    assert.strictEqual(config.backoffMs, 10000);
  } finally {
    env.restore();
  }
});

test('loadConfig throws when endpoint is missing', () => {
  const env = envWith({ MONITOR_ENDPOINT: undefined });
  env.set();
  try {
    assert.throws(() => loadConfig(), /endpoint is required/);
  } finally {
    env.restore();
  }
});

test('readEndpoint succeeds against a local HTTP server', async () => {
  const server = await handlerServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
  });
  try {
    const result = await readEndpoint(server.url + '/healthz', 5000);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.bodyLength, 2);
  } finally {
    await server.stop();
  }
});

test('readEndpoint fails against a refusing port', async () => {
  await assert.rejects(
    () => readEndpoint('http://127.0.0.1:1', 1000),
    (error) => error.name === 'AbortError' || error.code === 'ECONNREFUSED'
  );
});

test('createMonitor alarms after consecutive failures and recovers', async () => {
  let calls = 0;
  const server = await handlerServer((req, res) => {
    calls += 1;
    if (calls <= 3) {
      res.writeHead(500);
      res.end('bad');
    } else {
      res.writeHead(200);
      res.end('ok');
    }
  });

  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => logs.push(args.join(' '));

  try {
    const monitor = createMonitor({
      endpoint: server.url + '/healthz',
      intervalMs: 10,
      consecutiveFailures: 3,
      recoveryNotice: true,
      requestTimeoutMs: 1000,
      backoffMs: 0,
    });

    await monitor.checkOnce();
    await monitor.checkOnce();
    await monitor.checkOnce();

    assert.strictEqual(monitor.state().consecutiveFailures, 3);
    assert.ok(logs.some((line) => line.includes('ALARM')));

    await monitor.checkOnce();

    assert.strictEqual(monitor.state().consecutiveFailures, 0);
    assert.ok(logs.some((line) => line.includes('RECOVERY')));
  } finally {
    console.log = originalLog;
    await server.stop();
  }
});

test('createMonitor state reports cadence settings', () => {
  const monitor = createMonitor({
    endpoint: 'https://example.com/healthz',
    intervalMs: 60000,
    consecutiveFailures: 3,
    recoveryNotice: true,
    requestTimeoutMs: 10000,
    backoffMs: 5000,
  });

  const state = monitor.state();
  assert.strictEqual(state.config.intervalMs, 60000);
  assert.strictEqual(state.config.consecutiveFailuresRequired, 3);
  assert.strictEqual(state.config.recoveryNotice, true);
  assert.strictEqual(state.config.requestTimeoutMs, 10000);
  assert.strictEqual(state.config.backoffMs, 5000);
});

test('createMonitor does not alarm before threshold', async () => {
  const server = await handlerServer((req, res) => {
    res.writeHead(500);
    res.end('bad');
  });

  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => logs.push(args.join(' '));

  try {
    const monitor = createMonitor({
      endpoint: server.url + '/healthz',
      intervalMs: 10,
      consecutiveFailures: 3,
      recoveryNotice: false,
      requestTimeoutMs: 1000,
      backoffMs: 0,
    });

    await monitor.checkOnce();
    await monitor.checkOnce();

    assert.strictEqual(monitor.state().consecutiveFailures, 2);
    assert.ok(!logs.some((line) => line.includes('ALARM')));
  } finally {
    console.log = originalLog;
    await server.stop();
  }
});
