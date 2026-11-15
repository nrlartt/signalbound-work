import { assert } from "node:assert";
import { clamp } from "../src/clamp.mjs";

const passed = [];
const failed = [];

function test(name, fn) {
  try {
    fn();
    passed.push(name);
  } catch (error) {
    failed.push({ name, error });
  }
}

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function expectRangeError(fn, messageSubstring) {
  let threw = false;
  try {
    fn();
  } catch (error) {
    threw = true;
    expect(error instanceof RangeError, `Expected RangeError, got ${error.constructor.name}`);
    expect(String(error.message).includes(messageSubstring), `Expected message to include "${messageSubstring}", got "${error.message}"`);
  }
  expect(threw, `Expected function to throw RangeError with message including "${messageSubstring}"`);
}

// T1: Boundary lower: x below min returns min.
test("T1: x below min returns min", () => {
  expect(clamp(1, 5, 10) === 5, "Expected clamp(1, 5, 10) to return 5");
});

// T2: Boundary upper: x above max returns max.
test("T2: x above max returns max", () => {
  expect(clamp(12, 5, 10) === 10, "Expected clamp(12, 5, 10) to return 10");
});

// T3: Boundary equal to min: x equal to min returns min.
test("T3: x equal to min returns min", () => {
  expect(clamp(5, 5, 10) === 5, "Expected clamp(5, 5, 10) to return 5");
});

// T4: Boundary equal to max: x equal to max returns max.
test("T4: x equal to max returns max", () => {
  expect(clamp(10, 5, 10) === 10, "Expected clamp(10, 5, 10) to return 10");
});

// T5: Interior value: x strictly between min and max returns x.
test("T5: interior value returns x", () => {
  expect(clamp(7, 5, 10) === 7, "Expected clamp(7, 5, 10) to return 7");
});

// T6: Degenerate interval: min equals max returns that value for x below, equal to, and above the bound.
test("T6: min equals max returns that value for x below", () => {
  expect(clamp(3, 7, 7) === 7, "Expected clamp(3, 7, 7) to return 7");
});
test("T6: min equals max returns that value for x equal", () => {
  expect(clamp(7, 7, 7) === 7, "Expected clamp(7, 7, 7) to return 7");
});
test("T6: min equals max returns that value for x above", () => {
  expect(clamp(11, 7, 7) === 7, "Expected clamp(11, 7, 7) to return 7");
});

// T7: Negative bounds: clamping works with negative min and max values.
test("T7: negative bounds clamp below", () => {
  expect(clamp(-15, -10, -5) === -10, "Expected clamp(-15, -10, -5) to return -10");
});
test("T7: negative bounds clamp above", () => {
  expect(clamp(-2, -10, -5) === -5, "Expected clamp(-2, -10, -5) to return -5");
});
test("T7: negative bounds interior", () => {
  expect(clamp(-7, -10, -5) === -7, "Expected clamp(-7, -10, -5) to return -7");
});

// T8: Zero bounds: clamping works when min or max is zero.
test("T8: min is zero clamps below", () => {
  expect(clamp(-3, 0, 10) === 0, "Expected clamp(-3, 0, 10) to return 0");
});
test("T8: max is zero clamps above", () => {
  expect(clamp(3, -10, 0) === 0, "Expected clamp(3, -10, 0) to return 0");
});
test("T8: min and max are zero", () => {
  expect(clamp(100, 0, 0) === 0, "Expected clamp(100, 0, 0) to return 0");
});

// T9: Invalid bounds: min greater than max throws RangeError.
test("T9: min greater than max throws RangeError", () => {
  expectRangeError(() => clamp(5, 10, 1), "bounds");
});

// T10: Invalid bounds message: the thrown error message indicates bounds are invalid.
test("T10: error message indicates bounds are invalid", () => {
  expectRangeError(() => clamp(5, 10, 1), "bounds");
});

// T11: Error type: the thrown error is specifically a RangeError.
test("T11: thrown error is a RangeError", () => {
  let threw = false;
  try {
    clamp(5, 10, 1);
  } catch (error) {
    threw = true;
    expect(error instanceof RangeError, `Expected RangeError, got ${error.constructor.name}`);
  }
  expect(threw, "Expected clamp(5, 10, 1) to throw");
});

console.log("Clamp test results:");
for (const name of passed) {
  console.log(`  PASS ${name}`);
}
for (const { name, error } of failed) {
  console.log(`  FAIL ${name}: ${error.message}`);
}
console.log(`\n${passed.length} passed, ${failed.length} failed`);

if (failed.length > 0) {
  process.exitCode = 1;
}