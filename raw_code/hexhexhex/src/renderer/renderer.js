import { mat4, vec3, vec4, quat } from "gl-matrix";
import { instancedMeshes } from "./instancedMesh";
import { getPostProcessVao } from "./program";

const temp = vec3.create();
const temp2 = vec4.create();
class Renderer {
  constructor(gl) {
    this.gl = gl;

    const depthTexture = gl.createTexture();
    const fragColorTexture = gl.createTexture();

    const fbo = gl.createFramebuffer();

    gl.bindTexture(gl.TEXTURE_2D, fragColorTexture);
    gl.texStorage2D(
      gl.TEXTURE_2D,
      1,
      gl.RGBA8,
      gl.canvas.width,
      gl.canvas.height
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R8, gl.canvas.width, gl.canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT1,
      gl.TEXTURE_2D,
      depthTexture,
      0
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      fragColorTexture,
      0
    );

    const renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      gl.canvas.width,
      gl.canvas.height
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      renderbuffer
    );

    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.fbo = fbo;
    this.depthTexture = depthTexture;
    this.fragColorTexture = fragColorTexture;
  }

  applyUniforms(camera, program) {
    const view = mat4.create();
    const projection = mat4.create();

    vec3.add(temp, camera.origin, camera.offset);

    mat4.lookAt(view, temp, camera.origin, [0, 1, 0]);

    mat4.perspective(
      projection,
      Math.PI / 2,
      this.gl.canvas.width / this.gl.canvas.height,
      0.01,
      20
    );

    const viewLoc = this.gl.getUniformLocation(program, "uView");
    const projectionLoc = this.gl.getUniformLocation(program, "uProjection");
    this.gl.uniformMatrix4fv(viewLoc, false, view);
    this.gl.uniformMatrix4fv(projectionLoc, false, projection);
  }

  render() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    for (let i = 0; i < instancedMeshes.length; i++) {
      instancedMeshes[i].render(gl);
    }
    gl.disable(gl.DEPTH_TEST);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  renderPostProcess(program) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, this.fragColorTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uDepth"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "uColor"), 1);
    gl.bindVertexArray(getPostProcessVao());

    gl.enable(gl.BLEND);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
  }
}

export { Renderer };
