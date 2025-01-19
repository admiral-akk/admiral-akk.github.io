import { assert, test } from "vitest";
import { Vec3 } from "gl-matrix";
import { Line } from "../../../engine/mesh/line";
import { approxDistance, expectedApprox } from "../../helper";
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

test("brush - Empty brush produces no triangles", () => {
  const emptyBrush = new Brush([
    new Plane(new Vec3(1, 0, 0), 1),
    new Plane(new Vec3(-1, 0, 0), 1),
  ]);

  assert.isEmpty(emptyBrush.triangles());
});

test("brush - Box brush produces box triangles", () => {
  const emptyBrush = new Brush([
    new Plane(new Vec3(1, 0, 0), -1),
    new Plane(new Vec3(-1, 0, 0), -1),
    new Plane(new Vec3(0, 1, 0), -1),
    new Plane(new Vec3(0, -1, 0), -1),
    new Plane(new Vec3(0, 0, 1), -1),
    new Plane(new Vec3(0, 0, -1), -1),
  ]);

  assert.isNotEmpty(emptyBrush.triangles());
});
