import { Vec3 } from "gl-matrix";
import { Primative } from "./primative";

export class PlanarEdge extends Primative {
  static makePlanarEdge({ plane1, plane2, planes, metadata }) {
    // check if there is an edge between the planes

    const line = plane1.planeIntersection(plane2);

    if (line === null) {
      return null;
    }

    var start = null;
    var end = null;

    planes.forEach((p) => {
      const t = line.lineToPlaneT(p);
      if (t === null) {
        return;
      }
      if (Vec3.dot(p.normal, line.dir) > 0) {
        // start
        if (start === null || line.lineToPlaneT(start) < t) {
          start = p;
        }
      } else {
        // end
        if (end === null || line.lineToPlaneT(end) > t) {
          end = p;
        }
      }
    });

    if (
      start !== null &&
      end !== null &&
      line.lineToPlaneT(start) + 0.001 > line.lineToPlaneT(end)
    ) {
      return null;
    }

    return new PlanarEdge(plane1, plane2, start, end, metadata);
  }

  constructor(plane1, plane2, start, end, metadata = {}) {
    super(metadata);
    this.plane1 = plane1;
    this.plane2 = plane2;
    this.start = start;
    this.end = end;
  }
}
