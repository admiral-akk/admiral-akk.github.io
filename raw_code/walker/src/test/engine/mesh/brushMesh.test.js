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
import { Triangle } from "../../../engine/mesh/triangle";
import { BrushMesh } from "../../../engine/mesh/brushMesh";

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

test("brush - Triangle brush produces vertices", () => {
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

test("mesh1 - Triangle brush produces triangular triangles", () => {
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

  const mesh = new BrushMesh(brush);

  const triangles = mesh.triangles();

  listElementsMatch(
    triangles,
    [
      new Triangle(new Vec3(0, 1, 0), new Vec3(1, 0, 0), new Vec3(0, 0, 0)),
      new Triangle(new Vec3(0, 0, 0), new Vec3(0, 0, 1), new Vec3(0, 1, 0)),
      new Triangle(new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1)),
      new Triangle(new Vec3(1, 0, 0), new Vec3(0, 0, 1), new Vec3(0, 0, 0)),
    ],
    { triangles, brush, mesh }
  );
});

test("subtract - cube / cube", () => {
  const brush = new Brush([
    new Plane(new Vec3(0, 1, 0), 0),
    new Plane(new Vec3(0, -1, 0), -2),
    new Plane(new Vec3(1, 0, 0), -1),
    new Plane(new Vec3(-1, 0, 0), -1),
    new Plane(new Vec3(0, 0, 1), -1),
    new Plane(new Vec3(0, 0, -1), -1),
  ]);

  const brush2 = new Brush([
    new Plane(new Vec3(0, 1, 0), 1),
    new Plane(new Vec3(0, -1, 0), -4),
    new Plane(new Vec3(1, 0, 0), -2),
    new Plane(new Vec3(-1, 0, 0), -2),
    new Plane(new Vec3(0, 0, 1), -2),
    new Plane(new Vec3(0, 0, -1), -2),
  ]);

  const mesh1 = new BrushMesh(brush);
  const mesh2 = new BrushMesh(brush2);

  mesh1.subtract(mesh2);

  const vertices = mesh1.vertices();
  listElementsMatch(
    Array.from(vertices),
    [
      new Vec3(1, 0, 1),
      new Vec3(-1, 0, 1),
      new Vec3(1, 0, -1),
      new Vec3(-1, 0, -1),
      new Vec3(1, 1, 1),
      new Vec3(-1, 1, 1),
      new Vec3(1, 1, -1),
      new Vec3(-1, 1, -1),
    ],
    { vertices, mesh1, mesh2 }
  );
});

test("add - cube / cube", () => {
  const brush = new Brush([
    new Plane(new Vec3(0, 1, 0), 0),
    new Plane(new Vec3(0, -1, 0), -2),
    new Plane(new Vec3(1, 0, 0), -1),
    new Plane(new Vec3(-1, 0, 0), -1),
    new Plane(new Vec3(0, 0, 1), -1),
    new Plane(new Vec3(0, 0, -1), -1),
  ]);

  const brush2 = new Brush([
    new Plane(new Vec3(0, 1, 0), 1),
    new Plane(new Vec3(0, -1, 0), -4),
    new Plane(new Vec3(1, 0, 0), -2),
    new Plane(new Vec3(-1, 0, 0), -2),
    new Plane(new Vec3(0, 0, 1), -2),
    new Plane(new Vec3(0, 0, -1), -2),
  ]);

  const mesh1 = new BrushMesh(brush);
  const mesh2 = new BrushMesh(brush2);

  mesh1.add(mesh2);

  const vertices = mesh1.vertices();
  listElementsMatch(
    Array.from(vertices),
    [
      new Vec3(1, 0, 1),
      new Vec3(-1, 0, 1),
      new Vec3(1, 0, -1),
      new Vec3(-1, 0, -1),
      new Vec3(1, 1, 1),
      new Vec3(-1, 1, 1),
      new Vec3(1, 1, -1),
      new Vec3(-1, 1, -1),
      new Vec3(2, 1, 2),
      new Vec3(-2, 1, 2),
      new Vec3(2, 1, -2),
      new Vec3(-2, 1, -2),
      new Vec3(2, 4, 2),
      new Vec3(-2, 4, 2),
      new Vec3(2, 4, -2),
      new Vec3(-2, 4, -2),
    ],
    { vertices, mesh1, mesh2 }
  );
});
