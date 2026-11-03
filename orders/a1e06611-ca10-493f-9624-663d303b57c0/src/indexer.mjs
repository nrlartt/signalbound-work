import { createHttpClient, http } from 'viem';

const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
  console.error('FATAL: RPC_URL environment variable is not set. Set it to your JSON-RPC endpoint and rerun.');
  process.exit(1);
}

const ERC20_TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const SNAPSHOT_PATH = process.env.SNAPSHOT_PATH || './snapshot.json';
const DEFAULT_FROM_BLOCK = '0x0';
const DEFAULT_TO_BLOCK = 'latest';
const BATCH_BLOCKS = 1000;

const client = createHttpClient({
  transport: http(RPC_URL),
});

function parseTransferLog(log) {
  const topics = log.topics || [];
  const data = log.data || '0x';
  if (topics.length < 3) return null;
  const from = '0x' + topics[1].slice(-40);
  const to = '0x' + topics[2].slice(-40);
  const value = BigInt(data);
  return {
    blockNumber: log.blockNumber ? Number(log.blockNumber) : null,
    transactionHash: log.transactionHash || null,
    logIndex: log.logIndex ? Number(log.logIndex) : null,
    address: log.address || null,
    from,
    to,
    value: value.toString(),
  };
}

async function hexToNumber(hex) {
  if (hex === undefined || hex === null) return null;
  return Number(BigInt(hex));
}

async function getLatestBlock() {
  const block = await client.getBlock();
  return block.number !== null ? Number(block.number) : 0;
}

async function fetchLogsInRange(fromBlock, toBlock, address) {
  const params = {
    fromBlock,
    toBlock,
    topics: [[ERC20_TRANSFER_TOPIC]],
  };
  if (address) {
    params.address = address;
  }
  const logs = await client.getContractEvents(params);
  return logs;
}

async function index() {
  const fromBlockEnv = process.env.FROM_BLOCK || DEFAULT_FROM_BLOCK;
  const toBlockEnv = process.env.TO_BLOCK || DEFAULT_TO_BLOCK;
  const tokenAddress = process.env.TOKEN_ADDRESS || null;

  let fromBlock = fromBlockEnv;
  let toBlock = toBlockEnv;

  if (toBlock === 'latest') {
    toBlock = await getLatestBlock();
  } else {
    toBlock = Number(toBlock);
  }

  if (fromBlock === 'latest') {
    fromBlock = await getLatestBlock();
  } else {
    fromBlock = Number(fromBlock);
  }

  if (Number.isNaN(fromBlock) || Number.isNaN(toBlock)) {
    console.error('FATAL: FROM_BLOCK and TO_BLOCK must be numeric block numbers or "latest".');
    process.exit(1);
  }

  if (fromBlock > toBlock) {
    console.error('FATAL: FROM_BLOCK is greater than TO_BLOCK.');
    process.exit(1);
  }

  console.log(`Indexing ERC-20 Transfer events from block ${fromBlock} to ${toBlock}...`);

  const events = [];
  let cursor = fromBlock;

  while (cursor <= toBlock) {
    const end = Math.min(cursor + BATCH_BLOCKS - 1, toBlock);
    const hexFrom = '0x' + cursor.toString(16);
    const hexEnd = '0x' + end.toString(16);

    try {
      const logs = await fetchLogsInRange(hexFrom, hexEnd, tokenAddress);
      for (const log of logs) {
        const parsed = parseTransferLog(log);
        if (parsed) events.push(parsed);
      }
    } catch (err) {
      console.error(`Error fetching blocks ${hexFrom}-${hexEnd}:`, err.message);
    }

    cursor = end + 1;
  }

  events.sort((a, b) => (a.blockNumber || 0) - (b.blockNumber || 0) || (a.logIndex || 0) - (b.logIndex || 0));

  const snapshot = {
    generatedAt: new Date().toISOString(),
    rpcUrl: RPC_URL,
    fromBlock,
    toBlock,
    tokenAddress: tokenAddress || null,
    eventCount: events.length,
    events,
  };

  import { writeFile } from 'node:fs/promises';
  await writeFile(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');

  console.log(`Wrote ${events.length} events to ${SNAPSHOT_PATH}`);
}

index().catch((err) => {
  console.error('Indexer failed:', err);
  process.exit(1);
});