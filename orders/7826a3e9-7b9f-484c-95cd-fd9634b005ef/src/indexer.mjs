import { ethers } from "ethers";
import { writeFile } from "fs/promises";

// Environment variables (must be set by the user)
const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
  console.error("Error: RPC_URL environment variable not set.");
  process.exit(1);
}
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
if (!CONTRACT_ADDRESS) {
  console.error("Error: CONTRACT_ADDRESS environment variable not set.");
  process.exit(1);
}

// Optional block range overrides (both must be provided to override)
const START_BLOCK_ENV = process.env.START_BLOCK;
const END_BLOCK_ENV = process.env.END_BLOCK;

// Minimal ABI containing only the AgentRegistered event
const ABI = [
  "event AgentRegistered(address indexed agent, uint256 timestamp)"
];
const iface = new ethers.Interface(ABI);

/**
 * Determine a block range that roughly covers the previous week.
 * This function walks backwards from the latest block until it finds a block
 * whose timestamp is older than one week. It then refines the start block.
 * The indexer is read‑only and never writes to the chain.
 */
async function determineBlockRange(provider) {
  const latestBlock = await provider.getBlockNumber();
  const latestBlockInfo = await provider.getBlock(latestBlock);
  const latestTimestamp = latestBlockInfo.timestamp;

  const oneWeek = 7 * 24 * 60 * 60; // seconds
  const targetTimestamp = latestTimestamp - oneWeek;

  // Step back in chunks (≈2000 blocks ≈ 5 minutes per block on mainnet)
  let startBlock = latestBlock;
  while (startBlock > 0) {
    const blockInfo = await provider.getBlock(startBlock);
    if (blockInfo.timestamp <= targetTimestamp) break;
    startBlock = Math.max(0, startBlock - 2000);
  }
  // Fine‑tune forward until we cross the target timestamp
  while (true) {
    const blockInfo = await provider.getBlock(startBlock);
    if (blockInfo.timestamp >= targetTimestamp) break;
    startBlock++;
  }
  return { startBlock, endBlock: latestBlock };
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  let startBlock, endBlock;
  if (START_BLOCK_ENV && END_BLOCK_ENV) {
    startBlock = parseInt(START_BLOCK_ENV, 10);
    endBlock = parseInt(END_BLOCK_ENV, 10);
  } else {
    const range = await determineBlockRange(provider);
    startBlock = range.startBlock;
    endBlock = range.endBlock;
  }

  console.log(`Scanning blocks ${startBlock} → ${endBlock} for AgentRegistered events...`);

  const filter = {
    address: CONTRACT_ADDRESS,
    fromBlock: startBlock,
    toBlock: endBlock,
    topics: [iface.getEventTopic("AgentRegistered")]
  };

  let logs;
  try {
    logs = await provider.getLogs(filter);
  } catch (err) {
    console.error("Failed to fetch logs:", err);
    process.exit(1);
  }

  const events = logs.map((log) => {
    const parsed = iface.parseLog(log);
    return {
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      agent: parsed.args.agent,
      timestamp: parsed.args.timestamp.toString()
    };
  });

  const snapshot = {
    scannedRange: { startBlock, endBlock },
    totalEvents: events.length,
    events
  };

  await writeFile("snapshot.json", JSON.stringify(snapshot, null, 2));
  console.log(`Snapshot written to snapshot.json (${events.length} events).`);
}

// The indexer is read‑only: it never sends transactions, holds private keys, or writes to the chain.
main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});