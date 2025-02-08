import { Vec3 } from "gl-matrix";
import { Plane } from "./Plane";
import { Primative } from "./primative";
import { PlanarEdge } from "./planarEdge";

export class Brush extends Primative {
  constructor(metadata = {}) {
    super(metadata);
    this.planes = [
      new Plane(new Vec3(1, 0, 0), -100000),
      new Plane(new Vec3(-1, 0, 0), -100000),
      new Plane(new Vec3(0, 1, 0), -100000),
      new Plane(new Vec3(0, -1, 0), -100000),
      new Plane(new Vec3(0, 0, 1), -100000),
      new Plane(new Vec3(0, 0, -1), -100000),
    ];
  }

  static clone(brush) {
    return Brush.addPlane(new Brush(brush.metadata), ...brush.planes);
  }

  // could return null
  static addPlane(brush, ...planes) {
    brush.planes.push(...planes);

    var hasLine = false;
    // check if any lines still exist
    for (let i = brush.planes.length - 1; i >= 0; i--) {
      const plane1 = brush.planes[i];
      // check if the plane produces a non-empty line given the existing planes.
      for (let j = brush.planes.length - 1; j >= 0; j--) {
        const plane2 = brush.planes[j];
        const edge = PlanarEdge.makePlanarEdge({
          plane1,
          plane2,
          planes: brush.planes,
        });
        if (edge !== null) {
          hasLine = true;
          break;
        }
      }
      if (hasLine) {
        break;
      }
    }

    if (!hasLine) {
      return null;
    }

    // check if any of the existing planes now aren't relevant
    for (let i = brush.planes.length - 1; i >= 0; i--) {
      const plane1 = brush.planes[i];
      var nonEmptyLine = false;
      // check if the plane produces a non-empty line given the existing planes.
      for (let j = brush.planes.length - 1; j >= 0; j--) {
        const plane2 = brush.planes[j];
        const edge = PlanarEdge.makePlanarEdge({
          plane1,
          plane2,
          planes: brush.planes,
        });
        if (edge !== null) {
          nonEmptyLine = true;
          break;
        }
      }

      // remove the irrelevant plane.
      if (!nonEmptyLine) {
        brush.planes.splice(i, 1);
      }
    }

    return brush;
  }
}
