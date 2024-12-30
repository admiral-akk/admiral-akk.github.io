import { vec3 } from "gl-matrix";
import { Bimap } from "../util/bimap";

const instancedMeshes = [];

class InstancedMesh {
  constructor(gl, modelArray, program, maxCount) {
    this.program = program;
    this.meshToIndex = new Bimap();
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
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 36, 0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 36, 12);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 36, 24);
    const transformArray = [];
    const totalSize = 20;
    for (let i = 0; i < maxCount * 20; i++) {
      transformArray.push(0);
    }
    const transformBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(transformArray),
      gl.STATIC_DRAW
    );

    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, totalSize * 4, 0 * 4);
    gl.vertexAttribPointer(4, 4, gl.FLOAT, false, totalSize * 4, 4 * 4);
    gl.vertexAttribPointer(5, 4, gl.FLOAT, false, totalSize * 4, 8 * 4);
    gl.vertexAttribPointer(6, 4, gl.FLOAT, false, totalSize * 4, 12 * 4);
    gl.vertexAttribIPointer(7, 4, gl.INT, totalSize * 4, 16 * 4);

    gl.vertexAttribDivisor(3, 1);
    gl.vertexAttribDivisor(4, 1);
    gl.vertexAttribDivisor(5, 1);
    gl.vertexAttribDivisor(6, 1);
    gl.vertexAttribDivisor(7, 1);

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);
    gl.enableVertexAttribArray(4);
    gl.enableVertexAttribArray(5);
    gl.enableVertexAttribArray(6);
    gl.enableVertexAttribArray(7);

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

  addMesh(mesh) {
    if (this.meshToIndex.getKey(mesh) !== undefined) {
      return;
    }
    this.meshToIndex.set(mesh, this.meshToIndex.size());
    this.updateIndex(this.gl, this.meshToIndex.size() - 1);
  }

  copy(srcIndex, dstIndex) {
    this.transformArray.set(
      this.transformArray.slice(20 * srcIndex, 20 * (srcIndex + 1)),
      20 * dstIndex
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transformBuffer);
    this.gl.bufferSubData(
      this.gl.ARRAY_BUFFER,
      4 * 20 * dstIndex,
      this.transformArray.slice(20 * dstIndex, 20 * (dstIndex + 1))
    );
  }

  removeMesh(mesh) {
    const index = this.meshToIndex.getKey(mesh);
    if (index < this.meshToIndex.size() - 1) {
      this.copy(this.meshToIndex.size() - 1, index);
      const movedMesh = this.meshToIndex.getValue(this.meshToIndex.size() - 1);
      this.meshToIndex.set(movedMesh, index);
    } else {
      this.meshToIndex.removeKey(mesh);
    }
  }

  updateTransform(mesh, newMatrix) {
    const index = this.meshToIndex.getKey(mesh);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transformBuffer);

    const offset = 20 * index;
    this.transformArray.set(newMatrix, offset);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 4 * offset, newMatrix);
  }

  updateIndex(index) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);

    const offset = 20 * index + 16;
    const existingSlice = this.transformArray.slice(offset + 16, offset + 20);
    this.transformArray.set(
      [index, existingSlice[1], existingSlice[2], existingSlice[3]],
      offset
    );
    gl.bufferSubData(
      gl.ARRAY_BUFFER,
      4 * offset,
      new Int32Array([
        index,
        existingSlice[1],
        existingSlice[2],
        existingSlice[3],
      ])
    );
  }

  updateVisibility(index, invisible) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);

    const offset = 20 * index + 16;
    const existingSlice = this.transformArray.slice(offset + 16, offset + 20);
    this.transformArray.set(
      [existingSlice[0], invisible ? 1 : 0, existingSlice[2], existingSlice[3]],
      offset
    );
    gl.bufferSubData(
      gl.ARRAY_BUFFER,
      4 * offset,
      new Int32Array([
        existingSlice[0],
        invisible ? 1 : 0,
        existingSlice[2],
        existingSlice[3],
      ])
    );
  }

  updateFrustum(gl, frustumPlanes) {
    for (let index = 0; index < this.meshes.length; index++) {
      // apply the transform to the bounding box

      const offset = 20 * index;
      const transformMat = this.transformArray.slice(offset, offset + 16);

      const min = vec3.clone(this.boundingBox[0]);
      vec3.transformMat4(min, min, transformMat);

      const max = vec3.clone(this.boundingBox[1]);
      vec3.transformMat4(max, max, transformMat);

      var doubleReject = false;
      // check if there's a plane that rejects all of them.
      for (let i = 0; i < frustumPlanes.length; i++) {
        const offset = vec3.create();
        vec3.sub(offset, frustumPlanes[i][0], min);
        const offset2 = vec3.create();
        vec3.sub(offset2, frustumPlanes[i][0], max);

        const outside = vec3.dot(frustumPlanes[i][1], offset) <= 0;
        const outside2 = vec3.dot(frustumPlanes[i][1], offset2) <= 0;

        doubleReject |= outside && outside2;
        if (doubleReject) {
          break;
        }
      }

      this.updateVisibility(gl, index, doubleReject);
    }
  }

  render(gl) {
    gl.bindVertexArray(this.vao);
    gl.drawArraysInstanced(
      gl.TRIANGLES,
      0,
      this.modelArray.length / 6,
      this.meshToIndex.size()
    );
    gl.bindVertexArray(null);
  }
}

export { InstancedMesh, instancedMeshes };
