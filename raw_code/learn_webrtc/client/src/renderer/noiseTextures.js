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

const fragSmoothValueNoise = `#version 300 es
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

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


void main()
{

    // Use the noise function
    fragColor = noise(45. * vTexCoord);
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

  generateSmoothValueNoise(renderer, dims) {
    if (this.smoothValueNoiseTex) {
      return;
    }

    this.smoothValueNoiseTex = this.generateNoiseToTexture(
      renderer,
      dims,
      fragSmoothValueNoise
    );
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
