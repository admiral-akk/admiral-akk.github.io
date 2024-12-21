import { mat4, vec3 } from "gl-matrix";

class Camera {
  constructor() {
    this.cameraPos = vec3.create();
    this.cameraPos[0] = 4;
    this.cameraPos[1] = 4;
  }

  rotateCamera(step = 0.002) {
    const origin = vec3.create();

    vec3.rotateY(this.cameraPos, this.cameraPos, origin, step);
  }

  applyCameraUniforms(gl, program) {
    const view = mat4.create();
    const projection = mat4.create();
    const origin = vec3.create();

    mat4.lookAt(view, this.cameraPos, origin, [0, 1, 0]);

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
}

export { Camera };
