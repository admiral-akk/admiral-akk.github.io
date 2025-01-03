import { vec3 } from "gl-matrix";
import { Bimap } from "../util/bimap";

const instancedMeshes = [];

const totalModelAttribSize = 12;
const totalInstanceAttribSize = 24;

class InstancedMesh {
  constructor(gl, modelArray) {
    const maxCount = 1;
    this.meshToIndex = new Bimap();
    instancedMeshes.push(this);
    this.gl = gl;
    const modelBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(modelArray),
      gl.STATIC_DRAW
    );
    this.transformArray = new Float32Array(maxCount * totalInstanceAttribSize);
    const transformBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      4 * this.transformArray.length,
      gl.STATIC_DRAW
    );

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
    this.transformBuffer = transformBuffer;
    this.maxCount = maxCount;
    this.regenerateVao();
  }

  regenerateVao() {
    const { gl } = this;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.modelBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, totalModelAttribSize * 3, 0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, totalModelAttribSize * 3, 12);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, totalModelAttribSize * 3, 24);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);

    gl.vertexAttribPointer(
      3,
      4,
      gl.FLOAT,
      false,
      totalInstanceAttribSize * 4,
      0 * 4
    );
    gl.vertexAttribPointer(
      4,
      4,
      gl.FLOAT,
      false,
      totalInstanceAttribSize * 4,
      4 * 4
    );
    gl.vertexAttribPointer(
      5,
      4,
      gl.FLOAT,
      false,
      totalInstanceAttribSize * 4,
      8 * 4
    );
    gl.vertexAttribPointer(
      6,
      4,
      gl.FLOAT,
      false,
      totalInstanceAttribSize * 4,
      12 * 4
    );
    gl.vertexAttribIPointer(7, 4, gl.INT, totalInstanceAttribSize * 4, 16 * 4);
    gl.vertexAttribPointer(
      8,
      4,
      gl.FLOAT,
      false,
      totalInstanceAttribSize * 4,
      20 * 4
    );

    gl.vertexAttribDivisor(3, 1);
    gl.vertexAttribDivisor(4, 1);
    gl.vertexAttribDivisor(5, 1);
    gl.vertexAttribDivisor(6, 1);
    gl.vertexAttribDivisor(7, 1);
    gl.vertexAttribDivisor(8, 1);

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);
    gl.enableVertexAttribArray(4);
    gl.enableVertexAttribArray(5);
    gl.enableVertexAttribArray(6);
    gl.enableVertexAttribArray(7);
    gl.enableVertexAttribArray(8);

    gl.bindVertexArray(null);
    this.vao = vao;
  }

  resize() {
    const { gl } = this;
    const newCount = this.maxCount * 2;
    const newTransformArray = new Float32Array(
      newCount * totalInstanceAttribSize
    );
    newTransformArray.set(this.transformArray, 0);
    const newTransformBuffer = gl.createBuffer();

    gl.bindBuffer(gl.COPY_READ_BUFFER, this.transformBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, newTransformBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      4 * newTransformArray.length,
      gl.STATIC_DRAW
    );
    gl.copyBufferSubData(
      gl.COPY_READ_BUFFER,
      gl.ARRAY_BUFFER,
      0,
      0,
      4 * this.transformArray.length
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.COPY_READ_BUFFER, null);
    this.transformArray = newTransformArray;
    this.transformBuffer = newTransformBuffer;
    this.maxCount = newCount;
    this.regenerateVao();
  }

  addMesh(mesh) {
    if (this.meshToIndex.size() === this.maxCount) {
      this.resize();
    }
    if (this.meshToIndex.getKey(mesh) !== undefined) {
      return;
    }
    this.meshToIndex.set(mesh, this.meshToIndex.size());
    this.updateIndex(this.gl, this.meshToIndex.size() - 1);
  }

  copy(srcIndex, dstIndex) {
    this.transformArray.set(
      this.transformArray.slice(
        totalInstanceAttribSize * srcIndex,
        totalInstanceAttribSize * (srcIndex + 1)
      ),
      totalInstanceAttribSize * dstIndex
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transformBuffer);
    this.gl.bufferSubData(
      this.gl.ARRAY_BUFFER,
      4 * totalInstanceAttribSize * dstIndex,
      this.transformArray.slice(
        totalInstanceAttribSize * dstIndex,
        totalInstanceAttribSize * (dstIndex + 1)
      )
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

    const offset = totalInstanceAttribSize * index;
    this.transformArray.set(newMatrix, offset);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 4 * offset, newMatrix);
  }

  updateIndex(index) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);

    const offset = totalInstanceAttribSize * index + 16;
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

  updateColor(mesh, color) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);

    const index = this.meshToIndex.getKey(mesh);
    const offset = totalInstanceAttribSize * index + 20;
    gl.bufferSubData(
      gl.ARRAY_BUFFER,
      4 * offset,
      this.transformArray.slice(offset, offset + 4)
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
