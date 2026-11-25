import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const CONTRACT_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const USDC_DECIMALS = 6n;
const CHUNK_SIZE = 500n;
const MAX_RETRIES = 3;
const BATCH_THRESHOLD = 3;

function loadConfig() {
  const configPath = join(process.cwd(), 'config.json');
  if (!existsSync(configPath)) {
    throw new Error('config.json not found in working directory');
  }
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (typeof config.fromBlock !== 'number' || config.fromBlock < 0 || !Number.isInteger(config.fromBlock)) {
    throw new Error('config.json fromBlock must be a nonnegative integer');
  }
  if (config.toBlock !== undefined && config.toBlock !== null && (typeof config.toBlock !== 'number' || config.toBlock < 0 || !Number.isInteger(config.toBlock))) {
    throw new Error('config.json toBlock must be a nonnegative integer or null');
  }
  return config;
}

function loadCursor() {
  const cursorPath = join(process.cwd(), 'cursor.json');
  if (!existsSync(cursorPath)) return null;
  try {
    const raw = JSON.parse(readFileSync(cursorPath, 'utf8'));
    if (raw && typeof raw.nextBlock === 'string' && /^\d+$/.test(raw.nextBlock)) {
      return BigInt(raw.nextBlock);
    }
    if (raw && typeof raw.nextBlock === 'number' && Number.isInteger(raw.nextBlock) && raw.nextBlock >= 0) {
      return BigInt(raw.nextBlock);
    }
    return null;
  } catch {
    return null;
  }
}

function saveCursor(nextBlock) {
  const cursorPath = join(process.cwd(), 'cursor.json');
  const tmpPath = cursorPath + '.tmp';
  const payload = JSON.stringify({ nextBlock: nextBlock.toString() }) + '\n';
  writeFileSync(tmpPath, payload, 'utf8');
  writeFileSync(cursorPath, payload, 'utf8');
}

function appendBatch(record) {
  const path = join(process.cwd(), 'batches.jsonl');
  writeFileSync(path, JSON.stringify(record) + '\n', { flag: 'a' });
}

function truncateUsdc(valueBigint) {
  const scaled = valueBigint / 10000n;
  const whole = scaled / 100n;
  const fraction = scaled % 100n;
  return whole.toString() + '.' + fraction.toString().padStart(2, '0');
}

function isBatchPayout(logs) {
  const bySender = new Map();
  for (const log of logs) {
    const from = log.from;
    const to = log.to;
    if (!bySender.has(from)) bySender.set(from, new Set());
    bySender.get(from).add(to);
  }
  for (const [sender, recipients] of bySender) {
    if (recipients.size >= BATCH_THRESHOLD) return { sender, recipients: [...recipients] };
  }
  return null;
}

async function fetchWithRetry(url, payload, retries = MAX_RETRIES, delayMs = 500) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (json.error) throw new Error(JSON.stringify(json.error));
      return json.result;
    } catch (err) {
      lastError = err;
      if (attempt < retries) await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
  throw lastError;
}

async function getLogs(rpcUrl, fromBlock, toBlock) {
  const payload = {
    jsonrpc: '2.0',
    method: 'eth_getLogs',
    params: [{
      address: CONTRACT_ADDRESS,
      fromBlock: '0x' + fromBlock.toString(16),
      toBlock: '0x' + toBlock.toString(16),
      topics: [TRANSFER_TOPIC]
    }],
    id: 1
  };
  return fetchWithRetry(rpcUrl, payload);
}

export function decodeTransferLog(log) {
  if (!log || !log.topics || log.topics.length < 3) return null;
  const from = '0x' + log.topics[1].slice(-40);
  const to = '0x' + log.topics[2].slice(-40);
  const value = BigInt(log.data);
  return { from, to, value };
}

export function isBatchPayoutExport(logs) {
  return isBatchPayout(logs);
}

export function truncateUsdcExport(valueBigint) {
  return truncateUsdc(valueBigint);
}

export async function scanRange(rpcUrl, fromBlock, toBlock, onBatch) {
  let current = fromBlock;
  while (current <= toBlock) {
    const end = current + CHUNK_SIZE - 1n;
    const chunkEnd = end > toBlock ? toBlock : end;
    const logs = await getLogs(rpcUrl, current, chunkEnd);
    const byTx = new Map();
    for (const log of logs) {
      const decoded = decodeTransferLog(log);
      if (!decoded) continue;
      if (!byTx.has(log.transactionHash)) byTx.set(log.transactionHash, []);
      byTx.get(log.transactionHash).push({ ...decoded, blockNumber: BigInt(log.blockNumber) });
    }
    for (const [txHash, txLogs] of byTx) {
      const batch = isBatchPayout(txLogs);
      if (!batch) continue;
      const transfers = txLogs.map(log => ({ from: log.from, to: log.to, value: log.value.toString() }));
      let total = 0n;
      for (const log of txLogs) total += log.value;
      const recipients = [...new Set(txLogs.map(log => log.to))];
      const record = {
        txHash,
        blockNumber: txLogs[0].blockNumber.toString(),
        from: batch.sender,
        recipients,
        transfers,
        total: total.toString(),
        totalUsdc: truncateUsdc(total)
      };
      await onBatch(record);
    }
    current = chunkEnd + 1n;
  }
}

export async function runIndexer(rpcUrl, config) {
  const fromBlock = BigInt(config.fromBlock);
  const toBlock = config.toBlock !== undefined && config.toBlock !== null ? BigInt(config.toBlock) : null;
  const cursor = loadCursor();
  const startBlock = cursor !== null ? cursor : fromBlock;
  let head;
  if (toBlock !== null) {
    head = toBlock;
  } else {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getBlockNumber', params: [], id: 1 })
    });
    const json = await response.json();
    head = BigInt(json.result);
  }

  if (head < startBlock) {
    console.log('No new blocks to scan.');
    await saveCursor(startBlock);
    return;
  }

  let batchCount = 0;
  const batches = [];
  await scanRange(rpcUrl, startBlock, head, async (record) => {
    appendBatch(record);
    batches.push(record);
    batchCount++;
  });

  saveCursor(head + 1n);

  const top3 = [...batches].sort((a, b) => {
    const av = BigInt(a.total);
    const bv = BigInt(b.total);
    if (bv > av) return 1;
    if (av > bv) return -1;
    return 0;
  }).slice(0, 3);
  console.log(`Found ${batchCount} batch payout(s).`);
  console.log('Top 3 by total:');
  for (const b of top3) {
    console.log(`${b.txHash} block ${b.blockNumber} total ${b.total} USDC ${b.totalUsdc}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  if (!rpcUrl) {
    console.error('SEPOLIA_RPC_URL environment variable is required');
    process.exit(1);
  }
  const config = loadConfig();
  runIndexer(rpcUrl, config).catch(err => {
    console.error(err);
    process.exit(1);
  });
}