import { assert, test } from "vitest";
import { Vec3 } from "gl-matrix";
import { Plane } from "../../../engine/geometry/Plane";
import { Brush } from "../../../engine/geometry/Brush";
import { Composition } from "../../../engine/geometry/Composition";

export const listElementsMatch = (actualList, expectedList, debugObj = {}) => {
  const missedActualMatches = [];
  const missedExpectedMatches = Array.from(expectedList);
  actualList.forEach((actual) => {
    if (missedExpectedMatches.indexOf(actual) >= 0) {
      missedExpectedMatches.splice(missedExpectedMatches.indexOf(actual), 1);
    } else {
      missedActualMatches.push(actual);
    }
  });

  debugObj.missedActualMatches = missedActualMatches;
  debugObj.missedExpectedMatches = missedExpectedMatches;

  assert.isEmpty(missedActualMatches, JSON.stringify(debugObj, null, 2));
  assert.isEmpty(missedExpectedMatches, JSON.stringify(debugObj, null, 2));
};

test("brush with box contains planes", () => {
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

  listElementsMatch(brush.planes, planes, { brush, planes });
});

test("brush with box contains planes", () => {
  const planes = [
    new Plane(new Vec3(-1, -1, -1), -1),
    new Plane(new Vec3(1, 0, 0), -1),
    new Plane(new Vec3(0, 1, 0), -1),
    new Plane(new Vec3(0, 0, 1), -1),
  ];
  var brush = new Brush();

  brush = Brush.addPlane(brush, ...planes);

  listElementsMatch(brush.planes, planes);
});

test("brush with box contains planes", () => {
  const planes = [
    new Plane(new Vec3(1, 0, 0), -10),
    new Plane(new Vec3(-1, 0, 0), -10),
    new Plane(new Vec3(0, 1, 0), -10),
    new Plane(new Vec3(0, -1, 0), -10),
    new Plane(new Vec3(0, 0, 1), -10),
    new Plane(new Vec3(0, 0, -1), -10),
  ];
  var brush = new Brush();

  brush = Brush.addPlane(brush, ...planes);
  const actualPlanes = [
    new Plane(new Vec3(-1, -1, -1), -1),
    new Plane(new Vec3(1, 0, 0), -1),
    new Plane(new Vec3(0, 1, 0), -1),
    new Plane(new Vec3(0, 0, 1), -1),
  ];
  brush = Brush.addPlane(brush, ...actualPlanes);

  listElementsMatch(brush.planes, actualPlanes);
});

test("brush with no valid points", () => {
  const planes = [
    new Plane(new Vec3(1, 0, 0), -10),
    new Plane(new Vec3(-1, 0, 0), -10),
    new Plane(new Vec3(0, 1, 0), -10),
    new Plane(new Vec3(0, -1, 0), -10),
    new Plane(new Vec3(0, 0, 1), -10),
    new Plane(new Vec3(0, 0, -1), -10),
  ];
  var brush = new Brush();

  brush = Brush.addPlane(brush, ...planes);

  brush = Brush.addPlane(brush, new Plane(new Vec3(1, 0, 0), 100));

  assert.isNull(brush);
});
