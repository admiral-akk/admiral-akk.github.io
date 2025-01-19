import { Vec3 } from "gl-matrix";
import { assert } from "vitest";

export const expectedApprox = (v, expected, obj = {}, epsilon = 0.001) => {
  assert.isAtMost(
    Math.abs(v - expected),
    epsilon,
    `\n${JSON.stringify(
      obj,
      null,
      2
    )}\n\nactual: ${v}\nexpected: ${expected}\nepisilon: ${epsilon}`
  );
};

export const approxDistance = (
  actual,
  expected,
  expectedDistance,
  debugObj = {},
  epsilon = 0.001
) => {
  var actualDistance;

  if (actual instanceof Vec3) {
    actualDistance = Vec3.distance(actual, expected);
  } else if (actual instanceof Number) {
    actualDistance = actual - expected;
  } else {
    throw new Error(
      `Unknown actual type: ${actual.prototype.constructor.toString()}`
    );
  }

  assert.isAtMost(
    Math.abs(actualDistance - expectedDistance),
    epsilon,
    `\n${JSON.stringify(
      debugObj,
      null,
      2
    )}\n\nactual: ${actual}\nexpected: ${expected}\nepisilon: ${epsilon}`
  );
};
