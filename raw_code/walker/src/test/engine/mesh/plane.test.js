import { assert, test } from "vitest";
import { Vec3 } from "gl-matrix";
import { Line } from "../../../engine/mesh/line";
import { approxDistance, expectedApprox } from "../../helper";
import { Plane } from "../../../engine/mesh/plane";

function testLineEqual(line1, line2) {
  expectedApprox(Line.distanceToPoint(line1, line2.start), 0, {
    closest: Line.closestPoint(line1, line2.start),
    p: line2.start,
    line1,
  });
  expectedApprox(Line.distanceToPoint(line2, line1.start), 0, {
    closest: Line.closestPoint(line2, line1.start),
    p: line1.start,
    line2,
  });
}

test("planeIntersection - Parallel normals produce null lines", () => {
  const plane1 = new Plane(new Vec3(1, 0, 0), 19);
  const plane2 = new Plane(new Vec3(-1, 0, 0), 0);

  assert.isNull(Plane.planeIntersection(plane1, plane1));
  assert.isNull(Plane.planeIntersection(plane2, plane1));
  assert.isNull(Plane.planeIntersection(plane1, plane2));
  assert.isNull(Plane.planeIntersection(plane2, plane2));
});

test("planeIntersection - X / Y plane", () => {
  const xPlane = new Plane(new Vec3(1, 0, 0), 0);
  const yPlane = new Plane(new Vec3(0, 1, 0), 0);

  testLineEqual(
    Plane.planeIntersection(xPlane, yPlane),
    new Line(new Vec3(0, 0, 0), new Vec3(0, 0, 1))
  );
});

test("planeIntersection - Y / Z plane", () => {
  const yPlane = new Plane(new Vec3(0, 1, 0), 0);
  const zPlane = new Plane(new Vec3(0, 0, 1), 0);

  testLineEqual(
    Plane.planeIntersection(yPlane, zPlane),
    new Line(new Vec3(0, 0, 0), new Vec3(1, 0, 0))
  );
});

test("planeIntersection - X / Z plane", () => {
  const xPlane = new Plane(new Vec3(1, 0, 0), 0);
  const zPlane = new Plane(new Vec3(0, 0, 1), 0);

  testLineEqual(
    Plane.planeIntersection(xPlane, zPlane),
    new Line(new Vec3(0, 0, 0), new Vec3(0, 1, 0))
  );
});

test("lineIntersection - parallel line", () => {
  const xPlane = new Plane(new Vec3(1, 0, 0), 0);
  const yLine = new Line(new Vec3(), new Vec3(0, 1, 0));

  const intersection = Plane.lineIntersection(xPlane, yLine);

  assert.isNull(intersection);
});

test("lineIntersection - orthogonal line", () => {
  const xPlane = new Plane(new Vec3(1, 0, 0), 0);
  const xLine = new Line(new Vec3(), new Vec3(1, 0, 0));

  const intersection = Plane.lineIntersection(xPlane, xLine);

  approxDistance(intersection, new Vec3(), 0, {
    plane: xPlane,
    line: xLine,
    intersection,
  });
});

test("lineIntersection - orthogonal line, offset", () => {
  const xPlane = new Plane(new Vec3(1, 0, 0), -1);
  const xLine = new Line(new Vec3(0, 1, 0), new Vec3(1, 0, 0));

  const intersection = Plane.lineIntersection(xPlane, xLine);

  approxDistance(intersection, new Vec3(-1, 1, 0), 0, {
    plane: xPlane,
    line: xLine,
    intersection,
  });
});
