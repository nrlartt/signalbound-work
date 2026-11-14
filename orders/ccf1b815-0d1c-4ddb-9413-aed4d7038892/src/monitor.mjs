import { createServer } from 'node:http';

const DEFAULT_INTERVAL_MS = 60_000;
const DEFAULT_CONSECUTIVE_FAILURES = 3;
const DEFAULT_RECOVERY_NOTICE = true;
const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;
const DEFAULT_BACKOFF_MS = 5_000;

function loadConfig() {
  const raw = process.env.MONITOR_CONFIG;
  const fileConfig = raw ? JSON.parse(raw) : {};

  const config = {
    endpoint: process.env.MONITOR_ENDPOINT ?? fileConfig.endpoint ?? undefined,
    intervalMs: Number(process.env.MONITOR_INTERVAL_MS ?? fileConfig.intervalMs ?? DEFAULT_INTERVAL_MS),
    consecutiveFailures: Number(process.env.MONITOR_CONSECUTIVE_FAILURES ?? fileConfig.consecutiveFailures ?? DEFAULT_CONSECUTIVE_FAILURES),
    recoveryNotice: process.env.MONITOR_RECOVERY_NOTICE ?? fileConfig.recoveryNotice ?? DEFAULT_RECOVERY_NOTICE,
    requestTimeoutMs: Number(process.env.MONITOR_REQUEST_TIMEOUT_MS ?? fileConfig.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS),
    backoffMs: Number(process.env.MONITOR_BACKOFF_MS ?? fileConfig.backoffMs ?? DEFAULT_BACKOFF_MS),
  };

  if (!config.endpoint) {
    throw new Error('MONITOR_ENDPOINT or config.endpoint is required');
  }

  const url = new URL(config.endpoint);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('endpoint must be http or https');
  }

  if (!Number.isFinite(config.intervalMs) || config.intervalMs <= 0) {
    throw new Error('intervalMs must be a positive number');
  }

  if (!Number.isFinite(config.consecutiveFailures) || config.consecutiveFailures < 1) {
    throw new Error('consecutiveFailures must be at least 1');
  }

  if (!Number.isFinite(config.requestTimeoutMs) || config.requestTimeoutMs <= 0) {
    throw new Error('requestTimeoutMs must be a positive number');
  }

  if (!Number.isFinite(config.backoffMs) || config.backoffMs < 0) {
    throw new Error('backoffMs must be zero or positive');
  }

  return config;
}

function isRecoveryNoticeEnabled(value) {
  return String(value).toLowerCase() !== 'false' && String(value) !== '0';
}

async function readEndpoint(endpoint, requestTimeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      redirect: 'follow',
    });

    const body = await response.text();

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      bodyLength: body.length,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function formatTimestamp() {
  return new Date().toISOString();
}

function createMonitor(config) {
  let consecutiveFailures = 0;
  let wasHealthy = true;
  let running = false;
  let timer = null;

  const state = () => ({
    consecutiveFailures,
    wasHealthy,
    running,
    config: {
      endpoint: config.endpoint,
      intervalMs: config.intervalMs,
      consecutiveFailuresRequired: config.consecutiveFailures,
      recoveryNotice: isRecoveryNoticeEnabled(config.recoveryNotice),
      requestTimeoutMs: config.requestTimeoutMs,
      backoffMs: config.backoffMs,
    },
  });

  async function checkOnce() {
    const delay = consecutiveFailures > 0 ? config.backoffMs : 0;
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    let result;
    try {
      result = await readEndpoint(config.endpoint, config.requestTimeoutMs);
    } catch (error) {
      consecutiveFailures += 1;
      wasHealthy = false;

      console.log(
        `${formatTimestamp()} ALERT endpoint=${config.endpoint} error=${error.message} consecutiveFailures=${consecutiveFailures}`
      );

      if (consecutiveFailures >= config.consecutiveFailures) {
        console.log(
          `${formatTimestamp()} ALARM endpoint=${config.endpoint} reason=consecutive_failures threshold=${config.consecutiveFailures}`
        );
      }

      return { ok: false, error: error.message, consecutiveFailures };
    }

    const healthy = result.ok;

    if (healthy) {
      if (!wasHealthy && consecutiveFailures > 0 && isRecoveryNoticeEnabled(config.recoveryNotice)) {
        console.log(
          `${formatTimestamp()} RECOVERY endpoint=${config.endpoint} status=${result.status} after=${consecutiveFailures} failures`
        );
      }

      consecutiveFailures = 0;
      wasHealthy = true;
      return { ok: true, status: result.status, consecutiveFailures: 0 };
    }

    consecutiveFailures += 1;
    wasHealthy = false;

    console.log(
      `${formatTimestamp()} ALERT endpoint=${config.endpoint} status=${result.status} ${result.statusText} consecutiveFailures=${consecutiveFailures}`
    );

    if (consecutiveFailures >= config.consecutiveFailures) {
      console.log(
        `${formatTimestamp()} ALARM endpoint=${config.endpoint} reason=consecutive_failures threshold=${config.consecutiveFailures}`
      );
    }

    return { ok: false, status: result.status, consecutiveFailures };
  }

  function start() {
    if (running) return;
    running = true;

    (async function loop() {
      while (running) {
        await checkOnce();
        await new Promise((resolve) => setTimeout(resolve, config.intervalMs));
      }
    })();
  }

  function stop() {
    running = false;
  }

  return {
    checkOnce,
    start,
    stop,
    state,
  };
}

function main() {
  const config = loadConfig();
  const monitor = createMonitor(config);

  console.log(
    `${formatTimestamp()} MONITOR_START endpoint=${config.endpoint} intervalMs=${config.intervalMs} consecutiveFailuresRequired=${config.consecutiveFailures} recoveryNotice=${isRecoveryNoticeEnabled(config.recoveryNotice)} requestTimeoutMs=${config.requestTimeoutMs} backoffMs=${config.backoffMs}`
  );

  monitor.start();

  const signals = ['SIGINT', 'SIGTERM'];
  for (const signal of signals) {
    process.on(signal, () => {
      console.log(`${formatTimestamp()} MONITOR_STOP signal=${signal}`);
      monitor.stop();
      process.exit(0);
    });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

function fileURLToPath(url) {
  return new URL(url).pathname;
}

export { loadConfig, readEndpoint, createMonitor, isRecoveryNoticeEnabled, DEFAULT_INTERVAL_MS, DEFAULT_CONSECUTIVE_FAILURES };
