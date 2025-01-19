import { assert } from "vitest";
export const expectedApprox = (v, expected, obj = {}, episilon = 0.001) => {
  assert.isAtMost(
    Math.abs(v - expected),
    episilon,
    `\n${JSON.stringify(
      obj,
      null,
      2
    )}\n\nactual: ${v}\nexpected: ${expected}\nepisilon: ${episilon}`
  );
};
