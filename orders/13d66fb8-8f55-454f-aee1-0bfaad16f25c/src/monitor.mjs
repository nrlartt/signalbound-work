import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import fetch from 'node-fetch';

const CONFIG_PATH = process.env.MONITOR_CONFIG_PATH || './config.json';

function loadConfig() {
  let raw;
  try {
    raw = readFileSync(CONFIG_PATH, 'utf8');
  } catch (err) {
    throw new Error(`Unable to read configuration from ${CONFIG_PATH}: ${err.message}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Configuration at ${CONFIG_PATH} is not valid JSON: ${err.message}`);
  }
  return parsed;
}

function resolveEndpoint(config) {
  const envEndpoint = process.env.MONITOR_ENDPOINT;
  const configEndpoint = config.endpoint;
  if (envEndpoint && configEndpoint && envEndpoint !== configEndpoint) {
    throw new Error('MONITOR_ENDPOINT and config.endpoint disagree; refusing to start.');
  }
  const endpoint = envEndpoint || configEndpoint;
  if (!endpoint || typeof endpoint !== 'string') {
    throw new Error('No endpoint configured. Set MONITOR_ENDPOINT or config.endpoint.');
  }
  try {
    new URL(endpoint);
  } catch (err) {
    throw new Error(`Configured endpoint is not a valid URL: ${endpoint}`);
  }
  return endpoint;
}

function resolveThresholds(config) {
  const envInterval = process.env.MONITOR_CHECK_INTERVAL_MS;
  const envConsecutive = process.env.MONITOR_CONSECUTIVE_BAD_READS;
  const envCooldown = process.env.MONITOR_ALARM_COOLDOWN_MS;

  const checkIntervalMs = Number.parseInt(envInterval ?? String(config.checkIntervalMs ?? 30000), 10);
  const consecutiveBadReads = Number.parseInt(envConsecutive ?? String(config.consecutiveBadReads ?? 3), 10);
  const alarmCooldownMs = Number.parseInt(envCooldown ?? String(config.alarmCooldownMs ?? 300000), 10);

  if (!Number.isFinite(checkIntervalMs) || checkIntervalMs <= 0) {
    throw new Error('checkIntervalMs must be a positive number.');
  }
  if (!Number.isFinite(consecutiveBadReads) || consecutiveBadReads < 1) {
    throw new Error('consecutiveBadReads must be at least 1.');
  }
  if (!Number.isFinite(alarmCooldownMs) || alarmCooldownMs < 0) {
    throw new Error('alarmCooldownMs must be zero or greater.');
  }

  return { checkIntervalMs, consecutiveBadReads, alarmCooldownMs };
}

function resolvePriceThresholds(config) {
  const envMin = process.env.MONITOR_MIN_PRICE;
  const envMax = process.env.MONITOR_MAX_PRICE;

  const minPrice = envMin !== undefined ? Number.parseFloat(envMin) : config.minPrice;
  const maxPrice = envMax !== undefined ? Number.parseFloat(envMax) : config.maxPrice;

  if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) {
    throw new Error('minPrice must be a non-negative number.');
  }
  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
    throw new Error('maxPrice must be a non-negative number.');
  }
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw new Error('minPrice cannot be greater than maxPrice.');
  }

  return { minPrice, maxPrice };
}

function redact(value) {
  if (!value) return value;
  try {
    const url = new URL(value);
    url.password = '***redacted***';
    return url.toString();
  } catch {
    return value.replace(/[A-Za-z0-9_-]{8,}/g, '***redacted***');
  }
}

async function fetchJson(endpoint) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(endpoint, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function extractPrice(payload) {
  if (payload == null) throw new Error('Empty payload.');
  const candidates = [
    payload.price,
    payload.last,
    payload.last_price,
    payload.lastPrice,
    payload.ticker?.last,
    payload.ticker?.price,
    payload.data?.price,
    payload.data?.last,
    payload.bitcoin?.usd,
    payload.BTC?.usd,
  ];
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null) {
      const value = Number(candidate);
      if (Number.isFinite(value) && value > 0) return value;
    }
  }
  throw new Error('No readable price field found in payload.');
}

function formatMs(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

async function run() {
  const config = loadConfig();
  const endpoint = resolveEndpoint(config);
  const { checkIntervalMs, consecutiveBadReads, alarmCooldownMs } = resolveThresholds(config);
  const { minPrice, maxPrice } = resolvePriceThresholds(config);

  console.log(`Monitor starting.`);
  console.log(`Endpoint: ${redact(endpoint)}`);
  console.log(`Check interval: ${formatMs(checkIntervalMs)} (${checkIntervalMs}ms)`);
  console.log(`Consecutive bad reads to alarm: ${consecutiveBadReads}`);
  console.log(`Alarm cooldown: ${formatMs(alarmCooldownMs)} (${alarmCooldownMs}ms)`);
  console.log(`Price thresholds: min=${minPrice ?? 'unset'}, max=${maxPrice ?? 'unset'}`);
  console.log(`Read-only mode: no transactions will be sent, no keys are held.`);

  let consecutiveBad = 0;
  let lastAlarmAt = 0;
  let lastPrice = null;

  while (true) {
    const startedAt = Date.now();
    let bad = false;
    let reason = '';
    let price = null;

    try {
      const payload = await fetchJson(endpoint);
      price = extractPrice(payload);
      lastPrice = price;

      if (minPrice !== undefined && price < minPrice) {
        bad = true;
        reason = `price ${price} below minimum ${minPrice}`;
      }
      if (!bad && maxPrice !== undefined && price > maxPrice) {
        bad = true;
        reason = `price ${price} above maximum ${maxPrice}`;
      }
    } catch (err) {
      bad = true;
      reason = err.message;
    }

    if (bad) {
      consecutiveBad += 1;
      console.log(`Bad read #${consecutiveBad}: ${reason}`);
      if (consecutiveBad >= consecutiveBadReads) {
        const now = Date.now();
        if (now - lastAlarmAt >= alarmCooldownMs || lastAlarmAt === 0) {
          console.log(`ALARM: ${consecutiveBad} consecutive bad reads. Last reason: ${reason}. Last price: ${lastPrice ?? 'unknown'}. Endpoint: ${redact(endpoint)}`);
          lastAlarmAt = now;
        } else {
          console.log(`Alarm suppressed by cooldown (${formatMs(alarmCooldownMs - (now - lastAlarmAt))} remaining).`);
        }
      }
    } else {
      if (consecutiveBad > 0) {
        console.log(`Recovered after ${consecutiveBad} bad reads. Price: ${price}.`);
      }
      consecutiveBad = 0;
      console.log(`OK: price ${price}.`);
    }

    const elapsed = Date.now() - startedAt;
    const delay = Math.max(0, checkIntervalMs - elapsed);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

run().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});