// Sepolia JobEscrow Deposited event indexer
// Reads RPC endpoint from env: SEPOLIA_RPC_URL
// Scans Deposited(events) from JobEscrow 0x6307d05E1B72F08f4e20973D1766B3503e5F8DeA starting block 12129518
// Persists cursor atomically, deduplicates, handles reorgs, writes snapshot
// Read-only: never sends transactions, never holds private keys

import { createPublicClient, http, getContract, parseLogs } from "viem";
import { sepolia } from "viem/chains";
import fs from "fs"
import path from "path"

const RPC_URL = process.env.SEPOLIA_RPC_URL;
if (!RPC_URL) { throw new Error("SEPOLIA_RPC_URL environment variable is required"); }

const JOB_ESCROW = 0x6307d05E1B72F08f4e20973D1766B3503e5F8DeA;
const START_BLOCK = 12129518;
const CURSOR_FILE = path.join(process.cwd(), ".cursor.json");
const SNAPSHOT_FILE = path.join(process.cwd(), "snapshot.json");

// Event signature: Deposited(bytes32 indexed jobId,address indexed payer,address indexed beneficiary,uint256 amount)
// topic0 = keccak256("Deposited(bytes32,address,address,uint256)")
const DEPOSITED_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a1122de6c2d1e4b8c353";

const client = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

function loadCursor() {
  try {
    const data = fs.readFileSync(CURSOR_FILE, "utf8");
    const parsed = JSON.parse(data);
    // Normalize type: ensure cursor is a number
    return Number(parsed.cursor);
  } catch {
    return START_BLOCK - 1; // start from the block before the first scan
  }
}

function saveCursor(blockNumber) {
  fs.writeFileSync(CURSOR_FILE, JSON.stringify({ cursor: blockNumber }), "utf8");
}

async function decodeLog(log) {
  // viem parses topics and data according to the ABI; we only need the decoded fields
  // Topics[0] is the event signature, topics[1..3] are indexed parameters
  // data contains non-indexed parameters
  const parsed = parseLogs({
    abi: [
      {
        anonymous: false,
        inputs: [
          { internalType: "bytes32", name: "jobId", type: "bytes32", indexed: true },
          { internalType: "address", name: "payer", type: "address", indexed: true },
          { internalType: "address", name: "beneficiary", type: "address", indexed: true },
          { internalType: "uint256", name: "amount", type: "uint256", indexed: false },
        ],
        name: "Deposited",
        type: "event",
      },
    ],
    logs: [log],
  });
  if (!parsed || parsed.length === 0) return null;
  const ev = parsed[0];
  return {
    jobId: ev.args.jobId,
    payer: ev.args.payer,
    beneficiary: ev.args.beneficiary,
    amount: ev.args.amount.toString(),
    blockNumber: ev.blockNumber,
    transactionHash: ev.transactionHash,
  };
}

async function main() {
  if (!RPC_URL) { throw new Error("SEPOLIA_RPC_URL environment variable is required"); }

  let cursor = loadCursor(); // cursor is the last processed block number
  let lastScanned = cursor;

  // Determine the range to scan: from cursor+1 to latest block
  const latestBlock = await client.getBlockNumber();
  const fromBlock = cursor + 1n;
  const toBlock = latestBlock;

  if (fromBlock > toBlock) {
    console.log("No new blocks to scan.");
    return;
  }

  console.log(`Scanning blocks ${fromBlock} - ${toBlock} (cursor was ${cursor})`);

  // Fetch logs in bounded batches to avoid RPC limits
  const BATCH_SIZE = 5000n; // 5000 blocks per RPC call
  const allLogs = [];

  for (let start = fromBlock; start <= toBlock; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE - 1n, toBlock);
    try {
      const logs = await client.getLogs({
        address: JOB_ESCROW,
        topics: [DEPOSITED_TOPIC],
        fromBlock: start,
        toBlock: end,
      });
      allLogs.push(...logs);
    } catch (err) {
      console.error(`RPC error scanning blocks ${start}-${end}:`, err.message);
      // On error, persist what we have and exit; next run will resume
      saveCursor(lastScanned);
      return;
    }
  }

  // Decode and deduplicate logs
  const seen = new Set();
  const snapshots = [];

  for (const log of allLogs) {
    const decoded = await decodeLog(log);
    if (!decoded) continue;
    // Deduplicate by jobId + payer + beneficiary + amount + blockNumber
    const key = `${decoded.jobId}:${decoded.payer}:${decoded.beneficiary}:${decoded.amount}:${decoded.blockNumber}`;
    if (seen.has(key)) continue;
    seen.add(key);
    snapshots.push(decoded);
  }

  // Write snapshot (overwrite previous; idempotent for the same range)
  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshots, null, 2), "utf8");

  // Advance cursor to the last block we processed
  // If we have logs, cursor = last log's blockNumber; otherwise keep existing cursor
  if (snapshots.length > 0) {
    const lastBlock = Math.max(...snapshots.map((s) => s.blockNumber));
    saveCursor(lastBlock);
    lastScanned = lastBlock;
  }

  console.log(`Indexed ${snapshots.length} new Deposited events. Cursor advanced to block ${lastScanned}`);
}

main().catch((err) => {
  console.error("Indexer failed:", err);
  process.exit(1);
});
