import { mat4, vec3 } from "gl-matrix";
import { Component } from "../ecs/component";

export class Collider extends Component {
  constructor() {
    super();
  }

  // returns the hit location and normal, if one exists.
  raycast(origin, dir, transformMat = mat4.create()) {}

  getName() {
    return "collider";
  }
}

const posY = vec3.clone([0, 1, 0]);
const negY = vec3.clone([0, -1, 0]);
const posX = vec3.clone([1, 0, 0]);
const negX = vec3.clone([-1, 0, 0]);
const posZ = vec3.clone([0, 0, 1]);
const negZ = vec3.clone([0, 0, -1]);

const dirs = [posY, negY, posX, negX, posZ, negZ];

const eps = 0.001;

const checkPlaneCollision = (start, dir, planePoint, planeNormal) => {
  const dist = vec3.dot(planeNormal, dir);
  // colinear check + going away from plane
  if (dist > -eps) {
    return null;
  }

  const tempPos = vec3.create();
  vec3.sub(tempPos, planePoint, start);

  const normDist = vec3.dot(planeNormal, tempPos);

  // the start is behind the plan
  if (normDist > -eps) {
    return null;
  }

  vec3.scaleAndAdd(tempPos, start, dir, normDist / dist);

  return [tempPos, vec3.clone(planeNormal)];
};

const tempTranslation = vec3.create();

export class BoxCollider extends Collider {
  constructor(size = [Math.sqrt(3) / 2, 0.25, Math.sqrt(3) / 2]) {
    super();
    // assume every collider is a standard size and symmetric about origin
    // TODO: allow for custom size.
    this.dims = vec3.clone(size);
  }

  // returns the hit location and normal, if one exists.
  raycast(origin, dir, transformMat) {
    var bestResult = null;
    for (let i = 0; i < dirs.length; i++) {
      const normal = vec3.clone(dirs[i]);

      // calculate offset distance pre-rotation
      const offset = Math.abs(vec3.dot(this.dims, normal));

      // TODO: handle rotation, scale
      mat4.getTranslation(tempTranslation, transformMat);
      vec3.scaleAndAdd(tempTranslation, tempTranslation, normal, offset);

      const result = checkPlaneCollision(origin, dir, tempTranslation, normal);
      if (result !== null) {
        // check if the plane hit is within bounds
        vec3.sub(tempTranslation, tempTranslation, result[0]);

        vec3.abs(tempTranslation, tempTranslation);
        vec3.div(tempTranslation, tempTranslation, this.dims);
        const m = Math.max(
          tempTranslation[0],
          tempTranslation[1],
          tempTranslation[2]
        );

        // check best result
        if (m <= 1) {
          if (bestResult !== null) {
            const lastHit = bestResult[0];
            const newHit = result[0];
            if (
              vec3.distance(newHit, origin) < vec3.distance(lastHit, origin)
            ) {
              bestResult = result;
            }
          } else {
            bestResult = result;
          }
        }
      }
    }
    return bestResult;
  }
}
