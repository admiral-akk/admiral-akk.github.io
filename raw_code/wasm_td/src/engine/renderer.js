import { getPostProcessVao } from "./renderer/program.js";
import { window } from "./window.js";

const gl = window.canvas.getContext("webgl2");
gl.getExtension("EXT_color_buffer_float");
gl.getExtension("OES_texture_float_linear");
gl.getExtension("WEBGL_depth_texture");

class Renderer {
  constructor() {
    this.generateBuffers();
    window.listeners.push(this);
  }

  updateSize() {
    this.generateBuffers();
  }

  generateBuffers() {
    const depthTexture = gl.createTexture();
    const fragColorTexture = gl.createTexture();

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
    gl.bindTexture(gl.TEXTURE_2D, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT1,
      gl.TEXTURE_2D,
      depthTexture,
      0
    );
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
      gl.DEPTH_STENCIL,
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

  render(program, preProgram = () => {}, meshInstances) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.useProgram(program);
    preProgram(program);
    meshInstances.forEach((mi) => {
      mi.render(gl);
    });
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  renderPostProcess(program) {
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, this.fragColorTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uDepth"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "uColor"), 1);
    gl.bindVertexArray(getPostProcessVao(gl));

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
  }
}

export { Renderer, gl };
