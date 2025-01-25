import { Vec3 } from "gl-matrix";
import { assert } from "vitest";
import { Triangle } from "../engine/mesh/triangle";
import { Plane } from "three";
import { EdgePlane } from "../engine/mesh/plane";

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

const planeDistance = (p1, p2) => {
  return Math.abs(p1.offset - p2.offset) + 1 - Vec3.dot(p1.norm, p2.norm);
};

export const distance = (v1, v2) => {
  var actualDistance;
  var type = typeof v1;

  if (v1 instanceof Vec3) {
    actualDistance = Vec3.distance(v1, v2);
  } else if (v1 instanceof EdgePlane) {
    actualDistance = Math.max(
      planeDistance(v1.plane1, v2.plane1),
      planeDistance(v1.plane2, v2.plane2),
      planeDistance(v1.start, v2.start),
      planeDistance(v1.end, v2.end)
    );
  } else if (v1 instanceof Plane) {
    actualDistance = planeDistance(v1, v2);
  } else if (type === "number" || v1 instanceof Number) {
    actualDistance = v1 - v2;
  } else if (v1 instanceof Triangle) {
    var minError = 100000000;
    for (let i = 0; i < 3; i++) {
      var totalError = 0;
      for (let j = 0; j < 3; j++) {
        const p1 = v1.points[(j + i) % 3];
        const p2 = v2.points[j];
        totalError += Vec3.distance(p1, p2);
      }
      minError = Math.min(minError, totalError);
    }

    actualDistance = minError;
  } else {
    throw new Error(
      `Unknown actual type: ${JSON.stringify(
        v1,
        null,
        2
      )}, v2: ${JSON.stringify(v2, null, 2)}`
    );
  }

  return actualDistance;
};

export const listElementsContains = (
  actualList,
  expectedList,
  debugObj = {},
  epsilon = 0.001
) => {
  const missedExpectedMatches = [];
  expectedList.forEach((expected) => {
    var bestDistance = 100000;
    var best = null;
    actualList.forEach((actual) => {
      const dist = distance(actual, expected);
      if (dist < bestDistance) {
        bestDistance = dist;
        best = expected;
      }
    });
    if (bestDistance > epsilon) {
      missedExpectedMatches.push(expected);
    }
  });

  debugObj.actualList = actualList;
  debugObj.missedExpectedMatches = missedExpectedMatches;

  assert.isEmpty(missedExpectedMatches, JSON.stringify(debugObj, null, 2));
};

export const listElementsMatch = (
  actualList,
  expectedList,
  debugObj = {},
  epsilon = 0.001
) => {
  const missedActualMatches = [];
  const missedExpectedMatches = Array.from(expectedList);
  actualList.forEach((actual) => {
    var bestDistance = 100000;
    var best = null;
    expectedList.forEach((expected) => {
      const dist = distance(actual, expected);
      if (dist < bestDistance) {
        bestDistance = dist;
        best = expected;
      }
    });
    if (bestDistance > epsilon) {
      missedActualMatches.push(actual);
    } else {
      missedExpectedMatches.remove(best);
    }
  });

  debugObj.missedActualMatches = missedActualMatches;
  debugObj.missedExpectedMatches = missedExpectedMatches;

  assert.isEmpty(missedActualMatches, JSON.stringify(debugObj, null, 2));
  assert.isEmpty(missedExpectedMatches, JSON.stringify(debugObj, null, 2));
};

export const approxDistance = (
  actual,
  expected,
  expectedDistance,
  debugObj = {},
  epsilon = 0.001
) => {
  var actualDistance = distance(actual, expected);

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
