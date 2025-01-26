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

  addPlane(...planes) {
    this.planes.push(...planes);

    // check if any of the existing planes now aren't relevant
    for (let i = this.planes.length - 1; i >= 0; i--) {
      const plane1 = this.planes[i];
      var nonEmptyLine = false;
      // check if the plane produces a non-empty line given the existing planes.
      for (let j = this.planes.length - 1; j >= 0; j--) {
        const plane2 = this.planes[j];
        const edge = PlanarEdge.makePlanarEdge({
          plane1,
          plane2,
          planes: this.planes,
        });
        if (edge !== null) {
          console.log("edge:", edge);
          nonEmptyLine = true;
          break;
        }
      }

      // remove the irrelevant plane.
      if (!nonEmptyLine) {
        this.planes.splice(i, 1);
      } else {
      }
    }
  }
}
