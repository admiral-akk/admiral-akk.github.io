import { Vec3 } from "gl-matrix";
import { Plane } from "./plane";
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
            console.log(p, [p1, p2, p3]);
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

    // if two vertices share a generating plane, that forms an edge between those planes
    const edges = [];
    for (let i = 0; i < planes.length; i++) {
      const p1 = planes[i];
      for (let j = i + 1; j < planes.length; j++) {
        const p2 = planes[j];
        var filteredArray = planeToPoints.get(p1).filter(function (n) {
          return planeToPoints.get(p2).indexOf(n) !== -1;
        });
        if (filteredArray.length > 0) {
          planeToEdges.get(p1).push([filteredArray[0], filteredArray[1], p2]);
          planeToEdges.get(p2).push([filteredArray[0], filteredArray[1], p1]);
        }
      }
    }

    // all planes in a brush are valid?
    // find one on the bottom
    var minPlane = planes[0];
    planes.forEach((p) => {
      if (minPlane.norm.y * minPlane.offset > p.norm.y * p.offset) {
        minPlane = p;
      }
    });

    // find 3 verts on that plane to start the gift wrapping

    // wrap verts in a convex hull via gift wrapping
    // gift wrapping algorithm:
    // 1. find a triangle on the boundary
    // 2. add its edges to the queue
    // while the queue isn't empty
    //   3. find the best triangle
    //   4. if any of its edges are in the queue, remove them
    //   5. add the remaining edges to the queue

    // return triangles
  }
}
