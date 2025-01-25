import { assert, test } from "vitest";
import { Vec3 } from "gl-matrix";
import { Line } from "../../../engine/geometry/Line";

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

test("point - 0 returns start", () => {
  const start = new Vec3(0, 0, 0);
  const dir = new Vec3(1, 0, 0);

  const line = new Line(start, dir);

  expectedApprox(distance(line.point(0), start), 0, { line });
});
