import { assert, test } from "vitest";
import { Vec3 } from "gl-matrix";
import { Line } from "../../../engine/geometry/Line";
import { distance } from "./helper";
import { Plane } from "../../../engine/geometry/Plane";

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

test("planeIntersection - parallel planes return null", () => {
  const plane1 = new Plane(new Vec3(0, 1, 0), 1);
  const plane2 = new Plane(new Vec3(0, 1, 0), 1);

  const intersection = plane1.planeIntersection(plane2);

  assert.isNull(
    intersection,
    `\n${JSON.stringify({ plane1, plane2, intersection }, null, 2)}`
  );
});

test("planeIntersection - orthogonal planes return line", () => {
  const plane1 = new Plane(new Vec3(1, 0, 0), 1);
  const plane2 = new Plane(new Vec3(0, 1, 0), 1);

  const intersection = plane1.planeIntersection(plane2);

  const expectedLine = new Line(new Vec3(1, 1, 0), new Vec3(0, 0, 1));

  // sample two points on the expected line and confirm they're on the actual line.
  expectedApprox(intersection.distanceToPoint(expectedLine.point(0)), 0, {
    plane1,
    plane2,
    intersection,
  });
  expectedApprox(intersection.distanceToPoint(expectedLine.point(1)), 0, {
    plane1,
    plane2,
    intersection,
  });
});
