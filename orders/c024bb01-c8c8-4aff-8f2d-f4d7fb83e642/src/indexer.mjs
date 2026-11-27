import { createPublicClient, parseEventLogs, parseAbiItem, http } from "viem";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const POOL = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
const SUPPLY_SIG = "event Supply(address indexed reserve, address user, address indexed onBehalfOf, uint256 amount, uint16 indexed referralCode)";
const WITHDRAW_SIG = "event Withdraw(address indexed reserve, address indexed user, address indexed to, uint256 amount)";

function parseArgs(argv) {
  const from = BigInt(argv[2] || "0");
  const to = BigInt(argv[3] || "0");
  if (isNaN(from) || isNaN(to) || from > to) {
    console.error("Usage: node src/indexer.mjs --from <fromBlock> --to <toBlock>");
    process.exit(2);
  }
  return { from, to };
}

function signatures() {
  return [
    { name: "Supply", sig: SUPPLY_SIG },
    { name: "Withdraw", sig: WITHDRAW_SIG }
  ];
}

async function loadCursor() {
  try {
    const data = await readFile("out/summary.json", "utf8");
    const obj = JSON.parse(data);
    return { nextBlock: BigInt(obj.nextBlock), records: obj.records || [] };
  } catch {
    return { nextBlock: BigInt(0), records: [] };
  }
}

async function persistCursor(cursor) {
  await mkdir("out", { recursive: true });
  await writeFile("out/summary.json", JSON.stringify(cursor, null, 2));
}

async function scanChunk(client, from, to, signatures) {
  const logs = await client.getLogs({
    address: POOL,
    fromBlock: from,
    toBlock: to,
    topicFilters: signatures.map(s => ({ name: s.name, signature: s.sig }))
  });
  if (logs.length === 0) return [];
  return parseEventLogs({
    abi: signatures.map(s => parseAbiItem(s.sig)),
    data: [],
    topics: logs.map(l => l.topics),
    strict: true
  });
}

async function main() {
  const { from, to } = parseArgs(process.argv);
  const endpoint = process.env.SEPOLIA_RPC_URL;
  if (!endpoint) {
    console.error("SEPOLIA_RPC_URL not set");
    process.exit(1);
  }

  const client = createPublicClient({ transport: http(endpoint) });
  const sigs = signatures();
  let cursor = await loadCursor();

  // Align cursor to from if needed
  let scanFrom = cursor.nextBlock < from ? from : cursor.nextBlock;
  if (scanFrom > to) {
    console.log("No new blocks to scan.");
    persistCursor({ nextBlock: to, records: cursor.records });
    process.exit(0);
  }

  const records = [...cursor.records];
  let current = scanFrom;

  while (current <= to) {
    const chunkTo = Math.min(current + BigInt(999), to);
    let attempts = 0;
    let ok = false;
    let decoded = [];

    while (attempts < 3 && !ok) {
      try {
        decoded = await scanChunk(client, current, chunkTo, sigs);
        ok = true;
      } catch (e) {
        attempts++;
        if (attempts >= 3) throw e;
        await new Promise(r => setTimeout(r, 500 * attempts));
      }
    }

    for (const log of decoded) {
      const reserve = log.args.reserve;
      const user = log.args.user;
      const amount = BigInt(log.args.amount);
      if (log.name === "Supply") {
        records.push({ type: "supply", reserve, user, amount, block: log.blockNumber });
      } else if (log.name === "Withdraw") {
        records.push({ type: "withdraw", reserve, user, amount, block: log.blockNumber });
      }
    }

    current = chunkTo + BigInt(1);
  }

  cursor.nextBlock = current;
  // Build reserve summary
  const reserveMap = new Map();
  for (const r of records) {
    if (!reserveMap.has(r.reserve)) reserveMap.set(r.reserve, { reserve: r.reserve, supplied: BigInt(0), withdrawn: BigInt(0), users: new Set() });
    const res = reserveMap.get(r.reserve);
    if (r.type === "supply") {
      res.users.add(r.user);
      res.supplied = BigInt(res.supplied) + amount;
    } else {
      res.withdrawn = BigInt(res.withdrawn) + amount;
      res.users.add(r.user);
    }
  }
  // Convert to output format
  const outReserves = [];
  for (const [, res] of reserveMap) {
    const users = Array.from(res.users).length;
    outReserves.push({
      reserve: res.reserve,
      supplied: res.supplied.toString(),
      withdrawn: res.withdrawn.toString(),
      net: (res.supplied - res.withdrawn).toString(),
      uniqueUsers: users
    });
  }
  outReserves.sort((a, b) => {
    if (b.uniqueUsers !== a.uniqueUsers) return b.uniqueUsers - a.uniqueUsers;
    return BigInt(a.reserve) > BigInt(b.reserve) ? 1 : -1;
  });

  const summary = {
    fromBlock: Number(from),
    toBlock: Number(to),
    supplies: records.filter(r => r.type === "supply").length,
    withdrawals: records.filter(r => r.type === "withdraw").length,
    reserves: outReserves
  };

  cursor.records = records;
  await persistCursor(cursor);
  await writeFile("out/summary.json", JSON.stringify(summary, null, 2));
  console.log("Scan complete.");
}

main().catch(e => { console.error(e); process.exit(1); });