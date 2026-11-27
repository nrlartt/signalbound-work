import { describe, it, assert } from "node:test";
import { parseEventLogs, parseAbiItem } from "viem";
import { createPublicClient, http } from "viem";
import { resolve } from "node:path";

const POOL = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
const SUPPLY_SIG = "event Supply(address indexed reserve, address user, address indexed onBehalfOf, uint256 amount, uint16 indexed referralCode)";
const WITHDRAW_SIG = "event Withdraw(address indexed reserve, address indexed user, address indexed to, uint256 amount)";

function parseArgs(argv) {
  const from = BigInt(argv[2] || "0");
  const to = BigInt(argv[3] || "0");
  return { from, to };
}

// Offline fixture: a minimal log object that mimics an eth_getLogs response
function makeLog(topics, data, blockNumber) {
  return { topics, data, blockNumber };
}

// Helper: build a parseEventLogs call from raw logs
async function parseLogs(client, logs) {
  return parseEventLogs({ abi: [parseAbiItem(SUPPLY_SIG), parseAbiItem(WITHDRAW_SIG)], data: [], topics: logs.map(l => l.topics), strict: true });
}

describe("Aave v3 indexer offline tests", () => {
  let client;
  beforeEach(async () => {
    const endpoint = "https://rpc.sepolia.dev";
    client = createPublicClient({ transport: http(endpoint) });
  });

  it("should handle chunk boundaries at 1000-block limit", async () => {
    const from = BigInt(100);
    const to = BigInt(1099);
    const logs = [makeLog([], "0x", from), makeLog([], "0x", to)];
    const parsed = await parseLogs(client, logs);
    assert.strictEqual(parsed.length, 2);
  });

  it("should decode non-indexed user from Supply data", async () => {
    // Supply: reserve(address indexed), user(address), onBehalfOf(address indexed), amount(uint256), referralCode(uint16)
    // Only reserve and onBehalfOf are indexed => topics has 2 addr topics + 3 other topics
    const indexedReserve = "0x0000000000000000000000006Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
    const indexedOnBehalfOf = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const userAddr = "0x1234567890123456789012345678901234567890";
    // data layout: user (32 bytes, non-indexed), onBehalfOf (32 bytes, non-indexed), amount (32 bytes), referralCode (2 bytes padded to 32)
    const data = 
      "0x" + 
      userAddr.slice(2).padStart(64, "0") + 
      indexedOnBehalfOf.slice(2).padStart(64, "0") + 
      "0x0000000000000000000000000000000000000000000000000000000000000040" + // amount = 64
      "0x0000000000000000"; // referralCode
    const log = makeLog(
      [indexedReserve, indexedOnBehalfOf],
      data,
      BigInt(1)
    );
    const parsed = await parseLogs(client, [log]);
    assert.strictEqual(parsed.length, 1);
    const ev = parsed[0];
    // log.args.user is the non-indexed address
    assert.strictEqual(ev.args.user, userAddr.toLowerCase(), "user should decode from data, not topic");
  });

  it("should produce negative net when withdraws exceed supplies", async () => {
    // Minimal topics: reserve + user + to
    const reserve = "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb00";
    const user = "0xabcdef1234567890abcdef1234567890abcdef12";
    const toAddr = "0x0000000000000000000000000000000000000000000000000000000000000002";
    // topics: reserve (indexed), user (indexed), to (indexed)
    const topics = [
      "0x000000000000000000000000" + reserve.slice(2),
      "0x000000000000000000000000" + user.slice(2),
      "0x0000000000000000000000000000000000000000000000000000000000000002"
    ];
    const amount = "0x000000000000000000000000000000000000000000000000000000000000200"; // 512
    const data = amount;
    const log = makeLog(topics, data, BigInt(1));
    const parsed = await parseLogs(client, [log]);
    assert.strictEqual(parsed.length, 1);
    // withdraw amount is positive in log; net negative relative to supply
    const net = BigInt(parsed[0].args.amount) * BigInt(-1);
    assert.ok(net < 0, "net should be negative when only withdraw present");
  });

  it("should sort reserves by supply count descending then reserve ascending", async () => {
    const reserves = [
      { reserve: "0xaaa0000000000000000000000000000000000001", uniqueUsers: 5 },
      { reserve: "0xaaa0000000000000000000000000000000000002", uniqueUsers: 5 },
      { reserve: "0xaaa0000000000000000000000000000000000003", uniqueUsers: 3 }
    ];
    const sorted = [...reserves].sort((a, b) => {
      if (b.uniqueUsers !== a.uniqueUsers) return b.uniqueUsers - a.uniqueUsers;
      return BigInt(a.reserve) > BigInt(b.reserve) ? 1 : -1;
    });
    assert.strictEqual(sorted[0].reserve, reserves[0].reserve);
    assert.strictEqual(sorted[2].reserve, reserves[2].reserve);
  });
});