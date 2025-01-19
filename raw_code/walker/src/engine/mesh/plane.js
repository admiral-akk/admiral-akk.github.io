import { Vec3 } from "gl-matrix";
import { Line } from "./line";

Vec3.prototype.clone = function () {
  return Vec3.clone(this);
};

export class Plane {
  constructor(norm, offset, metadata = {}) {
    this.norm = norm.normalize();
    this.offset = offset;
    this.metadata = metadata;
  }

  static lineIntersection(plane, line) {
    const { start, dir } = line;
    if (Math.abs(Vec3.dot(plane.norm, dir)) < 0.01) {
      return null;
    }
    const t =
      (plane.offset - Vec3.dot(plane.norm, start)) / Vec3.dot(plane.norm, dir);

    return start.clone().add(dir.clone().scale(t));
  }

  static distanceToPoint(plane, point) {
    return Vec3.dot(plane.norm, point) - plane.offset;
  }

  static planeIntersection(p1, p2, epsilon = 0.0001) {
    // https://math.stackexchange.com/questions/4113140/finding-a-point-on-the-line-of-intersection-of-two-planes#mjx-eqn-G1
    // find the line for p1 x p2

    // 1. Find the line direction
    const lineDir = new Vec3();
    Vec3.cross(lineDir, p1.norm, p2.norm);

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
      p1.norm[other1] * p2.norm[other2] - p1.norm[other2] * p2.norm[other1];

    const point = new Vec3();
    point[other1] =
      (p1.offset * p2.norm[other2] - p2.offset * p1.norm[other2]) / diff;
    point[other2] =
      -(p1.offset * p2.norm[other1] - p2.offset * p1.norm[other1]) / diff;

    return new Line(point, lineDir);
  }
}
