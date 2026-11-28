export function rleEncode(input) {
  if (!Array.isArray(input)) {
    throw new Error('not a list');
  }

  const result = [];

  for (const element of input) {
    if (!Number.isInteger(element)) {
      throw new Error('bad value');
    }

    const last = result[result.length - 1];
    if (last && last[0] === element) {
      last[1] += 1;
    } else {
      result.push([element, 1]);
    }
  }

  return result;
}

export function rleDecode(input) {
  if (!Array.isArray(input)) {
    throw new Error('not a list');
  }

  const result = [];

  for (const pair of input) {
    if (
      !Array.isArray(pair) ||
      pair.length !== 2 ||
      !Number.isInteger(pair[0]) ||
      !Number.isInteger(pair[1])
    ) {
      throw new Error('bad pair');
    }

    if (pair[1] < 0) {
      throw new Error('bad count');
    }

    for (let i = 0; i < pair[1]; i += 1) {
      result.push(pair[0]);
    }
  }

  return result;
}