import { test } from "vitest";
import { Vec3 } from "gl-matrix";
import { Line } from "../../../engine/mesh/line";
import { approxDistance } from "../../helper";

function testPointDistance(line, p, dist) {
  const closestPoint = Line.closestPoint(line, p);
  approxDistance(closestPoint, p, dist, {
    closestPoint,
    p,
    line,
  });
}

test("Points on line are all distance 0", () => {
  const line = new Line(new Vec3(1, -1, 1), new Vec3(2, 0, 0));

  const points = [
    new Vec3(1, -1, 1),
    new Vec3(1022123, -1, 1),
    new Vec3(-1203, -1, 1),
  ];

  points.forEach((p) => {
    testPointDistance(line, p, 0);
  });
});

test("Points on line are all distance 0", () => {
  const line = new Line(new Vec3(1, -1, 1), new Vec3(2, 0, 0));

  const points = [
    Line.point(line, 0),
    Line.point(line, 100),
    Line.point(line, -100),
    Line.point(line, 1000),
    Line.point(line, -1000),
  ];

  points.forEach((p) => {
    testPointDistance(line, p, 0);
  });
});

test("Points off line are all distance 1", () => {
  const targetLine = new Line(new Vec3(1, -1, 1), new Vec3(2, 2, 0));

  const line = new Line(
    new Vec3(1 + Math.SQRT1_2, -1 + Math.SQRT1_2, 1),
    new Vec3(2, 2, 0)
  );
  const points = [
    Line.point(line, 0),
    Line.point(line, 100),
    Line.point(line, -100),
    Line.point(line, 1000),
    Line.point(line, -1000),
  ];

  points.forEach((p) => {
    testPointDistance(targetLine, p, 0);
  });
});
