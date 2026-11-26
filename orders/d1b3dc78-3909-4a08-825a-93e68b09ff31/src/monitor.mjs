import { pathToFileURL } from "node:url";
import { createServer } from 'node:http';

const FEED_ADDRESS = '0x694AA1769357215DE4FAC081bf1f309aDC325306';
const LATEST_ROUND_DATA_SELECTOR = '0xfeaf968c';
const DECIMALS = 8;
const DEFAULT_INTERVAL_MS = 60_000;
const DEFAULT_STALE_AFTER_SECONDS = 3900;
const DEFAULT_JUMP_PERCENT = 2;
const DEFAULT_ERROR_THRESHOLD = 3;

function loadConfig() {
  const raw = process.env.SEPOLIA_RPC_URL;
  if (!raw) {
    throw new Error('Configuration error: SEPOLIA_RPC_URL is not set');
  }
  let endpoint;
  try {
    endpoint = new URL(raw);
  } catch {
    throw new Error('Configuration error: SEPOLIA_RPC_URL is not a valid URL');
  }
  if (endpoint.protocol !== 'http:' && endpoint.protocol !== 'https:') {
    throw new Error('Configuration error: SEPOLIA_RPC_URL must use http or https');
  }

  const intervalMs = parseEnvMs(process.env.MONITOR_INTERVAL_MS, DEFAULT_INTERVAL_MS);
  const staleAfterSeconds = parseEnvInt(process.env.STALE_AFTER_SECONDS, DEFAULT_STALE_AFTER_SECONDS);
  const jumpPercent = parseEnvFloat(process.env.JUMP_PERCENT, DEFAULT_JUMP_PERCENT);
  const errorThreshold = parseEnvInt(process.env.ERROR_THRESHOLD, DEFAULT_ERROR_THRESHOLD);

  return { endpoint, intervalMs, staleAfterSeconds, jumpPercent, errorThreshold };
}

function parseEnvMs(value, fallback) {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function parseEnvInt(value, fallback) {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) return fallback;
  return parsed;
}

function parseEnvFloat(value, fallback) {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function toHex(value) {
  return '0x' + value.toString(16);
}

function encodeEthCall(to, data) {
  return JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [
      {
        to,
        data: LATEST_ROUND_DATA_SELECTOR
      },
      'latest'
    ],
    id: 1
  });
}

function decodeLatestRoundData(resultHex) {
  if (!resultHex || !resultHex.startsWith('0x')) {
    throw new Error('Invalid eth_call result');
  }
  const data = resultHex.slice(2);
  if (data.length < 32 * 5) {
    throw new Error('eth_call result too short for latestRoundData');
  }

  const roundId = BigInt('0x' + data.slice(0, 64));
  const answer = BigInt('0x' + data.slice(64, 128));
  const startedAt = BigInt('0x' + data.slice(128, 192));
  const updatedAt = BigInt('0x' + data.slice(192, 256));
  const answeredInRound = BigInt('0x' + data.slice(256, 320));

  return { roundId, answer, startedAt, updatedAt, answeredInRound };
}

function priceDecimalString(answer, decimals = DECIMALS) {
  const divisor = 10n ** BigInt(decimals);
  const whole = answer / divisor;
  const fraction = answer % divisor;
  const fractionStr = fraction.toString().padStart(decimals, '0').slice(0, 2);
  return `${whole}.${fractionStr}`;
}

async function fetchRoundData(endpoint) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(endpoint.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: encodeEthCall(FEED_ADDRESS, LATEST_ROUND_DATA_SELECTOR),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`RPC HTTP ${response.status}`);
    }

    const json = await response.json();
    if (json.error) {
      throw new Error(`RPC error: ${json.error.message ?? JSON.stringify(json.error)}`);
    }
    if (!json.result) {
      throw new Error('RPC response missing result');
    }

    return decodeLatestRoundData(json.result);
  } finally {
    clearTimeout(timeout);
  }
}

function buildReading(status, price, updatedAt, ageSeconds) {
  return {
    time: new Date().toISOString(),
    status,
    price,
    updatedAt: updatedAt.toString(),
    ageSeconds
  };
}

export class PriceMonitor {
  constructor({ endpoint, intervalMs, staleAfterSeconds, jumpPercent, errorThreshold } = {}) {
    const config = loadConfig();
    this.endpoint = endpoint ?? config.endpoint;
    this.intervalMs = intervalMs ?? config.intervalMs;
    this.staleAfterSeconds = staleAfterSeconds ?? config.staleAfterSeconds;
    this.jumpPercent = jumpPercent ?? config.jumpPercent;
    this.errorThreshold = errorThreshold ?? config.errorThreshold;

    this.previousAnswer = null;
    this.consecutiveErrors = 0;
    this.timer = null;
    this.running = false;
  }

  statusSummary() {
    return {
      intervalSeconds: this.intervalMs / 1000,
      staleAfterSeconds: this.staleAfterSeconds,
      jumpPercent: this.jumpPercent,
      errorThreshold: this.errorThreshold
    };
  }

  async checkOnce() {
    let round;
    try {
      round = await fetchRoundData(this.endpoint);
    } catch (error) {
      this.consecutiveErrors += 1;
      const reading = buildReading('ERROR', null, BigInt(0), null);
      console.log(JSON.stringify(reading));
      if (this.consecutiveErrors >= this.errorThreshold) {
        console.error(JSON.stringify({
          time: new Date().toISOString(),
          status: 'ERROR',
          reason: 'consecutive failures reached threshold',
          consecutiveErrors: this.consecutiveErrors
        }));
      }
      return reading;
    }

    this.consecutiveErrors = 0;
    const nowSeconds = Math.floor(Date.now() / 1000);
    const ageSeconds = Number(nowSeconds) - Number(round.updatedAt);
    const price = priceDecimalString(round.answer);

    let status = 'OK';
    if (ageSeconds > this.staleAfterSeconds) {
      status = 'STALE';
    } else if (this.previousAnswer !== null) {
      const previous = this.previousAnswer;
      const current = round.answer;
      const absDiff = current > previous ? current - previous : previous - current;
      const threshold = (previous * BigInt(this.jumpPercent * 100)) / 100n;
      if (absDiff > threshold) {
        status = 'JUMP';
      }
    }

    this.previousAnswer = round.answer;
    const reading = buildReading(status, price, round.updatedAt, ageSeconds);
    console.log(JSON.stringify(reading));
    return reading;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.timer = setInterval(() => {
      void this.checkOnce();
    }, this.intervalMs);
  }

  stop() {
    this.running = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

async function main() {
  const config = loadConfig();
  const monitor = new PriceMonitor(config);

  const shutdown = async () => {
    monitor.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await monitor.checkOnce();
  monitor.start();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(JSON.stringify({
      time: new Date().toISOString(),
      status: 'ERROR',
      reason: error.message
    }));
    process.exit(1);
  });
}