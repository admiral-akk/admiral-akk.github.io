import { mat4, vec3, vec4 } from "gl-matrix";
import { Collider } from "./components/collider";
import { Transform } from "./components/render/transform";
import { Clickable } from "./components/client/clickable";
import { getEntitiesWith } from "./engine/ecs/entity";
import { gl } from "./engine/renderer";

// https://stackoverflow.com/a/56348846
const getWorldRayFromCamera = ({ transform, camera }, viewPos) => {
  const viewX = 2 * (viewPos[0] - 0.5);

  // invert y
  const viewY = 2 * (0.5 - viewPos[1]);

  const near = vec4.clone([viewX, viewY, -1, 1]);
  const far = vec4.clone([viewX, viewY, 1, 1]);
  const projection = camera.getViewProjectionMatrix(gl);

  mat4.invert(projection, projection);

  vec4.transformMat4(near, near, projection);
  vec4.transformMat4(far, far, projection);

  vec4.scale(near, near, 1 / near[3]);
  vec4.scale(far, far, 1 / far[3]);
  vec4.sub(far, far, near);

  const dir = vec3.clone([far[0], far[1], far[2]]);

  vec3.normalize(dir, dir);

  const worldPos = transform.getWorldPosition();
  return [worldPos, dir];
};

const getRayCollision = (start, dir) => {
  var best = null;
  getEntitiesWith(Collider, Transform, Clickable).forEach((entity) => {
    const { collider, transform } = entity.components;
    if (collider && transform) {
      const r = collider.raycast(start, dir, transform.getWorldMatrix());
      if (r) {
        if (!best) {
          best = [collider, r];
        } else if (
          vec3.distance(start, best[1][0]) > vec3.distance(start, r[0])
        ) {
          best = [collider, r];
        }
      }
    }
  });
  return best;
};

export const getCollision = (state, transform, camera) => {
  if (!state?.mpos_clamped?.val) {
    return null;
  }
  const [worldPos, worldDir] = getWorldRayFromCamera(
    { transform, camera },
    state.mpos_clamped.val
  );

  return getRayCollision(worldPos, worldDir);
};
