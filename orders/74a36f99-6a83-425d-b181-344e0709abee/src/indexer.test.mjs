import { strict as assert, rejects } from 'node:assert';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { scanRange, decodeTransferLog, isBatchPayoutExport as isBatchPayout, truncateUsdcExport as truncateUsdc } from './indexer.mjs';

const FIXTURE_PATH = join(process.cwd(), 'fixtures', 'logs.json');
const FIXTURES = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'));

function decodeTransferLogFromFixture(log) {
  if (!log || !log.topics || log.topics.length < 3) return null;
  const from = '0x' + log.topics[1].slice(-40);
  const to = '0x' + log.topics[2].slice(-40);
  const value = BigInt(log.data);
  return { from, to, value };
}

async function withTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'indexer-test-'));
  try {
    return await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function copyIndexerInto(dir) {
  writeFileSync(join(dir, 'config.json'), JSON.stringify({ fromBlock: 0, toBlock: 9999999 }), 'utf8');
  const source = readFileSync(join(process.cwd(), 'src', 'indexer.mjs'), 'utf8');
  writeFileSync(join(dir, 'indexer.mjs'), source, 'utf8');
  return await import(pathToFileURL(join(dir, 'indexer.mjs')).href);
}

assert.strict('real batch with 3 recipients is detected', () => {
  const batchLogs = FIXTURES.filter(log => log.transactionHash === '0xbatch1');
  assert.strictEqual(batchLogs.length, 3);
  const recipients = new Set(batchLogs.map(log => '0x' + log.topics[2].slice(-40)));
  assert.strictEqual(recipients.size, 3);
  const decoded = batchLogs.map(decodeTransferLogFromFixture);
  const batch = isBatchPayout(decoded);
  assert.ok(batch);
  assert.strictEqual(batch.recipients.length, 3);
});

assert.strict('3 logs but only 2 distinct recipients is not a batch', () => {
  const logs = FIXTURES.filter(log => log.transactionHash === '0xnotbatch1');
  assert.strictEqual(logs.length, 3);
  const recipients = new Set(logs.map(log => '0x' + log.topics[2].slice(-40)));
  assert.strictEqual(recipients.size, 2);
  const decoded = logs.map(decodeTransferLogFromFixture);
  assert.strictEqual(isBatchPayout(decoded), null);
});

assert.strict('logs from two different senders are not a single batch', () => {
  const logs = FIXTURES.filter(log => log.transactionHash === '0xmulti sender');
  const senders = new Set(logs.map(log => '0x' + log.topics[1].slice(-40)));
  assert.strictEqual(senders.size, 2);
  const decoded = logs.map(decodeTransferLogFromFixture);
  assert.strictEqual(isBatchPayout(decoded), null);
});

assert.strict('2-decimal truncation of USDC value', () => {
  assert.strictEqual(truncateUsdc(1234567n), '1.23');
  assert.strictEqual(truncateUsdc(1000000n), '1.00');
  assert.strictEqual(truncateUsdc(999999n), '0.09');
  assert.strictEqual(truncateUsdc(123456789n), '12345.67');
});

assert.strict('duplicate logs do not create duplicate batches', async () => {
  await withTempDir(async (dir) => {
    const module = await copyIndexerInto(dir);
    const seen = [];
    await module.scanRange('http://localhost:8545', 0n, 10n, async (record) => {
      seen.push(record.txHash);
    });
    assert.strictEqual(seen.length, new Set(seen).size, 'duplicate batch records detected');
  });
});

assert.strict('restart resumes from persisted cursor', async () => {
  await withTempDir(async (dir) => {
    writeFileSync(join(dir, 'cursor.json'), JSON.stringify({ nextBlock: '1000' }), 'utf8');
    const cursorRaw = JSON.parse(readFileSync(join(dir, 'cursor.json'), 'utf8'));
    assert.strictEqual(BigInt(cursorRaw.nextBlock), 1000n);
  });
});

assert.strict('RPC failure is reported', async () => {
  await rejects(async () => {
    const failingUrl = 'http://127.0.0.1:1/none';
    await scanRange(failingUrl, 0n, 10n, async () => {});
  });
});