import { Vec3 } from "gl-matrix";
import { Primative } from "./primative";

export class PlanarEdge extends Primative {
  static makePlanarEdge(
    { plane1, plane2, planes, metadata = {} },
    epsilon = 0.0001
  ) {
    // check if there is an edge between the planes

    const line = plane1.planeIntersection(plane2);

    if (line === null) {
      return null;
    }

    var start = null;
    var end = null;

    for (let i = 0; i < planes.length; i++) {
      const p = planes[i];
      const t = line.lineToPlaneT(p);
      if (t === null) {
        // check which side of the plane the line is on. If the plane cuts the line off
        // entirely, then remove it.
        if (Vec3.dot(line.start, p.normal) + epsilon < p.offset) {
          return null;
        } else {
          continue;
        }
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
    }

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
