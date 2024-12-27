import { mat4, vec3 } from "gl-matrix";
import { instancedMeshes } from "./instancedMesh";
import { createProgram } from "./program";

// shadow maps
// https://www.opengl-tutorial.org/intermediate-tutorials/tutorial-16-shadow-mapping/

// cascading
// https://alextardif.com/shadowmapping.html

const vertexShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: vert

precision mediump float;

uniform mat4 uShadowVP;

layout(location = 0) in vec3 aPosition;
layout(location = 3) in mat4 aModel;

out vec4 vPos;

void main() {
    gl_Position = uShadowVP * aModel * vec4(aPosition,1.);
    vPos = gl_Position;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec4 vPos;

layout(location=0) out float depth; 

void main() {
    depth = gl_FragCoord.z * 30.;
}`;

class Sun {
  constructor(gl) {
    this.gl = gl;
    this.program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    const depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R16F, 1024, 1024);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      depthTexture,
      0
    );

    const renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1024, 1024);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      renderbuffer
    );

    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.fbo = fbo;
    this.depthTexture = depthTexture;
  }

  renderShadowDepth(sunPosition) {
    const { gl } = this;
    gl.useProgram(this.program);
    const pos = vec3.clone(sunPosition);
    vec3.scale(pos, pos, 3);
    const view = mat4.create();

    mat4.lookAt(view, [1, 4, 1], [0, 0, 0], [0, 1, 0]);
    const projection = mat4.create();

    mat4.ortho(projection, -4, 4, -4, 4, 0, 30);
    const viewLoc = this.gl.getUniformLocation(this.program, "uShadowVP");
    this.matrix = mat4.create();
    mat4.multiply(this.matrix, projection, view);
    this.gl.uniformMatrix4fv(viewLoc, false, this.matrix);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    const { width, height } = gl.canvas;
    gl.canvas.width = 1024;
    gl.canvas.height = 1024;
    for (let i = 0; i < instancedMeshes.length; i++) {
      instancedMeshes[i].render(gl);
    }
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.disable(gl.DEPTH_TEST);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // bias matrix
  }
}

export { Sun };
