export function diffLines(before, after) {
  const beforeIds = new Set();
  for (const line of before) {
    if (beforeIds.has(line.id)) {
      throw new Error('duplicate id');
    }
    beforeIds.add(line.id);
  }

  const afterIds = new Set();
  for (const line of after) {
    if (afterIds.has(line.id)) {
      throw new Error('duplicate id');
    }
    afterIds.add(line.id);
  }

  const beforeById = new Map();
  for (const line of before) {
    beforeById.set(line.id, line);
  }

  const afterById = new Map();
  for (const line of after) {
    afterById.set(line.id, line);
  }

  const added = [];
  const removed = [];
  const changed = [];
  let unchanged = 0;

  const allIds = new Set([...beforeIds, ...afterIds]);

  for (const id of allIds) {
    const inBefore = beforeIds.has(id);
    const inAfter = afterIds.has(id);

    if (!inBefore && inAfter) {
      added.push(id);
    } else if (inBefore && !inAfter) {
      removed.push(id);
    } else {
      const beforeLine = beforeById.get(id);
      const afterLine = afterById.get(id);

      if (beforeLine.text !== afterLine.text || beforeLine.source !== afterLine.source) {
        changed.push(id);
      } else {
        unchanged += 1;
      }
    }
  }

  added.sort((a, b) => a - b);
  removed.sort((a, b) => a - b);
  changed.sort((a, b) => a - b);

  return { added, removed, changed, unchanged };
}