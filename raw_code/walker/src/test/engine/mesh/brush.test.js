import { assert, test } from "vitest";
import { Vec3 } from "gl-matrix";
import { Line } from "../../../engine/mesh/line";
import {
  approxDistance,
  expectedApprox,
  listElementsMatch,
} from "../../helper";
import { Plane } from "../../../engine/mesh/plane";
import { Brush } from "../../../engine/mesh/brush";

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

test("planePoints - Empty brush produces no vertices", () => {
  const emptyBrush = new Brush([
    new Plane(new Vec3(1, 0, 0), 1),
    new Plane(new Vec3(-1, 0, 0), 1),
  ]);

  const [planeToPoints, pointsToPlanes] = emptyBrush.planePoints();
  assert.isEmpty(pointsToPlanes);
});

test("brush - Triangle brush produces triangular triangles", () => {
  const p1 = new Plane(new Vec3(0, 1, 0), 0); // base
  const p2 = Plane.fromPoints(
    new Vec3(0, 1, 0),
    new Vec3(1, 0, 0),
    new Vec3(0, 0, 1)
  );
  const p3 = Plane.fromPoints(
    new Vec3(0, 0, 0),
    new Vec3(0, 1, 0),
    new Vec3(0, 0, 1)
  );

  const p4 = Plane.fromPoints(
    new Vec3(1, 0, 0),
    new Vec3(0, 1, 0),
    new Vec3(0, 0, 0)
  );

  const brush = new Brush([p1, p2, p3, p4]);

  const [planeToPoints, pointsToPlanes] = brush.planePoints();

  listElementsMatch(
    Array.from(pointsToPlanes.keys()),
    [
      new Vec3(0, 0, 0),
      new Vec3(0, 1, 0),
      new Vec3(1, 0, 0),
      new Vec3(0, 0, 1),
    ],
    { pointsToPlanes: Array.from(pointsToPlanes.entries()), brush }
  );
});
