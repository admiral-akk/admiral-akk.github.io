import { createPostProcessProgram } from "./program";

const fragValueNoise = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec2 vTexCoord;

out float fragColor;

// https://thebookofshaders.com/10/
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


void main()
{
  fragColor = random(vTexCoord);
}`;

class NoiseTexture {
  constructor(gl) {
    this.gl = gl;
  }

  generateNoiseToTexture(renderer, dims, fragShader) {
    const { gl } = this;
    const noiseTex = gl.createTexture();

    const fbo = gl.createFramebuffer();

    gl.bindTexture(gl.TEXTURE_2D, noiseTex);
    gl.texStorage2D(
      gl.TEXTURE_2D,
      Math.min(Math.log2(dims[0]), Math.log2(dims[1])),
      gl.R8,
      dims[0],
      dims[1]
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      noiseTex,
      0
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
    const valueNoiseProgram = createPostProcessProgram(gl, fragShader);
    gl.useProgram(valueNoiseProgram);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderer.renderPostProcess(valueNoiseProgram);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      null,
      0
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fbo);

    gl.bindTexture(gl.TEXTURE_2D, noiseTex);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return noiseTex;
  }

  generateValueNoise(renderer, dims) {
    if (this.valueNoiseTex) {
      return;
    }

    this.valueNoiseTex = this.generateNoiseToTexture(
      renderer,
      dims,
      fragValueNoise
    );
  }
}

export { NoiseTexture };
