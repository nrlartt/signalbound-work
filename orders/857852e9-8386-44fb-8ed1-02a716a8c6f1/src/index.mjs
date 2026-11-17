const UNITS = [
  { long: 'day', short: 'd', ms: 86400000 },
  { long: 'hour', short: 'h', ms: 3600000 },
  { long: 'minute', short: 'm', ms: 60000 },
  { long: 'second', short: 's', ms: 1000 },
  { long: 'millisecond', short: 'ms', ms: 1 }
];

function parseDuration(input) {
  if (typeof input !== 'string') {
    throw new Error('Invalid duration: expected a string');
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new Error('Invalid duration: empty input');
  }

  const match = trimmed.match(/^([+-]?)(?:(\d+)(?:\.(\d+))?|\.(\d+))\s*([a-zA-Z]+)$/);
  if (!match) {
    throw new Error(`Invalid duration: cannot parse '${input}'`);
  }

  const sign = match[1] === '-' ? -1 : 1;
  const integerPart = match[2] || '0';
  const decimalDigits = match[3] || match[4] || '';
  const unitText = match[5].toLowerCase();

  const unit = UNITS.find(u => u.short === unitText || u.long === unitText);
  if (!unit) {
    throw new Error(`Invalid duration: unsupported unit '${match[5]}'`);
  }

  const scale = Math.pow(10, decimalDigits.length);
  const whole = parseInt(integerPart, 10) || 0;
  const fraction = decimalDigits.length > 0 ? parseInt(decimalDigits, 10) : 0;
  const value = (whole * scale + fraction) / scale;

  return sign * value * unit.ms;
}

function formatDuration(ms, options) {
  if (typeof ms !== 'number') {
    throw new Error('Invalid milliseconds: expected a number');
  }

  if (!Number.isFinite(ms)) {
    throw new Error('Invalid milliseconds: must be finite');
  }

  const long = options && options.long === true;
  const negative = ms < 0;
  const abs = Math.abs(ms);

  if (abs === 0) {
    const unit = long ? 'milliseconds' : 'ms';
    return `0 ${unit}`;
  }

  let selected = null;
  let displayed = 0;

  for (const unit of UNITS) {
    const raw = abs / unit.ms;
    if (raw >= 1) {
      selected = unit;
      displayed = Math.round(raw);
      break;
    }
  }

  if (!selected) {
    selected = UNITS[UNITS.length - 1];
    displayed = Math.round(abs);
  }

  const unitName = long ? selected.long : selected.short;
  const plural = long && displayed !== 1 ? `${unitName}s` : unitName;
  const prefix = negative ? '-' : '';

  return `${prefix}${displayed} ${plural}`;
}

export default function ms(input, options) {
  if (typeof input === 'string') {
    return parseDuration(input);
  }

  if (typeof input === 'number') {
    return formatDuration(input, options);
  }

  throw new Error('Invalid argument: expected a string or a number');
};

export { parseDuration, formatDuration };
