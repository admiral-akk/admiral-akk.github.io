import { assert, test } from "vitest";
import { Vec3 } from "gl-matrix";
import { Plane } from "../../../engine/geometry/plane";
import { Brush } from "../../../engine/geometry/brush";
import { Composition } from "../../../engine/geometry/composition";
import { Face } from "../../../engine/geometry/face";
import { PlanarEdge } from "../../../engine/geometry/planarEdge";

export const listContainsElements = (
  actualList,
  expectedList,
  debugObj = {}
) => {
  const missedExpectedMatches = Array.from(expectedList);
  actualList.forEach((f1) => {
    const f1Index = missedExpectedMatches.findIndex((f2) => f2.equals(f1));
    if (f1Index >= 0) {
      missedExpectedMatches.splice(f1Index, 1);
    }
  });

  debugObj.missedExpectedMatches = missedExpectedMatches;
  assert.isEmpty(missedExpectedMatches, JSON.stringify(debugObj, null, 2));
};

test("composition with box contains appropriate faces", () => {
  const planes = [
    new Plane(new Vec3(1, 0, 0), -1),
    new Plane(new Vec3(-1, 0, 0), -1),
    new Plane(new Vec3(0, 1, 0), -1),
    new Plane(new Vec3(0, -1, 0), -1),
    new Plane(new Vec3(0, 0, 1), -1),
    new Plane(new Vec3(0, 0, -1), -1),
  ];

  var brush = new Brush();

  brush = Brush.addPlane(brush, ...planes);

  const composition = new Composition(brush);

  const actualFaces = composition.faces();

  const expectedFaces = [
    new Face([
      new PlanarEdge(planes[0], planes[3], planes[5], planes[4]),
      new PlanarEdge(planes[0], planes[4], planes[3], planes[2]),
      new PlanarEdge(planes[0], planes[2], planes[4], planes[5]),
      new PlanarEdge(planes[0], planes[5], planes[2], planes[3]),
    ]),
    new Face([
      new PlanarEdge(planes[1], planes[3], planes[4], planes[5]),
      new PlanarEdge(planes[1], planes[5], planes[3], planes[2]),
      new PlanarEdge(planes[1], planes[2], planes[5], planes[4]),
      new PlanarEdge(planes[1], planes[4], planes[2], planes[3]),
    ]),
  ];

  listContainsElements(actualFaces, expectedFaces, { actualFaces });
});

test("pyramid handles top point correctly", () => {
  const basePlane = new Plane(new Vec3(0, 1, 0), -1);

  const sidePlanes = [];

  const sides = 30;
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides;
    sidePlanes.push(
      new Plane(new Vec3(Math.sin(angle), -1, Math.cos(angle)), -1)
    );
  }
  var brush = new Brush();

  brush = Brush.addPlane(brush, basePlane);
  brush = Brush.addPlane(brush, ...sidePlanes);

  const composition = new Composition(brush);

  const actualFaces = composition.faces();

  const expectedFaces = [];

  for (let i = 0; i < sides; i++) {
    const prevIndex = (i + sides - 1) % sides;
    const nextIndex = (i + 1) % sides;
    expectedFaces.push(
      new Face([
        new PlanarEdge(
          sidePlanes[i],
          basePlane,
          sidePlanes[prevIndex],
          sidePlanes[nextIndex]
        ),
        new PlanarEdge(
          sidePlanes[i],
          sidePlanes[nextIndex],
          basePlane,
          sidePlanes[prevIndex]
        ),
        new PlanarEdge(
          sidePlanes[i],
          sidePlanes[prevIndex],
          sidePlanes[nextIndex],
          basePlane
        ),
      ])
    );
  }

  listContainsElements(actualFaces, expectedFaces, { actualFaces });
});
