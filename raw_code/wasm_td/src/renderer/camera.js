import { mat4, vec3 } from "gl-matrix";
import { gl } from "../engine/renderer";

const temp = vec3.create();
export function applyCameraUniforms({ camera, transform }, program) {
  const projection = mat4.create();
  const mat = transform.getWorldMatrix();

  mat4.perspective(
    projection,
    Math.PI / 3,
    gl.canvas.width / gl.canvas.height,
    camera.near,
    camera.far
  );

  const viewLoc = gl.getUniformLocation(program, "uView");
  const projectionLoc = gl.getUniformLocation(program, "uProjection");
  gl.uniformMatrix4fv(viewLoc, false, mat);
  gl.uniformMatrix4fv(projectionLoc, false, projection);
  gl.uniform1f(gl.getUniformLocation(program, "uNear"), camera.near);
  gl.uniform1f(gl.getUniformLocation(program, "uFar"), camera.far);
}
