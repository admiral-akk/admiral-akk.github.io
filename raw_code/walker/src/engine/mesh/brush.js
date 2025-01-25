import { Vec3 } from "gl-matrix";
import { EdgePlane, Plane } from "./plane";
import { Triangle } from "./triangle";
import "../../util/array.js";

function planeIntersection(p1, p2, p3) {
  const line = Plane.planeIntersection(p1, p2);

  return line === null ? null : Plane.lineIntersection(p3, line);
}

export class Brush {
  constructor(planes) {
    this.planes = planes;
  }

  applyTransform(scale, rotation, translation) {
    this.planes.forEach((p) => p.applyTransform(scale, rotation, translation));
  }

  static regularPrism(radius, sides, height, metadata = {}) {
    const planes = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * Math.PI * 2) / sides;
      planes.push(
        new Plane(
          new Vec3(Math.sin(angle), 0, Math.cos(angle)),
          -radius,
          metadata
        )
      );
    }
    planes.push(
      new Plane(new Vec3(0, 1, 0), -height / 2, metadata),
      new Plane(new Vec3(0, -1, 0), -height / 2, metadata)
    );
    return new Brush(planes);
  }

  clone() {
    return new Brush(Array.from(this.planes.map((p) => p.clone())));
  }

  planePoints() {
    // generate verts at the interesection of 3 planes, with a link to the generating planes

    const planeToPoints = new Map();
    const planeToEdges = new Map();
    const planes = this.planes;
    const pointsToPlanes = new Map();
    planes.forEach((p) => {
      planeToPoints.set(p, []);
      planeToEdges.set(p, []);
    });
    for (let i = 0; i < planes.length; i++) {
      const p1 = planes[i];
      for (let j = i + 1; j < planes.length; j++) {
        const p2 = planes[j];
        for (let k = j + 1; k < planes.length; k++) {
          const p3 = planes[k];
          const p = planeIntersection(p1, p2, p3);
          if (p === null) {
          } else {
            planeToPoints.get(p1).push(p);
            planeToPoints.get(p2).push(p);
            planeToPoints.get(p3).push(p);
            pointsToPlanes.set(p, [p1, p2, p3]);
          }
        }
      }
    }

    // eliminate all vertices that are excluded by another plane
    for (const [point, pointPlanes] of pointsToPlanes.entries()) {
      for (let i = 0; i < planes.length; i++) {
        if (Plane.distanceToPoint(planes[i], point) <= -0.001) {
          planeToPoints.get(pointPlanes[0]).remove(point);
          planeToPoints.get(pointPlanes[1]).remove(point);
          planeToPoints.get(pointPlanes[2]).remove(point);
          pointsToPlanes.delete(point);
        }
      }
    }

    return [planeToPoints, pointsToPlanes];
  }

  edges() {
    const edges = [];
    this.planes.forEach((p1) => {
      this.planes.forEach((p2) => {
        if (p1 === p2) {
          return;
        }
        const line = Plane.planeIntersection(p1, p2);
        if (line === null) {
          return;
        }

        var maxT = 1000000;
        var maxPlane = null;
        var minT = -10000000;
        var minPlane = null;
        this.planes.forEach((p3) => {
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
      });
    });

    return edges;
    // 1. For each plane, find the plane intersections
    // 2. For each intersection, cut it into segments using the other planes
    // 3. filter down to the planes that create non-zero line segments
    // 4. recompute the line segments using just those planes, and note which planes cause the segment to truncate at the end.
    //  [ A | e_X | B, X | e_B | C, B | e_C | A, C | e_A | X ]
    // 5. chain the edges together to form a face
  }

  triangles() {
    // generate verts at the interesection of 3 planes, with a link to the generating planes

    const planeToEdges = new Map();
    const planes = this.planes;

    const [planeToPoints, pointsToPlanes] = this.planePoints();

    // triangulate the faces
    const triangles = [];
    planes.forEach((p) => {
      const planeVerts = planeToPoints.get(p);
      if (planeVerts.length < 3) {
        return;
      }
      const average = new Vec3();
      planeVerts.forEach((v) => average.add(v));
      average.scale(1 / planeVerts.length);

      const forward = new Vec3();
      Vec3.sub(forward, average, planeVerts[0]);
      forward.normalize();

      const sortVal = (v) => {
        const dir = new Vec3();
        const temp2 = new Vec3();
        Vec3.sub(dir, average, v);
        dir.normalize();
        Vec3.cross(temp2, dir, forward);
        const cross = Vec3.dot(p.norm, temp2);
        const dot = Vec3.dot(dir, forward);
        var ret;
        if (dot < 0) {
          if (cross < 0) {
            ret = -2 - cross;
          } else {
            ret = 2 - cross;
          }
        } else {
          ret = cross;
        }
        return ret;
      };
      // sort around the norm?
      planeVerts.sort((a, b) => {
        return sortVal(a) - sortVal(b);
      });

      for (let i = 1; i < planeVerts.length - 1; i++) {
        const v1 = planeVerts[0];
        const v2 = planeVerts[i % planeVerts.length];
        const v3 = planeVerts[(i + 1) % planeVerts.length];

        const pointMetadata = new Map();

        pointMetadata.set(v1, {
          color: p.metadata.color,
          normal: p.norm,
        });
        pointMetadata.set(v2, {
          color: p.metadata.color,
          normal: p.norm,
        });
        pointMetadata.set(v3, {
          color: p.metadata.color,
          normal: p.norm,
        });

        triangles.push(new Triangle(v1, v2, v3, pointMetadata));
      }
    });
    return triangles;
  }
}
