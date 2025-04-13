import "./util/array.js";
import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import {
  createProgram,
  createPostProcessProgram,
} from "./engine/renderer/program.js";
import { Renderer } from "./engine/renderer.js";
import { Entity } from "./engine/ecs/entity.js";
import { Transform } from "./components/render/transform.js";
import { NoiseTexture } from "./engine/renderer/noiseTextures.js";
import { Sun } from "./engine/renderer/sun.js";
import { time } from "./engine/time.js";
import { gl } from "./engine/renderer.js";
import { input } from "./engine/input.js";
import { Component } from "./engine/ecs/component.js";
import {
  fragmentShaderSource,
  quadFragmentShaderSource,
  renderTextureSource,
  vertexShaderSource,
  wireFrameFrag,
  wireFrameVertex,
} from "./shaders.js";
import { applySystems, meshInstances } from "./systems/system.js";
import { applyCameraUniforms } from "./engine/renderer/camera.js";
import { Mesh } from "./components/render/mesh.js";
import { Vec3 } from "gl-matrix";
import Stats from "stats.js";
import {
  Vec3 as wasmVec3,
  TerrainGenerator,
  TreeGenerator,
  ModelGenerator,
  CubeGenerator,
  AudioGenerator,
  TextureGenerator,
} from "./wasm/testing_wasm.js";
import { FrustumCulling } from "./systems/render/frustumCulling.js";
import { GenerateChunks } from "./systems/render/generateChunks.js";
import { BoxCollider } from "./components/collider.js";
import { getCollision } from "./raycaster.js";
import { Clickable } from "./components/client/clickable.js";
import { InputManager } from "./input/inputManager.js";
import { RiggedCamera } from "./entities/riggedCamera.js";

const v = new wasmVec3(1, 2, 3);
const other = new wasmVec3(4, 5, 6);

const dataManager = new DataManager(
  new DefaultCompressor(),
  new DefaultPreprocessor()
);
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
const wireFrameProgram = createProgram(gl, wireFrameVertex, wireFrameFrag);
const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
const quadProgram = createPostProcessProgram(gl, quadFragmentShaderSource);
const renderTexture = createPostProcessProgram(gl, renderTextureSource);

const cameraEntity = new RiggedCamera();

var debugVertices = [];

const inputManager = new InputManager();

// defines some functionality that changes the state of the game / rendering?
// do commands carry with them the parsing info?
//
// nah - make 'em just data payloads.
//
// then it's just type + data, right?
const applyActions = () => {
  const actions = inputManager.commands;
  for (let i = 0; i < actions.length; i++) {
    actions[i].apply();
  }
  actions.length = 0;
};

const renderer = new Renderer(gl);
const noise = new NoiseTexture(gl);
const sunShadowMap = new Sun(gl);

noise.generateSmoothValueNoise(renderer, [256, 256]);
noise.generateValueNoise(renderer, [256, 256]);

const renderPostProcess = () => {
  gl.useProgram(quadProgram);

  gl.uniform3fv(
    gl.getUniformLocation(quadProgram, "uBackgroundColor"),

    new Float32Array([123 / 255, 217 / 255, 246 / 255])
  );

  const pointerPos = input.state?.mpos_clamped?.val ?? [0.5, 0.5];
  gl.uniform2fv(
    gl.getUniformLocation(quadProgram, "uPointerPos"),

    new Float32Array([pointerPos[0], 1 - pointerPos[1]])
  );

  renderer.renderPostProcess(quadProgram);
};

const debugVertexBuffer = gl.createBuffer();
const renderDebug = () => {
  if (debugVertices.length > 0) {
    gl.useProgram(wireFrameProgram);
    // Enable the depth test

    // Clear the color and depth buffer
    renderer.applyUniforms(cameraEntity.components.camera, wireFrameProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, debugVertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(debugVertices),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    gl.enableVertexAttribArray(0);
    gl.drawArrays(gl.LINES, 0, debugVertices.length / 3);
    gl.flush();
  }
};

FrustumCulling.setActiveCamera(cameraEntity.components.camera);

// 20 x 20 grey floor
const t = new TerrainGenerator(40);
const tree = new TreeGenerator();
const cubeGen = new CubeGenerator();

const modelGen = new ModelGenerator();

modelGen.generate_model("red_cube", {
  ExtrudeModel: {
    base: [
      [-1.5, -1.5, 1, 0],
      [1.5, -1.5, 1, 0],
      [1.5, 1.5, 0, 0],
      [-1.5, 1.5, 0, 0],
    ],
    close_bot: true,
    close_top: true,
    transforms: [{ translation: [0, 3, 0], uv_offset: [0, 1] }],
  },
});

modelGen.generate_model("composite_red_cube", {
  CompositeModel: {
    references: [
      { name: "red_cube", transform: {} },
      {
        name: "red_cube",
        transform: {
          scale: [0.5, 0.5, 0.5],
          translation: [0, 2, 0],
        },
      },
    ],
  },
});

modelGen.generate_model("red_cube2", {
  ExtrudeModel: {
    base: [
      [-0.5, -0.5, 0, 0],
      [0.5, -0.5, 0, 0],
      [0.5, 0.5, 0, 0],
      [-0.5, 0.5, 0, 0],
    ],
    close_bot: true,
    close_top: true,
    transforms: [
      { translation: [0, 1, 0], uv_offset: [0.5, 0.5] },
      { translation: [0, 0.2, 0], scale: [0, 1, 1], uv_offset: [0.5, 0.5] },
    ],
  },
});
modelGen.generate_model("tree_base", {
  ExtrudeModel: {
    base: [
      [-0.15, -0.15, 0, 1],
      [0.15, -0.15, 0, 1],
      [0.15, 0.15, 0, 1],
      [-0.15, 0.15, 0, 1],
    ],
    close_bot: true,
    close_top: false,
    transforms: [{ translation: [0, 1, 0], uv_offset: [1, 0] }],
  },
});

modelGen.generate_model("tree_triangle", {
  ExtrudeModel: {
    base: [
      [-0.5, -0.5, 0, 0],
      [0.5, -0.5, 0, 0],
      [0.5, 0.5, 0, 0],
      [-0.5, 0.5, 0, 0],
    ],
    close_bot: true,
    close_top: true,
    transforms: [
      { translation: [0, 2, 0], scale: [0, 1, 0], uv_offset: [0.8, 0] },
    ],
  },
});

modelGen.generate_model("tree_pine", {
  CompositeModel: {
    references: [
      { name: "tree_base", transform: {} },
      {
        name: "tree_triangle",
        transform: {
          translation: [0, 1, 0],
        },
      },
      {
        name: "tree_triangle",
        transform: {
          translation: [0, 1.75, 0],
          scale: [0.8, 0.8, 0.8],
          uv_offset: [0.1, 0],
        },
      },
      {
        name: "tree_triangle",
        transform: {
          translation: [0, 2.5, 0],
          scale: [0.6, 0.6, 0.6],
          uv_offset: [0.2, 0],
        },
      },
    ],
  },
});

const redCube2 = modelGen.generate_box();

console.log(redCube2);
const redCube = cubeGen.generate_mesh(
  new wasmVec3(1, 1, 1),
  new wasmVec3(1, 0, 0)
);
const blueCube = cubeGen.generate_mesh(
  new wasmVec3(Math.sqrt(200), 1, Math.sqrt(200)),
  new wasmVec3(0, 0, 0.5)
);

new Entity(new Mesh(redCube2), new Transform({ pos: new Vec3(0, 1, 0) }));
const collider = new Entity(
  new Transform({ pos: new Vec3(0, -1, 0) }),
  new BoxCollider([5, 0.5, 5]),
  // new Mesh(blueCube),
  new Clickable()
);

let textureGenerator = new TextureGenerator();
textureGenerator.generate_texture("tex1", {
  ColorGradient: {
    tl: {
      Rgb: {
        r: 0,
        g: 0,
        b: 0,
      },
    },
    tr: {
      Rgb: {
        r: 0.6,
        g: 0,
        b: 0,
      },
    },
    bl: {
      Rgb: {
        r: 0,
        g: 0,
        b: 0,
      },
    },
    br: {
      Rgb: {
        r: 0.45,
        g: 0,
        b: 0,
      },
    },
  },
});
const width = 16;
const height = 16;
let color = {
  Oklab: {
    l: 0.5,
    c: 0.5,
    h: 6,
  },
};

const darkGreen = {
  Rgb: {
    r: 43 / 255,
    g: 70 / 255,
    b: 60 / 255,
  },
};
const lightGreen = {
  Rgb: {
    r: 177 / 255,
    g: 209 / 255,
    b: 130 / 255,
  },
};

const darkBrown = {
  Rgb: {
    r: 105 / 255,
    g: 75 / 255,
    b: 55 / 255,
  },
};

const lightBrown = {
  Rgb: {
    r: 165 / 255,
    g: 99 / 255,
    b: 60 / 255,
  },
};
textureGenerator.generate_texture("tex2", {
  MultiGradient: {
    gradients: [
      {
        tl: darkGreen,
        tr: lightGreen,
        bl: darkGreen,
        br: lightGreen,
      },
      {
        tl: darkBrown,
        tr: lightBrown,
        bl: darkBrown,
        br: lightBrown,
      },
    ],
    gradient_width: width,
    gradient_height: height,
  },
});

const texture = gl.createTexture();
{
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array(4 * width * 2 * height); // opaque blue

  textureGenerator.fill_array("tex2", pixel, width, 2 * height);
  console.log(pixel);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    2 * height,
    border,
    srcFormat,
    srcType,
    pixel
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

const audioCtx = new AudioContext();
const audioGen = new AudioGenerator(audioCtx.sampleRate, 2);

// Stereo
const channels = 2;
// Create an empty two second stereo buffer at the
// sample rate of the AudioContext
const frameCount = audioCtx.sampleRate * 2.0;

const myArrayBuffer = audioCtx.createBuffer(
  channels,
  frameCount,
  audioCtx.sampleRate
);

// try generating vowels?
//
// https://corpus.eduhk.hk/english_pronunciation/index.php/2-2-formants-of-vowels/

let param_i = {
  sample_rate: audioCtx.sampleRate,
  nodes: [
    {
      Osc: {
        t: "Sqr",
        f: { F: 0 },
        p: { N: 7 },
      },
    },
    {
      Osc: {
        t: "Sqr",
        f: { F: 700 },
        p: { N: 7 },
      },
    },
    {
      Osc: {
        t: "Sqr",
        f: { F: 780 },
        p: { N: 7 },
      },
    },
    {
      Gain: {
        i: [0],
        g: 0.1,
        e: {
          a: 0.25,
          d: 1.0,
        },
      },
    },
    {
      Gain: {
        i: [1],
        g: 0.05,
        e: {
          a: 0.05,
          d: 1.0,
        },
      },
    },
    {
      Gain: {
        i: [2],
        g: 0.05,
        e: {
          a: 0.05,
          d: 1.0,
        },
      },
    },
    {
      Gain: {
        i: [3, 4, 5],
      },
    },
    {
      Osc: {
        f: { F: 8 },
        s: 0,
      },
    },
  ],
  channel_inputs: [6, 6],
  post_processing: [
    {
      DynamicRange: {
        max: 0.4,
      },
    },
  ],
};

let param1 = {
  sample_rate: audioCtx.sampleRate,
  nodes: [
    {
      Osc: {
        f: { N: 8 },
      },
    },
    {
      Gain: {
        i: [0],
        g: 0.5,
        e: {
          a: 0.15,
          d: 1.0,
        },
      },
    },
    {
      Osc: {
        f: { F: 100 },
      },
    },
    {
      Gain: {
        i: [2],
        g: 0.4,
        e: {
          a: 0.2,
          d: 1.5,
        },
      },
    },
    {
      Gain: {
        i: [1, 3, 6],
      },
    },
    { Delay: { i: [4], d: 0.35 } },
    { Gain: { i: [5], e: { a: 0.05, d: 1.5 } } },
    { Noise: { t: "Pink" } },
    {
      Osc: {
        f: { F: 0.2 },
        o: 400,
        s: 100,
      },
    },
  ],
  channel_inputs: [5, 5],
  post_processing: [
    {
      DynamicRange: {
        max: 0.1,
      },
    },
  ],
};

let simple = {
  nodes: [
    {
      Osc: {
        f: { F: 500 },
      },
    },
    {
      Gain: {
        i: [0, 2],
        e: {
          a: 0.2,
          d: 0.4,
        },
      },
    },
    { Delay: { i: [1], d: 0.4 } },
    {
      Gain: {
        i: [1, 2],
      },
    },
  ],
  channel_inputs: [3, 3],
  post_processing: [
    {
      DynamicRange: {
        max: 0.4,
      },
    },
  ],
};

audioGen.generate(
  simple,
  myArrayBuffer.getChannelData(0),
  myArrayBuffer.getChannelData(1)
);

console.log(myArrayBuffer.getChannelData(0));

const playNoise = () => {
  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  const source = audioCtx.createBufferSource();
  // set the buffer in the AudioBufferSourceNode
  source.buffer = myArrayBuffer;
  // connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  source.connect(audioCtx.destination);
  // start the source playing
  source.start();
};

playNoise();
GenerateChunks.setTerrainGenerator(t);
GenerateChunks.setTreeGenerator(tree);

const draw = () => {
  stats.begin();
  inputManager.update(input);
  time.tick();

  const collision = getCollision(
    input.state,
    cameraEntity.components.transform,
    cameraEntity.components.camera
  );
  // handle user input
  applyActions();

  // step through system
  applySystems();

  sunShadowMap.renderShadowDepth(cameraEntity.components);

  const setUniforms = (program) => {
    applyCameraUniforms(cameraEntity.components, program);
    sunShadowMap.setUniforms(gl, program);
    time.setUniforms(gl, program);

    const shadowLoc = 4;
    gl.activeTexture(gl.TEXTURE0 + shadowLoc);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, "uCustomTexture"), shadowLoc);
    gl.uniform2fv(
      gl.getUniformLocation(program, "uCustomerTextureSize"),

      new Float32Array([width, height])
    );
  };
  gl.bindFramebuffer(gl.FRAMEBUFFER, renderer.fbo);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  renderer.render(program, setUniforms, meshInstances.visibleMeshInstances);

  renderPostProcess();
  renderDebug();
  Component.checkUnallocatedComponents();
  stats.end();
  requestAnimationFrame(draw);
};

draw();
