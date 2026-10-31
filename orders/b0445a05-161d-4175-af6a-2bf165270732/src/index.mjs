const REQUIRED_FIELDS = ['id', 'value'];

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateInput(input) {
  if (!isPlainObject(input)) {
    throw new Error('Invalid input: expected a JSON object');
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in input)) {
      throw new Error(`Invalid input: missing required field '${field}'`);
    }
  }

  if (typeof input.id !== 'string' || input.id.length === 0) {
    throw new Error("Invalid input: field 'id' must be a non-empty string");
  }

  if (typeof input.value !== 'number' || !Number.isFinite(input.value)) {
    throw new Error("Invalid input: field 'value' must be a finite number");
  }
}

function processEntry(input) {
  validateInput(input);

  return {
    id: input.id,
    value: input.value,
    processed: true,
    timestamp: Date.now()
  };
}

export { processEntry };