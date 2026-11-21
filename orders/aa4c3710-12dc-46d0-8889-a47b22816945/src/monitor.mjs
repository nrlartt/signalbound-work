import { readFileSync } from 'node:fs';
import { setTimeout } from 'node:timers/promises';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const DEFAULT_INTERVAL_SECONDS = 60;
const DEFAULT_MAX_TX_PER_INTERVAL = 20;
const RETRY_BACKOFF_MS = [1000, 2000, 4000];

function loadConfig(path) {
  const raw = readFileSync(path, 'utf8');
  const parsed = JSON.parse(raw);
  const endpoint = process.env.MONITOR_ENDPOINT ?? parsed.endpoint;
  if (!endpoint) {
    throw new Error('Configuration error: MONITOR_ENDPOINT or config.endpoint is required');
  }
  return {
    endpoint,
    contractAddress: parsed.contractAddress,
    intervalSeconds: Number(parsed.intervalSeconds ?? DEFAULT_INTERVAL_SECONDS),
    maxTxPerInterval: Number(parsed.maxTxPerInterval ?? DEFAULT_MAX_TX_PER_INTERVAL),
    minBalanceEth: parsed.minBalanceEth === undefined ? undefined : Number(parsed.minBalanceEth),
  };
}

function isAlert(check, config) {
  const reasons = [];
  if (check.txCount > config.maxTxPerInterval) {
    reasons.push(`txCount ${check.txCount} exceeds max ${config.maxTxPerInterval}`);
  }
  if (config.minBalanceEth !== undefined && check.balanceEth < config.minBalanceEth) {
    reasons.push(`balance ${check.balanceEth} ETH below min ${config.minBalanceEth} ETH`);
  }
  return {
    alert: reasons.length > 0,
    reason: reasons.join('; '),
  };
}

function parseBalanceEth(hexOrDecimal) {
  if (typeof hexOrDecimal !== 'string') return NaN;
  const wei = BigInt(hexOrDecimal);
  return Number(wei) / 1e18;
}

async function fetchJson(endpoint, payload, attempt = 0) {
  const controller = new AbortController();
  const timeout = setTimeout(10000, () => controller.abort());
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`RPC HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (attempt < RETRY_BACKOFF_MS.length - 1) {
      await setTimeout(RETRY_BACKOFF_MS[attempt]);
      return fetchJson(endpoint, payload, attempt + 1);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function latestBlock(endpoint) {
  const body = await fetchJson(endpoint, {
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 1,
  });
  if (body.error) throw new Error(body.error.message || 'RPC error');
  return BigInt(body.result);
}

async function blockRange(endpoint, fromBlock, toBlock) {
  const results = [];
  for (let block = fromBlock; block <= toBlock; block++) {
    const body = await fetchJson(endpoint, {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [block.toString(16), true],
      id: 2,
    });
    if (body.error) throw new Error(body.error.message || 'RPC error');
    results.push(body.result);
  }
  return results;
}

async function contractBalance(endpoint, address) {
  const body = await fetchJson(endpoint, {
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [address, 'latest'],
    id: 3,
  });
  if (body.error) throw new Error(body.error.message || 'RPC error');
  return parseBalanceEth(body.result);
}

async function runCheck(endpoint, contractAddress, lastBlock) {
  const current = await latestBlock(endpoint);
  const fromBlock = lastBlock === undefined ? current : BigInt(lastBlock) + 1n;
  let txCount = 0;
  let blocks = [];
  if (fromBlock <= current) {
    blocks = await blockRange(endpoint, fromBlock, current);
    for (const block of blocks) {
      for (const tx of block.transactions ?? []) {
        if (tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
          txCount++;
        }
      }
    }
  }
  const balanceEth = await contractBalance(endpoint, contractAddress);
  const check = {
    time: new Date().toISOString(),
    fromBlock: fromBlock.toString(),
    toBlock: current.toString(),
    txCount,
    balanceEth,
  };
  const decision = isAlert(check, {
    endpoint,
    contractAddress,
    intervalSeconds: 0,
    maxTxPerInterval: 0,
    minBalanceEth: undefined,
  });
  const line = decision.alert
    ? { level: 'alert', reason: decision.reason, ...check }
    : check;
  console.log(JSON.stringify(line));
  return { check, current };
}

export { loadConfig, isAlert, parseBalanceEth, fetchJson, runCheck };

async function main() {
  const configPath = process.argv[2] ?? 'config.json';
  const config = loadConfig(configPath);
  let lastBlock;
  let stopping = false;

  for (const signal of ['SIGINT', 'SIGTERM']) {
    const handler = () => {
      stopping = true;
    };
    process.on(signal, handler);
    // Ensure handler runs within 1 second of signal
    setTimeout(() => {
      if (stopping) return;
    }, 500);
  }

  while (!stopping) {
    try {
      const { current } = await runCheck(config.endpoint, config.contractAddress, lastBlock);
      lastBlock = current;
    } catch (error) {
      console.error(JSON.stringify({ level: 'error', message: error.message }));
    }
    if (stopping) break;
    await setTimeout(config.intervalSeconds * 1000);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(JSON.stringify({ level: 'fatal', message: error.message }));
    process.exit(1);
  });
}