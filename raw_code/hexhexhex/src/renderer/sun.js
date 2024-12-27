import { mat4, vec3 } from "gl-matrix";
import { instancedMeshes } from "./instancedMesh";
import { createProgram } from "./program";

const vertexShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: vert

precision mediump float;

uniform mat4 uView;
uniform mat4 uProjection;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec3 aColor;
layout(location = 3) in mat4 aModel;
layout(location = 7) in ivec4 aInstancedMetadata;


out vec4 vPos;

void main() {
    gl_Position = uProjection * uView * aModel * vec4(aPosition,1.);
    vPos = gl_Position;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec4 vPos;

layout(location=0) out float depth; 

void main() {
    depth = vPos.z;
}`;

const depthTexSize = 1024;

class Sun {
  constructor(gl) {
    this.gl = gl;
    this.program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    // https://webgl2fundamentals.org/webgl/lessons/webgl-shadows.html
    const depthTexture = gl.createTexture();
    const depthTextureSize = depthTexSize;
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texImage2D(
      gl.TEXTURE_2D, // target
      0, // mip level
      gl.DEPTH_COMPONENT32F, // internal format
      depthTextureSize, // width
      depthTextureSize, // height
      0, // border
      gl.DEPTH_COMPONENT, // format
      gl.FLOAT, // type
      null
    ); // data
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const depthFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, // target
      gl.DEPTH_ATTACHMENT, // attachment point
      gl.TEXTURE_2D, // texture target
      depthTexture, // texture
      0
    ); // mip level

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.fbo = depthFramebuffer;
    this.depthTexture = depthTexture;

    const time = Math.PI / 2;
    this.sunState = {
      sunColor: [1, 0.9, 0.9],
      sunStrength: 0.9,
      ambientColor: [0.3, 0.3, 0.9],
      ambientStrength: 1,
      direction: [-Math.sin(time), -1 + Math.sin(1.2 * 0) / 2, -Math.cos(time)],
    };
  }

  setUniform(program) {
    const { gl, sunState } = this;

    const normDir = vec3.clone(sunState.direction);
    vec3.normalize(normDir, normDir);
    const sunData = [];
    sunData.push(...sunState.sunColor);
    sunData.push(sunState.sunStrength);
    sunData.push(...sunState.ambientColor);
    sunData.push(sunState.ambientStrength);
    sunData.push(...normDir);
    // padding
    sunData.push(0);

    const sunByteData = new Float32Array(sunData);
    const SUN_BINDING_POINT = 0;

    const sunBuffer = gl.createBuffer();
    gl.bindBufferBase(gl.UNIFORM_BUFFER, SUN_BINDING_POINT, sunBuffer);

    gl.bufferData(gl.UNIFORM_BUFFER, sunByteData, gl.DYNAMIC_DRAW);

    gl.uniformBlockBinding(
      program,
      gl.getUniformBlockIndex(program, "Sun"),
      SUN_BINDING_POINT
    );
  }

  renderShadowDepth() {
    const { gl } = this;
    gl.useProgram(this.program);
    const pos = vec3.clone(this.sunState.direction);
    vec3.scale(pos, pos, -1);
    const view = mat4.create();

    mat4.lookAt(view, pos, [0, 0, 0], [0, 1, 0]);

    const orthoWidth = 2;
    const orthoHeight = 2;
    const orthoDepth = 20;
    const projection = mat4.clone([
      1 / orthoWidth,
      0,
      0,
      0,
      0,
      1 / orthoHeight,
      0,
      0,
      0,
      0,
      -2 / orthoDepth,
      -1,
      0,
      0,
      0,
      1,
    ]);

    this.view = view;

    mat4.ortho(
      projection,
      -orthoWidth,
      orthoWidth,
      -orthoHeight,
      orthoHeight,
      0,
      orthoDepth
    );
    this.projection = projection;

    const viewLoc = this.gl.getUniformLocation(this.program, "uShadowVP");
    this.matrix = mat4.create();
    mat4.multiply(this.matrix, projection, view);
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.program, "uView"),
      false,
      view
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.program, "uProjection"),
      false,
      projection
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    const { width, height } = gl.canvas;
    gl.viewport(0, 0, depthTexSize, depthTexSize);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    for (let i = 0; i < instancedMeshes.length; i++) {
      instancedMeshes[i].render(gl);
    }
    gl.disable(gl.CULL_FACE);
    gl.viewport(0, 0, width, height);
    gl.disable(gl.DEPTH_TEST);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // bias matrix
  }
}

export { Sun };
