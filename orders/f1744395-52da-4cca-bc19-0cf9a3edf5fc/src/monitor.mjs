import { createServer } from 'node:http';

const DEFAULT_CONFIG = {
  endpoint: process.env.MONITOR_ENDPOINT || '',
  intervalMs: Number(process.env.MONITOR_INTERVAL_MS || 60000),
  failureThreshold: Number(process.env.MONITOR_FAILURE_THRESHOLD || 3),
  timeoutMs: Number(process.env.MONITOR_TIMEOUT_MS || 10000),
  recoveryNotice: process.env.MONITOR_RECOVERY_NOTICE !== 'false',
  logLevel: process.env.MONITOR_LOG_LEVEL || 'info'
};

let config = { ...DEFAULT_CONFIG };
let consecutiveFailures = 0;
let wasHealthy = null;
let timer = null;
let running = false;

export function loadConfig(provided) {
  config = { ...DEFAULT_CONFIG, ...provided };
  if (!config.endpoint) {
    throw new Error('MONITOR_ENDPOINT or config.endpoint is required');
  }
  try {
    new URL(config.endpoint);
  } catch (err) {
    throw new Error(`Invalid endpoint URL: ${config.endpoint}`);
  }
  return config;
}

export function getConfig() {
  return { ...config };
}

export function getState() {
  return {
    consecutiveFailures,
    wasHealthy,
    running
  };
}

export function evaluateResult(ok, state = getState()) {
  const nextFailures = ok ? 0 : state.consecutiveFailures + 1;
  const shouldAlarm = !ok && nextFailures >= config.failureThreshold;
  const shouldRecover = ok && state.wasHealthy === false;
  return {
    ok,
    consecutiveFailures: nextFailures,
    shouldAlarm,
    shouldRecover,
    threshold: config.failureThreshold
  };
}

function log(level, message) {
  const levels = { error: 0, warn: 1, info: 2, debug: 3 };
  if (levels[config.logLevel] !== undefined && levels[level] <= levels[config.logLevel]) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  }
}

async function checkOnce() {
  const { endpoint, timeoutMs } = config;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      redirect: 'follow'
    });
    const ok = response.ok;
    await response.text();
    const decision = evaluateResult(ok, getState());
    consecutiveFailures = decision.consecutiveFailures;
    if (decision.shouldAlarm) {
      log('error', `ALERT: endpoint ${endpoint} unhealthy after ${decision.consecutiveFailures} consecutive failed reads (threshold ${decision.threshold})`);
    } else if (decision.shouldRecover && config.recoveryNotice) {
      log('info', `RECOVERY: endpoint ${endpoint} is healthy again`);
    } else if (ok) {
      log('info', `OK: endpoint ${endpoint} responded ${response.status}`);
    }
    wasHealthy = ok;
    return decision;
  } catch (err) {
    const decision = evaluateResult(false, getState());
    consecutiveFailures = decision.consecutiveFailures;
    if (decision.shouldAlarm) {
      log('error', `ALERT: endpoint ${endpoint} unreachable after ${decision.consecutiveFailures} consecutive failed reads (threshold ${decision.threshold}): ${err.message}`);
    } else {
      log('warn', `FAIL: endpoint ${endpoint} read failed (${decision.consecutiveFailures}/${decision.threshold}): ${err.message}`);
    }
    wasHealthy = false;
    return decision;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function check() {
  return checkOnce();
}

export function start() {
  if (running) return;
  running = true;
  log('info', `Monitor started: endpoint=${config.endpoint} interval=${config.intervalMs}ms failureThreshold=${config.failureThreshold} timeout=${config.timeoutMs}ms`);
  (function loop() {
    if (!running) return;
    checkOnce().then(() => {
      if (running) {
        timer = setTimeout(loop, config.intervalMs);
      }
    });
  })();
}

export function stop() {
  running = false;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  log('info', 'Monitor stopped');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    loadConfig();
    start();
  } catch (err) {
    console.error(`Failed to start monitor: ${err.message}`);
    process.exit(1);
  }
}

function fileURLToPath(url) {
  return new URL(url).pathname;
}