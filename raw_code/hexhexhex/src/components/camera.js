import { mat4, vec3, vec4, quat } from "gl-matrix";
import { Component } from "../ecs/component";

const temp = vec3.create();
const temp2 = vec4.create();

class Camera extends Component {
  constructor() {
    super();
    this.offset = vec3.create();
    this.offset[0] = 4;
    this.offset[1] = 4;

    this.rotation = quat.create();

    this.origin = vec3.create();
    this.target = vec3.create();
  }

  setTarget(pos) {
    vec3.copy(this.target, pos);
  }

  setOrigin(pos) {
    vec3.copy(this.origin, pos);
  }

  animateCamera() {
    vec3.sub(temp, this.target, this.origin);
    vec3.scale(temp, temp, 0.1);
    vec3.add(this.origin, temp, this.origin);
    // move origin towards target
  }

  applyCameraUniforms(gl, program) {
    const view = mat4.create();
    const projection = mat4.create();

    vec3.add(temp, this.origin, this.offset);

    mat4.lookAt(view, temp, this.origin, [0, 1, 0]);

    mat4.perspective(
      projection,
      Math.PI / 2,
      gl.canvas.width / gl.canvas.height,
      0.01,
      20
    );

    const viewLoc = gl.getUniformLocation(program, "uView");
    const projectionLoc = gl.getUniformLocation(program, "uProjection");
    gl.uniformMatrix4fv(viewLoc, false, view);
    gl.uniformMatrix4fv(projectionLoc, false, projection);
  }

  rayCast(gl, clickPos) {
    const viewX = 2 * (clickPos[0] - 0.5);

    // invert y
    const viewY = 2 * (0.5 - clickPos[1]);

    temp2[0] = viewX;
    temp2[1] = viewY;
    temp2[2] = 1;
    temp2[3] = 1;

    const view = mat4.create();
    const projection = mat4.create();

    vec3.add(temp, this.origin, this.offset);

    mat4.lookAt(view, temp, this.origin, [0, 1, 0]);

    mat4.perspective(
      projection,
      Math.PI / 2,
      gl.canvas.width / gl.canvas.height,
      0.01,
      20
    );

    mat4.invert(projection, projection);
    mat4.invert(view, view);

    vec4.transformMat4(temp2, temp2, projection);
    vec4.transformMat4(temp2, temp2, view);

    const dir = vec3.create();
    vec3.copy(dir, temp2);

    vec3.normalize(dir, dir);

    return [temp, dir];
  }
}

export { Camera };
