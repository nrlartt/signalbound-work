import { createReadStream } from 'node:fs';
import { existsSync } from 'node:fs';
import { setTimeout } from 'node:timers/promises';
import { AbortController } from 'node:abort-controller';
import { createFetch } from 'node:fetch';

const FETCH = createFetch();

const DEFAULT_CONFIG_PATH = '/tmp/eth-monitor-config.json';
const DEFAULT_INTERVAL_SECONDS = 300;
const DEFAULT_BLOCK_STALE_SECONDS = 120;
const MAX_CONSECUTIVE_FAILURES = 3;
const RPC_TIMEOUT_MS = 8000;

/**
 * Load monitor configuration from environment variables and an optional JSON config file.
 * The RPC endpoint must come from MONITOR_RPC_URL or config.rpcUrl; there is no literal
 * URL fallback. If both are absent, this throws an explicit configuration error.
 */
function loadConfig() {
  let config = {};
  const configPath = process.env.MONITOR_CONFIG_PATH || DEFAULT_CONFIG_PATH;

  if (existsSync(configPath)) {
    try {
      const raw = new TextDecoder().decode(createReadStream(configPath));
      config = JSON.parse(raw);
    } catch (err) {
      throw new Error(`Failed to parse config file ${configPath}: ${err.message}`);
    }
  }

  const rpcUrl = process.env.MONITOR_RPC_URL || config.rpcUrl;
  if (!rpcUrl) {
    throw new Error('Configuration error: MONITOR_RPC_URL or config.rpcUrl is required');
  }

  const intervalSeconds = Number(process.env.MONITOR_INTERVAL_SECONDS ?? config.intervalSeconds ?? DEFAULT_INTERVAL_SECONDS);
  const blockStaleSeconds = Number(process.env.MONITOR_BLOCK_STALE_SECONDS ?? config.blockStaleSeconds ?? DEFAULT_BLOCK_STALE_SECONDS);
  const wallets = Array.isArray(config.wallets) ? config.wallets : [];

  return {
    rpcUrl,
    intervalSeconds: Number.isFinite(intervalSeconds) && intervalSeconds > 0 ? intervalSeconds : DEFAULT_INTERVAL_SECONDS,
    blockStaleSeconds: Number.isFinite(blockStaleSeconds) && blockStaleSeconds > 0 ? blockStaleSeconds : DEFAULT_BLOCK_STALE_SECONDS,
    wallets: wallets.map((w) => ({
      address: String(w.address || '').trim(),
      thresholdEth: Number(w.thresholdEth ?? 0),
    })),
  };
}

function isValidAddress(addr) {
  const a = String(addr).trim().toLowerCase();
  return /^0x[a-f0-9]{40}$/.test(a);
}

async function fetchJson(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await FETCH(url, {
      signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
    });
    const data = await res.json();
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function rpcCall(rpcUrl, method, params, timeoutMs = RPC_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const payload = JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 });

  try {
    const res = await FETCH(rpcUrl, {
      signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: payload,
    });
    const data = await res.json();
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getLatestBlockTimestamp(rpcUrl) {
  const data = await rpcCall(rpcUrl, 'eth_getBlockByNumber', ['latest', false]);
  if (!data || typeof data !== 'object') throw new Error('invalid block response');
  const result = data.result;
  if (result && typeof result.timestamp === 'string') {
    return parseInt(result.timestamp, 16);
  }
  throw new Error('timestamp missing from block response');
}

async function getBalance(rpcUrl, address) {
  const data = await rpcCall(rpcUrl, 'eth_getBalance', [address, 'latest']);
  if (!data || typeof data !== 'object') throw new Error('invalid balance response');
  const result = data.result;
  const wei = typeof result === 'string' ? result : String(result);
  const eth = Number(BigInt(wei)) / 1e18;
  return { eth, wei };
}

function formatAlert(type, detail, timestamp) {
  const iso = new Date(timestamp * 1000).toISOString();
  return JSON.stringify({ type, detail, timestamp: iso });
}

async function checkWallets(config) {
  let blockStale = false;
  try {
    const blockTs = await getLatestBlockTimestamp(config.rpcUrl);
    const now = Date.now() / 1000;
    if (now - blockTs > config.blockStaleSeconds) {
      blockStale = true;
      console.log(formatAlert('block_stale', `block timestamp older than ${config.blockStaleSeconds}s`, blockTs));
    }
  } catch (e) {
    console.error('RPC error while checking block timestamp:', e);
  }

  for (const w of config.wallets) {
    if (!isValidAddress(w.address)) {
      console.warn(`invalid address skipped: ${w.address}`);
      continue;
    }
    try {
      const { eth } = await getBalance(config.rpcUrl, w.address);
      if (eth < w.thresholdEth) {
        console.log(formatAlert('balance_low', `address ${w.address} balance ${eth} ETH below threshold ${w.thresholdEth} ETH`, Date.now() / 1000));
      }
    } catch (e) {
      console.error(`RPC error for address ${w.address}:`, e);
    }
  }
}

async function mainLoop(config) {
  let consecutiveFailures = 0;

  while (true) {
    let loopError = null;
    try {
      await checkWallets(config);
    } catch (e) {
      loopError = e;
    }

    if (loopError) {
      consecutiveFailures++;
      console.error('loop error, backoff:', loopError);
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error('too many consecutive failures, stopping.');
        break;
      }
      await setTimeout(Math.min(config.intervalSeconds * 1000, 30000));
      continue;
    }

    consecutiveFailures = 0;
    await setTimeout(config.intervalSeconds * 1000);
  }
}

let running = true;

function handleShutdown() {
  running = false;
  console.log('shutdown signal received; exiting after current interval');
}

async function run() {
  const config = loadConfig();
  console.log('eth-wallet-monitor starting');
  console.log(`config: interval=${config.intervalSeconds}s, wallets=${config.wallets.length}, blockStale=${config.blockStaleSeconds}s`);

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);

  while (running) {
    await mainLoop(config);
  }

  process.off('SIGINT', handleShutdown);
  process.off('SIGTERM', handleShutdown);
  console.log('eth-wallet-monitor stopped');
}

run().catch((e) => {
  console.error('fatal error:', e);
  process.exit(1);
});