import { mat4, vec3, vec4 } from "gl-matrix";

const temp = vec4.create();
const temp2 = vec4.create();
const temp3 = vec4.create();
const tempMat = mat4.create();

const posY = vec3.clone([0, 1, 0]);
const negY = vec3.clone([0, -1, 0]);
const posX = vec3.clone([1, 0, 0]);
const negX = vec3.clone([-1, 0, 0]);
const posZ = vec3.clone([0, 0, 1]);
const negZ = vec3.clone([0, 0, -1]);

const instancedMeshes = [];

class InstancedMesh {
  constructor(gl, modelArray, maxCount) {
    instancedMeshes.push(this);
    const vao = gl.createVertexArray();
    this.gl = gl;
    gl.bindVertexArray(vao);
    const modelBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(modelArray),
      gl.STATIC_DRAW
    );
    this.meshes = [];
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    const transformArray = [];
    for (let i = 0; i < maxCount; i++) {
      const model = mat4.create();
      for (let j = 0; j < model.length; j++) {
        transformArray.push(model[j]);
      }
      transformArray.push(0, 0, 0, 0);
    }
    const transformBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(transformArray),
      gl.STATIC_DRAW
    );

    const totalSize = 20;
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, totalSize * 4, 0 * 4);
    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, totalSize * 4, 4 * 4);
    gl.vertexAttribPointer(4, 4, gl.FLOAT, false, totalSize * 4, 8 * 4);
    gl.vertexAttribPointer(5, 4, gl.FLOAT, false, totalSize * 4, 12 * 4);
    gl.vertexAttribIPointer(6, 4, gl.INT, totalSize * 4, 16 * 4);

    gl.vertexAttribDivisor(2, 1);
    gl.vertexAttribDivisor(3, 1);
    gl.vertexAttribDivisor(4, 1);
    gl.vertexAttribDivisor(5, 1);
    gl.vertexAttribDivisor(6, 1);

    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);
    gl.enableVertexAttribArray(4);
    gl.enableVertexAttribArray(5);
    gl.enableVertexAttribArray(6);

    gl.bindVertexArray(null);

    var minX = 100000000;
    var minY = 100000000;
    var minZ = 100000000;
    var maxX = -100000000;
    var maxY = -100000000;
    var maxZ = -100000000;
    for (let i = 0; i < modelArray.length / 3; i++) {
      const x = modelArray[3 * i];
      const y = modelArray[3 * i + 1];
      const z = modelArray[3 * i + 2];

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      minZ = Math.min(minZ, z);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      maxZ = Math.max(maxZ, z);
    }

    this.boundingBox = [
      [minX, minY, minZ],
      [maxX, maxY, maxZ],
    ];
    this.modelArray = modelArray;
    this.modelBuffer = modelBuffer;
    this.transformArray = new Float32Array(transformArray);
    this.transformBuffer = transformBuffer;
    this.vao = vao;
    this.maxCount = maxCount;
  }

  addMesh(gl, mesh) {
    this.meshes.push(mesh);
    this.updateIndex(gl, this.meshes.length - 1);
    return this.meshes.length - 1;
  }

  removeMesh(gl, index) {
    if (index < this.meshes.length - 1) {
      this.meshes[index] = this.meshes[this.meshes.length - 1];
      this.meshes[index].updateIndex(index);

      const offset = 20 * (this.meshes.length - 1);
      const transformMat = this.transformArray.slice(offset, offset + 16);
      this.updateTransform(index, transformMat);
      this.updateIndex(gl, index);
    }
    this.meshes.pop();
  }

  updateTransform(index, newMatrix) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transformBuffer);

    const offset = 4 * 20 * index;
    this.transformArray.set(newMatrix, offset / 4);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, offset, newMatrix);
  }

  updateIndex(gl, index) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);

    const offset = 20 * index + 16;
    this.transformArray.set([index, 0, 0, 0], offset);
    gl.bufferSubData(
      gl.ARRAY_BUFFER,
      4 * offset,
      new Int32Array([index, 0, 0, 0])
    );
  }

  render(gl) {
    gl.bindVertexArray(this.vao);
    gl.drawArraysInstanced(
      gl.TRIANGLES,
      0,
      this.modelArray.length / 6,
      this.meshes.length
    );
    gl.bindVertexArray(null);
  }
}

const eps = 0.0001;

// assumes plane is on the origin
function planeIntersection(start, dir, planeNorm) {
  const dot = -vec3.dot(dir, planeNorm);

  // if negative or colinear, doesn't hit
  if (dot < eps) {
    return null;
  }

  const distToPlane = vec3.dot(start, planeNorm);

  const hit = vec3.create();

  vec3.scaleAndAdd(hit, start, dir, distToPlane / dot);

  return hit;
}

const temp4 = vec3.create();

const dirs = [
  [negX, negY, negZ],
  [posX, posY, posZ],
];

function intersection(start, dir, boundingBox) {
  var closestIntersection = null;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 3; j++) {
      const normal = dirs[i][j];
      const normalDist = boundingBox[i][j];

      if (i === 0) {
        vec3.scaleAndAdd(temp4, start, normal, normalDist);
      } else {
        vec3.scaleAndAdd(temp4, start, normal, -normalDist);
      }

      const intersection = planeIntersection(temp4, dir, normal);
      if (intersection !== null) {
        // check if it's in bounds

        var inBox = true;
        for (let k = 0; k < 3; k++) {
          if (k === j) {
            continue;
          }
          const min = boundingBox[0][k];
          const max = boundingBox[1][k];
          inBox &= min <= intersection[k];
          inBox &= intersection[k] <= max;
        }
        if (inBox) {
          if (i === 0) {
            vec3.scaleAndAdd(intersection, intersection, normal, -normalDist);
          } else {
            vec3.scaleAndAdd(intersection, intersection, normal, normalDist);
          }
          if (closestIntersection === null) {
            closestIntersection = intersection;
          } else {
            const test = vec3.create();
            const test2 = vec3.create();
            vec3.subtract(test, start, closestIntersection);
            vec3.subtract(test2, start, intersection);
            if (vec3.length(test) > vec3.length(test2)) {
              closestIntersection = intersection;
            }
          }
        }
      }
    }
  }

  return closestIntersection;
}

export { InstancedMesh, instancedMeshes };
