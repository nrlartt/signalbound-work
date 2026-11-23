import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

const DEFAULT_CONFIG_PATH = './config.json';
const DEFAULTS = {
  intervalSeconds: 30,
  maxBlockAgeSeconds: 60,
  maxBaseFeeGwei: 50,
  alertAfterFailures: 3,
  requestTimeoutMs: 10000,
};

function loadConfig(configPath) {
  let raw = {};
  try {
    raw = JSON.parse(readFileSync(configPath, 'utf8'));
  } catch {
    // No config file; rely on environment variables.
  }
  return {
    rpcUrl: process.env.MONITOR_ENDPOINT ?? raw.rpcUrl ?? raw.rpcUrl ?? undefined,
    intervalSeconds: process.env.MONITOR_INTERVAL_SECONDS ?? raw.intervalSeconds ?? DEFAULTS.intervalSeconds,
    maxBlockAgeSeconds: process.env.MONITOR_MAX_BLOCK_AGE_SECONDS ?? raw.maxBlockAgeSeconds ?? DEFAULTS.maxBlockAgeSeconds,
    maxBaseFeeGwei: process.env.MONITOR_MAX_BASE_FEE_GWEI ?? raw.maxBaseFeeGwei ?? DEFAULTS.maxBaseFeeGwei,
    alertAfterFailures: process.env.MONITOR_ALERT_AFTER_FAILURES ?? raw.alertAfterFailures ?? DEFAULTS.alertAfterFailures,
    requestTimeoutMs: process.env.MONITOR_REQUEST_TIMEOUT_MS ?? raw.requestTimeoutMs ?? DEFAULTS.requestTimeoutMs,
    configPath,
  };
}

function resolveEndpoint(config) {
  const endpoint = config.rpcUrl;
  if (!endpoint || typeof endpoint !== 'string' || endpoint.trim() === '') {
    throw new Error('Configuration error: MONITOR_ENDPOINT or config.rpcUrl must be set');
  }
  try {
    const url = new URL(endpoint);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Configuration error: endpoint must be http or https');
    }
    return url;
  } catch (err) {
    if (err.message.startsWith('Configuration error')) throw err;
    throw new Error(`Configuration error: invalid endpoint: ${err.message}`);
  }
}

function toNumber(hex) {
  if (hex === null || hex === undefined) return null;
  const str = String(hex);
  if (!str.startsWith('0x')) return Number(str);
  return BigInt(str);
}

function gweiFromWei(wei) {
  const weiBig = toNumber(wei);
  if (weiBig === null) return null;
  return Number(weiBig) / 1_000_000_000;
}

export function evaluateBlock(block, nowMs, maxBlockAgeSeconds, maxBaseFeeGwei) {
  const reasons = [];
  const blockNumber = block.number !== undefined ? Number(toNumber(block.number)) : null;
  const blockTimestamp = block.timestamp !== undefined ? Number(toNumber(block.timestamp)) : null;
  const baseFeeGwei = block.baseFeePerGas !== undefined ? gweiFromWei(block.baseFeePerGas) : null;
  const blockAge = blockTimestamp !== null ? (nowMs / 1000) - blockTimestamp : null;

  if (blockAge !== null && blockAge > maxBlockAgeSeconds) {
    reasons.push('stale-head');
  }
  if (baseFeeGwei !== null && baseFeeGwei > maxBaseFeeGwei) {
    reasons.push('high-base-fee');
  }

  return {
    blockNumber,
    blockAge,
    baseFeeGwei,
    reasons,
  };
}

export function evaluateFailure(consecutiveFailures, alertAfterFailures) {
  const next = consecutiveFailures + 1;
  return {
    consecutiveFailures: next,
    alert: next >= alertAfterFailures,
    reason: next >= alertAfterFailures ? 'rpc-down' : null,
  };
}

export function resetFailure() {
  return {
    consecutiveFailures: 0,
    alert: false,
    reason: null,
  };
}

async function fetchBlock(rpcUrl, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
        id: 1,
      }),
      signal: controller.signal,
    });
    const body = await response.json();
    return body;
  } finally {
    clearTimeout(timeoutId);
  }
}

function log(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

export async function runOnce(config, url) {
  const nowMs = Date.now();
  let body;
  try {
    body = await fetchBlock(url.href, config.requestTimeoutMs);
  } catch (err) {
    log({
      level: 'error',
      time: new Date(nowMs).toISOString(),
      error: err instanceof Error ? err.message : String(err),
    });
    return { success: false };
  }

  if (body.error) {
    log({
      level: 'error',
      time: new Date(nowMs).toISOString(),
      error: body.error.message || String(body.error),
    });
    return { success: false };
  }

  const block = body.result;
  const evaluation = evaluateBlock(block, nowMs, config.maxBlockAgeSeconds, config.maxBaseFeeGwei);

  log({
    level: 'info',
    time: new Date(nowMs).toISOString(),
    blockNumber: evaluation.blockNumber,
    blockAge: evaluation.blockAge !== null ? Math.round(evaluation.blockAge * 10) / 10 : null,
    baseFeeGwei: evaluation.baseFeeGwei !== null ? Math.round(evaluation.baseFeeGwei * 1000) / 1000 : null,
  });

  for (const reason of evaluation.reasons) {
    log({
      level: 'alert',
      reason,
      time: new Date(nowMs).toISOString(),
      blockNumber: evaluation.blockNumber,
    });
  }

  return { success: true };
}

export async function monitor(config) {
  const url = resolveEndpoint(config);
  let consecutiveFailures = 0;
  let running = true;

  const stop = () => {
    running = false;
  };

  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);

  while (running) {
    const result = await runOnce(config, url);
    if (result.success) {
      consecutiveFailures = 0;
    } else {
      const failure = evaluateFailure(consecutiveFailures, config.alertAfterFailures);
      consecutiveFailures = failure.consecutiveFailures;
      if (failure.alert) {
        log({
          level: 'alert',
          reason: failure.reason,
          time: new Date().toISOString(),
          consecutiveFailures,
        });
      }
    }

    if (!running) break;

    await new Promise((resolve) => {
      const timer = setTimeout(resolve, config.intervalSeconds * 1000);
      const unref = timer.unref?.();
      process.once('SIGINT', () => {
        clearTimeout(timer);
        resolve();
      });
      process.once('SIGTERM', () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  process.off('SIGINT', stop);
  process.off('SIGTERM', stop);
}

const configPath = process.env.MONITOR_CONFIG_PATH ?? DEFAULT_CONFIG_PATH;
const config = loadConfig(configPath);

monitor(config).catch((err) => {
  console.error(err.message);
  process.exit(1);
});