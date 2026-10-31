import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

const CONFIG_PATH = process.env.MONITOR_CONFIG_PATH || './config.example.json';

function loadConfig() {
  let raw;
  try {
    raw = readFileSync(CONFIG_PATH, 'utf8');
  } catch (err) {
    throw new Error(`Unable to read configuration from ${CONFIG_PATH}: ${err.message}`);
  }
  let config;
  try {
    config = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON in ${CONFIG_PATH}: ${err.message}`);
  }

  const endpoint = config.endpoint || process.env.MONITOR_ENDPOINT;
  if (!endpoint) {
    throw new Error('No monitoring endpoint configured. Set endpoint in config or MONITOR_ENDPOINT environment variable.');
  }

  const intervalMs = Number(config.checkIntervalMs || process.env.MONITOR_INTERVAL_MS || 10000);
  const badReadsToAlarm = Number(config.badReadsToAlarm || process.env.MONITOR_BAD_READS_TO_ALARM || 3);
  const alarmCooldownMs = Number(config.alarmCooldownMs || process.env.MONITOR_ALARM_COOLDOWN_MS || 300000);
  const maxBalanceRatio = Number(config.maxBalanceRatio || process.env.MONITOR_MAX_BALANCE_RATIO || 1);

  if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
    throw new Error('checkIntervalMs must be a positive number.');
  }
  if (!Number.isFinite(badReadsToAlarm) || badReadsToAlarm < 1 || !Number.isInteger(badReadsToAlarm)) {
    throw new Error('badReadsToAlarm must be a positive integer.');
  }
  if (!Number.isFinite(alarmCooldownMs) || alarmCooldownMs < 0) {
    throw new Error('alarmCooldownMs must be a non-negative number.');
  }
  if (!Number.isFinite(maxBalanceRatio) || maxBalanceRatio <= 0) {
    throw new Error('maxBalanceRatio must be a positive number.');
  }

  return {
    endpoint,
    intervalMs,
    badReadsToAlarm,
    alarmCooldownMs,
    maxBalanceRatio,
  };
}

function statePath() {
  return process.env.MONITOR_STATE_PATH || './monitor-state.json';
}

function loadState() {
  try {
    const raw = readFileSync(statePath(), 'utf8');
    const parsed = JSON.parse(raw);
    return {
      consecutiveBadReads: Number(parsed.consecutiveBadReads) || 0,
      lastAlarmAt: Number(parsed.lastAlarmAt) || 0,
    };
  } catch {
    return { consecutiveBadReads: 0, lastAlarmAt: 0 };
  }
}

function saveState(state) {
  try {
    const dir = statePath().split('/').slice(0, -1).join('/');
    if (dir && dir !== '.') {
      import('node:fs').then(({ mkdirSync }) => mkdirSync(dir, { recursive: true }));
    }
    const fs = await import('node:fs');
    fs.writeFileSync(statePath(), JSON.stringify(state, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to persist monitor state', error: err.message, timestamp: new Date().toISOString() }));
  }
}

function fetchJson(url) {
  return fetch(url).then(async (res) => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return res.json();
  });
}

function evaluateReading(reading, config) {
  const problems = [];
  const now = Date.now();

  if (reading === null || reading === undefined) {
    problems.push({ type: 'missing_reading', message: 'Endpoint returned no reading.', timestamp: now });
    return { ok: false, problems };
  }

  if (typeof reading.totalDeposits !== 'bigint' && typeof reading.totalDeposits !== 'number') {
    problems.push({ type: 'invalid_total_deposits', message: 'totalDeposits is missing or not a number.', timestamp: now });
  }
  if (typeof reading.sumUserBalances !== 'bigint' && typeof reading.sumUserBalances !== 'number') {
    problems.push({ type: 'invalid_sum_user_balances', message: 'sumUserBalances is missing or not a number.', timestamp: now });
  }
  if (problems.length > 0) {
    return { ok: false, problems };
  }

  const totalDeposits = BigInt(reading.totalDeposits);
  const sumUserBalances = BigInt(reading.sumUserBalances);

  if (totalDeposits < 0n) {
    problems.push({ type: 'negative_total_deposits', message: 'totalDeposits is negative.', evidence: { totalDeposits: totalDeposits.toString() }, timestamp: now });
  }
  if (sumUserBalances < 0n) {
    problems.push({ type: 'negative_sum_user_balances', message: 'sumUserBalances is negative.', evidence: { sumUserBalances: sumUserBalances.toString() }, timestamp: now });
  }
  if (sumUserBalances > totalDeposits) {
    problems.push({
      type: 'balance_exceeds_deposits',
      message: 'Core invariant violated: sum of user balances exceeds total recognized deposits.',
      evidence: { totalDeposits: totalDeposits.toString(), sumUserBalances: sumUserBalances.toString(), excess: (sumUserBalances - totalDeposits).toString() },
      timestamp: now,
    });
  }

  return { ok: problems.length === 0, problems };
}

function alarm(config, problems, state) {
  const now = Date.now();
  const payload = {
    level: 'alarm',
    monitor: 'vault-monitor',
    endpoint: config.endpoint,
    checkedAt: new Date(now).toISOString(),
    consecutiveBadReads: state.consecutiveBadReads,
    badReadsToAlarm: config.badReadsToAlarm,
    cooldownMs: config.alarmCooldownMs,
    problems,
  };
  console.log(JSON.stringify(payload));
  return { ...state, lastAlarmAt: now };
}

async function checkOnce(config, state) {
  const now = Date.now();
  let reading;
  let fetchError = null;

  try {
    reading = await fetchJson(config.endpoint);
  } catch (err) {
    fetchError = err;
  }

  const result = fetchError
    ? { ok: false, problems: [{ type: 'fetch_error', message: fetchError.message, evidence: { endpoint: config.endpoint }, timestamp: now }] }
    : evaluateReading(reading, config);

  const nextState = { ...state };

  if (result.ok) {
    if (state.consecutiveBadReads > 0) {
      console.log(JSON.stringify({
        level: 'recovery',
        monitor: 'vault-monitor',
        endpoint: config.endpoint,
        recoveredAt: new Date(now).toISOString(),
        previousConsecutiveBadReads: state.consecutiveBadReads,
      }));
    }
    nextState.consecutiveBadReads = 0;
  } else {
    nextState.consecutiveBadReads = state.consecutiveBadReads + 1;
    const shouldAlarm = nextState.consecutiveBadReads >= config.badReadsToAlarm;
    const inCooldown = now - state.lastAlarmAt < config.alarmCooldownMs;

    if (shouldAlarm && !inCooldown) {
      return alarm(config, result.problems, nextState);
    }

    if (shouldAlarm && inCooldown) {
      console.log(JSON.stringify({
        level: 'alarm_suppressed',
        monitor: 'vault-monitor',
        endpoint: config.endpoint,
        consecutiveBadReads: nextState.consecutiveBadReads,
        badReadsToAlarm: config.badReadsToAlarm,
        cooldownRemainingMs: config.alarmCooldownMs - (now - state.lastAlarmAt),
        problems: result.problems,
        timestamp: new Date(now).toISOString(),
      }));
    }
  }

  saveState(nextState);
  return nextState;
}

async function run() {
  const config = loadConfig();
  let state = loadState();

  console.log(JSON.stringify({
    level: 'info',
    monitor: 'vault-monitor',
    message: 'Monitor started.',
    endpoint: config.endpoint,
    checkIntervalMs: config.intervalMs,
    badReadsToAlarm: config.badReadsToAlarm,
    alarmCooldownMs: config.alarmCooldownMs,
    maxBalanceRatio: config.maxBalanceRatio,
    timestamp: new Date().toISOString(),
  }));

  state = await checkOnce(config, state);

  setInterval(async () => {
    state = await checkOnce(config, state);
  }, config.intervalMs);
}

run().catch((err) => {
  console.error(JSON.stringify({ level: 'fatal', monitor: 'vault-monitor', message: err.message, timestamp: new Date().toISOString() }));
  process.exit(1);
});