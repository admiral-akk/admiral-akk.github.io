import { vec3 } from "gl-matrix";
vec3.pushAll = (vec, arr) => {
  arr.push(vec[0], vec[1], vec[2]);
};

const temp1 = vec3.create();
const temp2 = vec3.create();
const temp3 = vec3.create();
const temp4 = vec3.create();

const generateRegularPolygon = (vertCount, radius) => {
  const verts = [];

  for (let i = 0; i < vertCount; i++) {
    const angle = (2 * Math.PI * i) / vertCount;
    const v = vec3.create();
    v[0] = Math.cos(angle);
    v[2] = Math.sin(angle);
    vec3.scale(v, v, radius);
    verts.push(v);
  }

  return verts;
};

// [(height, scale, extra)], [vertsInCircle]
const generateSymmetricMesh = (paramArr, verts) => {
  const mesh = [];

  // create base
  if (paramArr.length > 1) {
    const [height, scale, extra] = paramArr[0];
    for (let j = 1; j < verts.length; j++) {
      vec3.copy(temp1, verts[0]);
      vec3.copy(temp2, verts[(j + 1) % verts.length]);
      vec3.copy(temp3, verts[j]);

      vec3.scale(temp1, temp1, scale);
      vec3.scale(temp2, temp2, scale);
      vec3.scale(temp3, temp3, scale);
      temp1[1] = height;
      temp2[1] = height;
      temp3[1] = height;

      vec3.pushAll(temp1, mesh);
      mesh.push(...extra);
      vec3.pushAll(temp2, mesh);
      mesh.push(...extra);
      vec3.pushAll(temp3, mesh);
      mesh.push(...extra);
    }
  }

  for (let i = 1; i < paramArr.length; i++) {
    const [prevHeight, prevScale, extra] = paramArr[i - 1];
    const [height, scale, extra1] = paramArr[i];

    for (let j = 0; j < verts.length; j++) {
      vec3.copy(temp1, verts[j]);
      vec3.copy(temp2, verts[(j + 1) % verts.length]);
      vec3.copy(temp3, temp1);
      vec3.copy(temp4, temp2);

      vec3.scale(temp1, temp1, prevScale);
      vec3.scale(temp2, temp2, prevScale);
      vec3.scale(temp3, temp3, scale);
      vec3.scale(temp4, temp4, scale);
      temp1[1] = prevHeight;
      temp2[1] = prevHeight;
      temp3[1] = height;
      temp4[1] = height;

      vec3.pushAll(temp1, mesh);
      mesh.push(...extra);
      vec3.pushAll(temp3, mesh);
      mesh.push(...extra);
      vec3.pushAll(temp2, mesh);
      mesh.push(...extra);

      vec3.pushAll(temp2, mesh);
      mesh.push(...extra);
      vec3.pushAll(temp3, mesh);
      mesh.push(...extra);
      vec3.pushAll(temp4, mesh);
      mesh.push(...extra);
    }
  }

  // create top
  {
    const [height, scale, extra] = paramArr[paramArr.length - 1];
    for (let j = 1; j < verts.length; j++) {
      vec3.copy(temp1, verts[0]);
      vec3.copy(temp2, verts[(j + 1) % verts.length]);
      vec3.copy(temp3, verts[j]);

      vec3.scale(temp1, temp1, scale);
      vec3.scale(temp2, temp2, scale);
      vec3.scale(temp3, temp3, scale);
      temp1[1] = height;
      temp2[1] = height;
      temp3[1] = height;

      vec3.pushAll(temp1, mesh);
      mesh.push(...extra);
      vec3.pushAll(temp2, mesh);
      mesh.push(...extra);
      vec3.pushAll(temp3, mesh);
      mesh.push(...extra);
    }
  }

  return mesh;
};

export { generateRegularPolygon, generateSymmetricMesh };
