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

test("point - 0 returns start", () => {
  const start = new Vec3(0, 0, 0);
  const dir = new Vec3(1, 0, 0);

  const t = 0;

  const line = new Line(start, dir);

  expectedApprox(distance(line.point(t), start.scaleAndAdd(dir, t)), 0, {
    line,
  });
});

test("point - 1 returns start + dir", () => {
  const start = new Vec3(4, 2, 3);
  const dir = new Vec3(1, 0, 0);

  const t = 1;

  const line = new Line(start, dir);

  expectedApprox(distance(line.point(t), start.scaleAndAdd(dir, t)), 0, {
    line,
  });
});

test("line to Plane - returns null if orthogonal to normal", () => {
  const start = new Vec3(4, 2, 3);
  const dir = new Vec3(1, 0, 0);

  const normal = new Vec3(0, 1, 0);
  const offset = 1;

  const line = new Line(start, dir);
  const plane = new Plane(normal, offset);

  const intersection = line.lineToPlane(plane);

  assert.isNull(
    intersection,
    `\n${JSON.stringify({ line, plane, intersection }, null, 2)}`
  );
});

test("line to Plane - returns correct distance point", () => {
  const start = new Vec3(4, 2, 3);
  const dir = new Vec3(1, 0, 0);

  const normal = new Vec3(1, 0, 0);
  const offset = 1;

  const line = new Line(start, dir);
  const plane = new Plane(normal, offset);

  const t = line.lineToPlaneT(plane);

  expectedApprox(t, -3, {
    line,
    plane,
    t,
  });
});

test("line to Plane - returns intersection point", () => {
  const start = new Vec3(4, 2, 3);
  const dir = new Vec3(1, 0, 0);

  const normal = new Vec3(1, 0, 0);
  const offset = 1;

  const line = new Line(start, dir);
  const plane = new Plane(normal, offset);

  const intersection = line.lineToPlane(plane);

  expectedApprox(distance(intersection, new Vec3(1, 2, 3)), 0, {
    line,
    plane,
    intersection,
  });
});
