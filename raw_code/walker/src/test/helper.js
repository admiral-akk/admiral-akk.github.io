import { Vec3 } from "gl-matrix";
import { Triangle } from "three";
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
  var type = typeof actual;

  if (actual instanceof Vec3) {
    actualDistance = Vec3.distance(actual, expected);
  } else if (type === "number" || actual instanceof Number) {
    actualDistance = actual - expected;
  } else if (actual instanceof Triangle) {
    var minError = 100000000;
    for (let i = 0; i < 3; i++) {
      var totalError = 0;
      for (let j = 0; j < 3; j++) {
        const p1 = actual.points[(j + i) % 3];
        const p2 = expected.points[j];
        totalError += Vec3.distance(p1, p2);
      }
      minError = Math.min(minError, totalError);
    }

    actualDistance = minError;
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
