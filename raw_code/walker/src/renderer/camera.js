import { mat4, vec3 } from "gl-matrix";
import { gl } from "../engine/renderer";

const temp = vec3.create();
export function applyCameraUniforms(camera, program) {
  const view = mat4.create();
  const projection = mat4.create();

  vec3.add(temp, camera.origin, camera.getOffset());

  mat4.lookAt(view, temp, camera.origin, [0, 1, 0]);

  mat4.perspective(
    projection,
    Math.PI / 3,
    gl.canvas.width / gl.canvas.height,
    0.01,
    20
  );

  const viewLoc = gl.getUniformLocation(program, "uView");
  const projectionLoc = gl.getUniformLocation(program, "uProjection");
  gl.uniformMatrix4fv(viewLoc, false, view);
  gl.uniformMatrix4fv(projectionLoc, false, projection);
}
