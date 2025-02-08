import { Vec3 } from "gl-matrix";
import { Primative } from "./primative";
import { Line } from "./Line";

export class Plane extends Primative {
  constructor(normal, offset, metadata = {}) {
    super(metadata);
    this.normal = Vec3.clone(normal).normalize();
    this.offset = offset;
  }

  planeIntersection(p2, epsilon = 0.0001) {
    const p1 = this;
    // https://math.stackexchange.com/questions/4113140/finding-a-point-on-the-line-of-intersection-of-two-planes#mjx-eqn-G1
    // find the line for p1 x p2

    // 1. Find the line direction
    const lineDir = new Vec3();
    Vec3.cross(lineDir, p1.normal, p2.normal);

    if (Vec3.magnitude(lineDir) <= epsilon) {
      return null;
    }

    lineDir.normalize();

    // 2. Find the largest absolute value of the line dir
    var largest;
    if (
      Math.abs(lineDir.x) >= Math.abs(lineDir.y) &&
      Math.abs(lineDir.x) >= Math.abs(lineDir.z)
    ) {
      largest = 0;
    } else if (Math.abs(lineDir.y) >= Math.abs(lineDir.z)) {
      largest = 1;
    } else {
      largest = 2;
    }

    const other1 = largest === 0 ? 1 : 0;
    const other2 = largest !== 2 ? 2 : 1;
    const diff =
      p1.normal[other1] * p2.normal[other2] -
      p1.normal[other2] * p2.normal[other1];

    const point = new Vec3();
    point[other1] =
      (p1.offset * p2.normal[other2] - p2.offset * p1.normal[other2]) / diff;
    point[other2] =
      -(p1.offset * p2.normal[other1] - p2.offset * p1.normal[other1]) / diff;

    return new Line(point, lineDir);
  }
}
