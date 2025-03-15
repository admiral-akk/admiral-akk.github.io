import { Mat4, mat4, vec3, Vec4 } from "gl-matrix";
import { Component } from "../../engine/ecs/component";

const NDC_corners = [
  // close
  Vec4.clone([-1, -1, -1, 1]), // bottom-left
  Vec4.clone([1, -1, -1, 1]), // bottom-right
  Vec4.clone([1, 1, -1, 1]), // top-right
  Vec4.clone([-1, 1, -1, 1]), // top-left
  // far
  Vec4.clone([-1, -1, 1, 1]), // bottom-left
  Vec4.clone([1, -1, 1, 1]), // bottom-right
  Vec4.clone([1, 1, 1, 1]), // top-right
  Vec4.clone([-1, 1, 1, 1]), // top-left
];

export class Camera extends Component {
  constructor(gl) {
    super();

    this.distance = 6;
    this.xAngle = 0;
    this.yAngle = Math.PI / 4;

    this.origin = vec3.create();
    this.target = vec3.create();

    this.near = 0.01;
    this.far = 40.0;

    this.projection = mat4.create();
    this.corners = [];
  }

  updateFrustumCorners(gl) {
    const { transform } = this.getEntity().components;
    const cameraProjectionMat = Mat4.create();
    const cameraViewMat = transform.getWorldMatrix();

    Mat4.perspective(
      cameraProjectionMat,
      Math.PI / 3,
      gl.canvas.width / gl.canvas.height,
      this.near,
      this.far
    );
    Mat4.multiply(cameraViewMat, cameraProjectionMat, cameraViewMat);
    Mat4.invert(cameraViewMat, cameraViewMat);

    const corners = [];

    for (let i = 0; i < NDC_corners.length; i++) {
      corners.push(Vec4.clone(NDC_corners[i]));
      Vec4.transformMat4(corners[i], corners[i], cameraViewMat);
      corners[i].scale(1 / corners[i][3]);
    }

    this.corners = corners;
  }

  getFrustumCorners(gl) {
    return this.corners;
  }

  getOffset() {
    return vec3.clone([
      this.distance * Math.sin(this.xAngle) * Math.cos(this.yAngle),
      this.distance * Math.sin(this.yAngle),
      this.distance * Math.cos(this.xAngle) * Math.cos(this.yAngle),
    ]);
  }

  setTarget(pos) {
    vec3.copy(this.target, pos);
  }

  setOrigin(pos) {
    vec3.copy(this.origin, pos);
  }
}
