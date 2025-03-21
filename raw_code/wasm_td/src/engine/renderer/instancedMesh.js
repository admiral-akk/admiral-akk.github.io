import { Vec3, vec3 } from "gl-matrix";
import { Bimap } from "../../util/bimap";
import { gl } from "../renderer";
import { AABB } from "../aabb";

const instancedMeshes = [];

const totalModelAttribSize = 8;
const totalInstanceAttribSize = 32;

class InstancedMesh {
  constructor(gl, modelArray) {
    const maxCount = 1;
    this.meshCount = 0;
    this.modelArrayLength = modelArray.length;
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
      Vec3.clone([minX, minY, minZ]),
      Vec3.clone([maxX, maxY, maxZ]),
    ];
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
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, totalModelAttribSize * 4, 0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, totalModelAttribSize * 4, 12);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, totalModelAttribSize * 4, 24);
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
    gl.vertexAttribPointer(
      7,
      4,
      gl.FLOAT,
      false,
      totalInstanceAttribSize * 4,
      16 * 4
    );
    gl.vertexAttribPointer(
      8,
      4,
      gl.FLOAT,
      false,
      totalInstanceAttribSize * 4,
      20 * 4
    );
    gl.vertexAttribPointer(
      9,
      4,
      gl.FLOAT,
      false,
      totalInstanceAttribSize * 4,
      24 * 4
    );
    gl.vertexAttribPointer(
      10,
      4,
      gl.FLOAT,
      false,
      totalInstanceAttribSize * 4,
      28 * 4
    );

    gl.vertexAttribDivisor(3, 1);
    gl.vertexAttribDivisor(4, 1);
    gl.vertexAttribDivisor(5, 1);
    gl.vertexAttribDivisor(6, 1);
    gl.vertexAttribDivisor(7, 1);
    gl.vertexAttribDivisor(8, 1);
    gl.vertexAttribDivisor(9, 1);
    gl.vertexAttribDivisor(10, 1);

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);
    gl.enableVertexAttribArray(4);
    gl.enableVertexAttribArray(5);
    gl.enableVertexAttribArray(6);
    gl.enableVertexAttribArray(7);
    gl.enableVertexAttribArray(8);
    gl.enableVertexAttribArray(9);
    gl.enableVertexAttribArray(10);

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

  createMesh(mesh) {
    this.meshCount++;
    this.addMesh(mesh);
  }

  addMesh(mesh) {
    if (this.meshToIndex.size() === this.maxCount) {
      this.resize();
    }
    if (this.meshToIndex.getKey(mesh) !== undefined) {
      return;
    }
    this.meshToIndex.set(mesh, this.meshToIndex.size());
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

  updateMetadata(mesh, metadata) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);

    const index = this.meshToIndex.getKey(mesh);
    const offset = totalInstanceAttribSize * index + 16;
    if (metadata.length > 16) {
      throw new Error("TOO LONG");
    }
    this.transformArray.set(metadata, offset);
    gl.bufferSubData(gl.ARRAY_BUFFER, 4 * offset, metadata);
  }

  deleteMesh(mesh) {
    this.meshCount--;
    this.removeMesh(mesh);
    if (this.meshCount === 0) {
      removeInstanceMesh(this);
    }
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

  getAABB(mesh, transform) {
    const index = this.meshToIndex.getKey(mesh);
    let transformMat;
    if (index !== undefined) {
      const offset = totalInstanceAttribSize * index;
      transformMat = this.transformArray.slice(offset, offset + 16);
    } else {
      transformMat = transform.getWorldMatrix();
    }
    const min = Vec3.clone(this.boundingBox[0]);
    Vec3.transformMat4(min, min, transformMat);

    const max = Vec3.clone(this.boundingBox[1]);
    Vec3.transformMat4(max, max, transformMat);

    const max1 = Vec3.clone(max).max(min);
    const min1 = Vec3.clone(min).min(max);

    return new AABB([min1, max1]);
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
      this.modelArrayLength / 8, // 3 for pos, 3 for normal, 3 for color
      this.meshToIndex.size()
    );
    gl.bindVertexArray(null);
  }
}

const instancedMeshMap = new Bimap();

function getInstancedMesh(modelArray) {
  if (!instancedMeshMap.getKey(modelArray)) {
    instancedMeshMap.set(modelArray, new InstancedMesh(gl, modelArray));
  }
  return instancedMeshMap.getKey(modelArray);
}

function registerInstanceMeshProgram(modelArray, program) {
  instancedMeshMap.getKey(modelArray).program = program;
}

function removeInstanceMesh(instancedMesh) {
  instancedMeshMap.removeValue(instancedMesh);
  instancedMeshes.remove(instancedMesh);
}

export { getInstancedMesh, registerInstanceMeshProgram, instancedMeshes };
