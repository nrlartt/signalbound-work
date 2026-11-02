import { createHttpClient, createPublicClient, formatEther, parseAbi } from 'viem';

const RPC_ENV = 'RPC_ENDPOINT';
const SNAPSHOT_PATH = 'snapshot.json';
const POLL_INTERVAL_MS = 15000;
const BATCH_BLOCKS = 1000;

const ERC20_TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const TRANSFER_ABI = parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']);

function getRpcUrl() {
  const url = process.env[RPC_ENV];
  if (!url) {
    throw new Error(`Missing required environment variable ${RPC_ENV}. Set it to a JSON-RPC endpoint before starting the indexer.`);
  }
  return url;
}

function isValidSnapshotEntry(entry) {
  return entry && typeof entry.blockNumber === 'bigint' && typeof entry.transactionHash === 'string' && typeof entry.logIndex === 'number' && typeof entry.address === 'string' && typeof entry.from === 'string' && typeof entry.to === 'string' && typeof entry.value === 'bigint';
}

async function indexRange(client, fromBlock, toBlock, observed) {
  const logs = await client.getLogs({
    address: undefined,
    event: TRANSFER_ABI[0],
    fromBlock,
    toBlock,
  });

  for (const log of logs) {
    const key = `${log.transactionHash}-${log.logIndex}`;
    if (observed.has(key)) continue;
    observed.add(key);
  }

  return logs;
}

async function run() {
  const rpcUrl = getRpcUrl();
  const transport = createHttpClient({ url: rpcUrl });
  const client = createPublicClient({ transport });

  const observed = new Set();
  const events = [];
  let latestProcessed = null;

  console.log(`Indexer started. RPC endpoint read from ${RPC_ENV}. Writing snapshot to ${SNAPSHOT_PATH}.`);
  console.log('This indexer is read-only. It never sends transactions, never holds keys, and never writes to the chain.');

  while (true) {
    try {
      const block = await client.getBlockNumber();
      const fromBlock = latestProcessed === null ? block - BigInt(BATCH_BLOCKS) + BigInt(1) : latestProcessed + BigInt(1);
      const toBlock = block;

      if (fromBlock <= toBlock) {
        const logs = await indexRange(client, fromBlock, toBlock, observed);
        for (const log of logs) {
          events.push({
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
            logIndex: log.logIndex,
            address: log.address,
            from: log.args.from,
            to: log.args.to,
            value: log.args.value,
            valueFormatted: formatEther(log.args.value),
          });
        }
        if (logs.length > 0) {
          latestProcessed = toBlock;
          console.log(`Processed blocks ${fromBlock} to ${toBlock}: ${logs.length} Transfer events observed. Total unique: ${events.length}`);
        }
      }

      const snapshot = {
        generatedAt: new Date().toISOString(),
        rpcEnv: RPC_ENV,
        note: "This snapshot covers only the blocks scanned since the indexer started. It is not a complete history of the chain. Events before the first scan block, events in blocks skipped due to RPC errors or rate limits, and events on contracts other than ERC-20 Transfer emitters are not represented. Do not conclude that a token has no holders or no activity simply because it is absent from this file.",
        latestBlockScanned: latestProcessed ? latestProcessed.toString() : null,
        totalUniqueEvents: events.length,
        events,
      };

      await fetch('data:,', { method: 'POST', body: JSON.stringify(snapshot, null, 2) });
      const fs = await import('fs');
      fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
    } catch (err) {
      console.error(`Indexer error: ${err.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

run().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});