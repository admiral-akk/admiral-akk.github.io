import { assert, test } from "vitest";
import { Vec3 } from "gl-matrix";
import { Line } from "../../../engine/geometry/Line";
import { Plane } from "../../../engine/geometry/Plane";
import { PlanarEdge } from "../../../engine/geometry/planarEdge";

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

test("makePlanarEdge - parallel planes return null", () => {
  const plane1 = new Plane(new Vec3(0, 1, 0), 1);
  const plane2 = new Plane(new Vec3(0, 1, 0), 1);

  const planes = [plane1, plane2];
  const edge = PlanarEdge.makePlanarEdge({ plane1, plane2, planes });

  assert.isNull(
    edge,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
});

test("makePlanarEdge - orthogonal planes return line without start and end", () => {
  const plane1 = new Plane(new Vec3(1, 0, 0), 1);
  const plane2 = new Plane(new Vec3(0, 1, 0), 1);

  const planes = [plane1, plane2];
  const edge = PlanarEdge.makePlanarEdge({ plane1, plane2, planes });

  const expected = new PlanarEdge(plane1, plane2, null, null);

  assert.equal(
    edge.plane1,
    expected.plane1,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
  assert.equal(
    edge.plane2,
    expected.plane2,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
  assert.equal(
    edge.start,
    expected.start,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
  assert.equal(
    edge.end,
    expected.end,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
});

test("makePlanarEdge - orthogonal planes return line with start and end", () => {
  const plane1 = new Plane(new Vec3(1, 0, 0), 1);
  const plane2 = new Plane(new Vec3(0, 1, 0), 1);

  const plane3 = new Plane(new Vec3(0, 0, 1), -10);
  const plane4 = new Plane(new Vec3(0, 0, -1), -10);

  const planes = [plane1, plane2, plane3, plane4];
  const edge = PlanarEdge.makePlanarEdge({ plane1, plane2, planes });

  const expected = new PlanarEdge(plane1, plane2, plane3, plane4);

  assert.equal(
    edge.plane1,
    expected.plane1,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
  assert.equal(
    edge.plane2,
    expected.plane2,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
  assert.equal(
    edge.start,
    expected.start,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
  assert.equal(
    edge.end,
    expected.end,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
});

test("makePlanarEdge - orthogonal planes return line with closer start and end", () => {
  const plane1 = new Plane(new Vec3(1, 0, 0), 1);
  const plane2 = new Plane(new Vec3(0, 1, 0), 1);

  const plane3 = new Plane(new Vec3(0, 0, 1), -10);
  const plane4 = new Plane(new Vec3(0, 0, -1), -10);

  const plane5 = new Plane(new Vec3(0, 0, 1), -5);
  const plane6 = new Plane(new Vec3(0, 0, -1), -5);

  const planes = [plane1, plane2, plane3, plane4, plane5, plane6];
  const edge = PlanarEdge.makePlanarEdge({ plane1, plane2, planes });

  const expected = new PlanarEdge(plane1, plane2, plane5, plane6);

  assert.equal(
    edge.plane1,
    expected.plane1,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
  assert.equal(
    edge.plane2,
    expected.plane2,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
  assert.equal(
    edge.start,
    expected.start,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
  assert.equal(
    edge.end,
    expected.end,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
});

test("makePlanarEdge - empty edge would be null", () => {
  const plane1 = new Plane(new Vec3(1, 0, 0), 1);
  const plane2 = new Plane(new Vec3(0, 1, 0), 1);

  const plane3 = new Plane(new Vec3(0, 0, 1), -10);
  const plane4 = new Plane(new Vec3(0, 0, -1), -10);

  const plane5 = new Plane(new Vec3(0, 0, 1), 0);
  const plane6 = new Plane(new Vec3(0, 0, -1), 0);

  const planes = [plane1, plane2, plane3, plane4, plane5, plane6];
  const edge = PlanarEdge.makePlanarEdge({ plane1, plane2, planes });

  assert.isNull(
    edge,
    `\n${JSON.stringify({ plane1, plane2, planes, edge }, null, 2)}`
  );
});
