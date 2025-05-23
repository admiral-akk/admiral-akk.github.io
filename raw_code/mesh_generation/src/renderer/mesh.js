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
const v21 = vec3.create();
const calculateNormal = ([v1, v2, v3]) => {
  const norm = vec3.create();
  vec3.sub(v21, v1, v2);
  vec3.sub(norm, v1, v3);
  vec3.cross(norm, norm, v21);
  vec3.normalize(norm, norm);
  return norm;
};

const hexToNum = (hexString) => {
  return Number("0x" + hexString) / 255;
};

const addTriangle = (verts, color, mesh) => {
  const norm = calculateNormal(verts);
  for (let i = 0; i < verts.length; i++) {
    vec3.pushAll(verts[i], mesh);
    vec3.pushAll(norm, mesh);
    if (typeof color === "string") {
      color = color.replace("#", "");
      color = [
        hexToNum(color.slice(0, 2)),
        hexToNum(color.slice(2, 4)),
        hexToNum(color.slice(4, 6)),
      ];
    }
    mesh.push(...color);
  }
};

const generateLineMesh = (vertCount) => {
  const mesh = [];
  // create base
  const color = [1, 1, 1];

  for (let i = 0; i < vertCount; i++) {
    const temp1 = vec3.clone([-1, i / vertCount, 0]);
    const temp2 = vec3.clone([1, i / vertCount, 0]);
    const temp3 = vec3.clone([-1, (i + 1) / vertCount, 0]);
    const temp4 = vec3.clone([1, (i + 1) / vertCount, 0]);

    addTriangle([temp1, temp3, temp2], color, mesh);
    addTriangle([temp2, temp3, temp4], color, mesh);
    addTriangle([temp1, temp2, temp3], color, mesh);
    addTriangle([temp2, temp4, temp3], color, mesh);
  }

  return mesh;
};

// [(height, scale, extra)], [vertsInCircle]
const generateSymmetricMesh = (paramArr, verts) => {
  const mesh = [];
  // create base

  for (let i = 1; i < paramArr.length; i++) {
    const [prevHeight, prevScale, color] = paramArr[i - 1];
    const [height, scale, _] = paramArr[i];

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

      addTriangle([temp1, temp3, temp2], color, mesh);
      addTriangle([temp2, temp3, temp4], color, mesh);
    }
  }

  return mesh;
};

export { generateRegularPolygon, generateSymmetricMesh, generateLineMesh };
