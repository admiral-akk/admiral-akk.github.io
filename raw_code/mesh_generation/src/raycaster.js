// https://stackoverflow.com/a/56348846
const getWorldRayFromCamera = (cameraEntity, viewPos) => {
  const { camera, transform } = cameraEntity.components;

  const viewX = 2 * (viewPos[0] - 0.5);

  // invert y
  const viewY = 2 * (0.5 - viewPos[1]);

  const near = vec4.clone([viewX, viewY, -1, 1]);
  const far = vec4.clone([viewX, viewY, 1, 1]);
  const view = transform.getWorldMatrix();
  const projection = mat4.clone(camera.projection);

  mat4.multiply(projection, projection, view);
  mat4.invert(projection, projection);

  vec4.transformMat4(near, near, projection);
  vec4.transformMat4(far, far, projection);

  vec4.scale(near, near, 1 / near[3]);
  vec4.scale(far, far, 1 / far[3]);
  vec4.sub(far, far, near);

  const dir = vec3.clone([far[0], far[1], far[2]]);

  vec3.normalize(dir, dir);

  return [vec3.clone(transform.pos), dir];
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

const getCollision = (state) => {
  const [worldPos, worldDir] = getWorldRayFromCamera(
    cameraEntity,
    state.mpos.val
  );

  return getRayCollision(worldPos, worldDir);
};
