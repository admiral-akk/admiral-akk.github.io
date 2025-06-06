import { Quat, Vec3 } from "gl-matrix";
import { Line } from "./line";

Vec3.prototype.clone = function () {
  return Vec3.clone(this);
};

export class EdgePlane {
  constructor(plane1, plane2, start, end) {
    this.plane1 = plane1;
    this.plane2 = plane2;
    this.start = start;
    this.end = end;
  }
}

export class Plane {
  constructor(norm, offset, metadata = {}) {
    this.norm = norm.normalize();
    this.offset = offset;
    this.metadata = metadata;
  }

  static edgeIntersection(p1, p2, planes) {
    const line = Plane.planeIntersection(p1, p2);
    if (line === null) {
      return null;
    }

    var maxT = 1000000;
    var maxPlane = null;
    var minT = -10000000;
    var minPlane = null;
    planes.forEach((p3) => {
      const intersection = Plane.lineIntersectionT(p3, line);
      if (intersection === null) {
        return;
      }
      if (Vec3.dot(p3.norm, line.dir) > 0) {
        if (intersection > minT) {
          minT = intersection;
          minPlane = p3;
        }
      } else {
        if (intersection < maxT) {
          maxT = intersection;
          maxPlane = p3;
        }
      }
    });

    if (maxT - minT > 0.001) {
      edges.push(new EdgePlane(p1, p2, minPlane, maxPlane));
    }

    return edges;
  }

  clone() {
    return new Plane(Vec3.clone(this.norm), this.offset, this.metadata);
  }

  applyTransform(scale, rotation, translation) {
    // this.offset *= Vec3.dot(this.norm, scale);
    Vec3.transformQuat(this.norm, this.norm, rotation);
    this.offset += Vec3.dot(this.norm, translation);
  }

  applyInverseTransform(scale, rotation, translation) {
    this.offset -= Vec3.dot(this.norm, translation);
    const inverseRotation = Quat.clone(rotation).invert();
    Vec3.transformQuat(this.norm, this.norm, inverseRotation);
    // this.offset /= Vec3.dot(scale, translation);
  }

  static invert(plane) {
    return new Plane(
      plane.norm.clone().scale(-1),
      -plane.offset,
      plane.metadata
    );
  }

  static fromPoints(p1, p2, p3, metadata = {}, epsilon = 0.0001) {
    const normal = Vec3.clone(p1).sub(p2);
    const delta2 = Vec3.clone(p1).sub(p3);
    Vec3.cross(normal, normal, delta2);
    if (Vec3.magnitude(normal) < epsilon) {
      return null;
    }
    normal.normalize();
    return new Plane(normal, Vec3.dot(normal, p1), metadata);
  }

  static lineIntersectionT(plane, line) {
    const { start, dir } = line;
    if (Math.abs(Vec3.dot(plane.norm, dir)) < 0.01) {
      return null;
    }
    return (
      (plane.offset - Vec3.dot(plane.norm, start)) / Vec3.dot(plane.norm, dir)
    );
  }

  static lineIntersection(plane, line) {
    const { start, dir } = line;
    const t = Plane.lineIntersectionT(plane, line);
    if (t === null) {
      return t;
    }

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
