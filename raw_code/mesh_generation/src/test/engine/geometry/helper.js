import { Vec3 } from "gl-matrix";

export const distance = (v1, v2) => {
  var actualDistance;

  if (v1 instanceof Vec3) {
    actualDistance = Vec3.distance(v1, v2);
  } else {
    throw new Error(
      `Unknown actual type: ${JSON.stringify(
        v1,
        null,
        2
      )}, v2: ${JSON.stringify(v2, null, 2)}`
    );
  }

  return actualDistance;
};
