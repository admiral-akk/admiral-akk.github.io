import { Vec3 } from "gl-matrix";
import { Primative } from "./primative";

export class PlanarEdge extends Primative {
  static makePlanarEdge({ plane1, plane2, planes, metadata }) {
    return null;
  }

  constructor(plane1, plane2, start, end, metadata = {}) {
    super(metadata);
    this.plane1 = plane1;
    this.plane2 = plane2;
    this.start = start;
    this.end = end;
  }
}
