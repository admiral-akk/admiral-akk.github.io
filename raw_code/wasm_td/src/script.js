import "./util/array.js";
import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import { Camera } from "./components/render/camera.js";
import {
  createProgram,
  createPostProcessProgram,
} from "./engine/renderer/program.js";
import { Renderer } from "./engine/renderer.js";
import { Entity } from "./engine/ecs/entity.js";
import { Transform } from "./components/render/transform.js";
import { NoiseTexture } from "./engine/renderer/noiseTextures.js";
import { Sun } from "./engine/renderer/sun.js";
import { State, StateMachine } from "./util/stateMachine.js";
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
import { Vec3, Vec2, Quat } from "gl-matrix";
import Stats from "stats.js";
import {
  Vec3 as wasmVec3,
  TerrainGenerator,
  TreeGenerator,
} from "./wasm/testing_wasm.js";
import { FrustumCulling } from "./systems/render/frustumCulling.js";
import { Position } from "./systems/util/position.js";
import { GenerateChunks } from "./systems/render/generateChunks.js";
import { window } from "./engine/window.js";

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

const cameraBaseT = new Transform({ pos: [0, 0, 0] });

const horizontalRotT = new Transform({
  parent: cameraBaseT,
  rot: Quat.create().rotateY(-Math.PI / 4),
});

const verticalRotT = new Transform({
  parent: horizontalRotT,
  rot: Quat.create().rotateX(Math.PI / 4),
});

const zoomT = new Transform({
  parent: verticalRotT,
  pos: [0, 0, -10],
});

const cameraBase = new Entity(cameraBaseT);
const cameraZoomOut3 = new Entity(horizontalRotT);
const cameraZoomOut2 = new Entity(verticalRotT);
const cameraZoomOut = new Entity(zoomT);

const cameraEntity = new Entity(
  new Camera(gl),
  new Transform({
    parent: zoomT,
  })
);

var debugVertices = [];

// input manager - client, determines commands
// commands figure out how to apply themselves
// then the state game actions happen
// then we apply a render

// TODO: add a notion of "commands"

// decides what commands a user will issue, if any
//
// commands might be illegal in the game state.
class InputManager extends StateMachine {
  constructor() {
    super();
    this.pushState(new OpenState());
    this.commands = [];
  }

  update() {
    const { state } = input;

    this.currentState().handleInput(this);
  }
}

class OpenState extends State {
  handleInput(manager) {
    const { state } = input;

    const move = Vec3.create();

    if (state?.w?.val) {
      move[2] += 1;
    }

    if (state?.s?.val) {
      move[2] -= 1;
    }
    if (state?.a?.val) {
      move[0] += 1;
    }
    if (state?.d?.val) {
      move[0] -= 1;
    }

    const invRot = Quat.clone(horizontalRotT.rot).invert();

    Vec3.transformQuat(move, move, invRot);
    Vec3.add(cameraBaseT.pos, cameraBaseT.pos, move);

    cameraBaseT.setPosition(cameraBaseT.pos);

    horizontalRotT.rot.rotateY(
      (0.05 * ((state?.q?.val ?? 0) - (state?.e?.val ?? 0))) / Math.PI
    );
    horizontalRotT.setRotation(horizontalRotT.rot);

    if (
      state?.rmb?.val === 1 &&
      state?.mpos?.frame === time.frame &&
      state?.mpos?.prev?.val
    ) {
      const delta = Vec2.clone(state.mpos.val).sub(state?.mpos?.prev.val);
      horizontalRotT.rot.rotateY((5 * delta.x) / Math.PI);
      verticalRotT.rot.rotateX(5 * delta.y);
      horizontalRotT.setRotation(horizontalRotT.rot);
      verticalRotT.setRotation(verticalRotT.rot);
    }
    if (
      state?.wheel?.frame === time.frame &&
      state?.wheel?.prev?.val !== state?.wheel?.val
    ) {
      const deltaY = state.wheel.val - state.wheel.prev.val;
      zoomT.pos[2] -= 0.05 * deltaY;
      zoomT.pos[2] = Math.clamp(zoomT.pos[2], -25, -4);
      zoomT.setPosition(zoomT.pos);
    }
  }
}

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
    const action = actions[i];
    switch (action.type) {
      default:
        break;
    }
  }
  actions.length = 0;
};

const renderer = new Renderer(gl);
window.listeners.push(renderer);
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

GenerateChunks.setTerrainGenerator(t);
GenerateChunks.setTreeGenerator(tree);

//createThing();
const draw = () => {
  stats.begin();
  inputManager.update();
  time.tick();

  // handle user input
  applyActions();

  // step through system
  applySystems();

  sunShadowMap.renderShadowDepth(cameraEntity.components);

  const setUniforms = (program) => {
    applyCameraUniforms(cameraEntity.components, program);
    sunShadowMap.setUniforms(gl, program);
    time.setUniforms(gl, program);
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
class NoiseNode extends AudioBufferSourceNode {
  constructor(audioContext) {
    super(audioContext);
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate
    );

    this.type = "white";
    this.buffer = noiseBuffer;
    this.loop = true;

    this.regenerateBuffer();
    this.start(0);
  }

  static shortName = "n";

  static dataToString(data) {
    switch (data.type) {
      default:
      case "white":
        return "0";
      case "pink":
        return "1";
      case "brown":
        return "2";
    }
  }

  static dataFromString(str) {
    const num = Number(str);
    switch (num) {
      default:
      case "0":
        return "white";
      case "1":
        return "pink";
      case "2":
        return "brown";
    }
  }

  regenerateBuffer() {
    // https://noisehack.com/generate-noise-web-audio-api/
    const output = this.buffer.getChannelData(0);
    const bufferSize = 2 * this.context.sampleRate;
    switch (this.type) {
      case "pink":
        var b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        for (var i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11; // (roughly) compensate for gain
          b6 = white * 0.115926;
        }
        break;
      case "brown":
        var lastOut = 0;
        for (var i = 0; i < bufferSize; i++) {
          var white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // (roughly) compensate for gain
        }
        break;
      case "white":
      default:
        for (var i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        break;
    }
  }

  getInput(key) {
    return this;
  }

  updateData(data) {
    if (this.type != data.type) {
      this.type = data.type;
      this.regenerateBuffer();
    }
  }
}

export { NoiseNode };

const audioCtx = new AudioContext();

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

const triangle = (t) => {
  const t1 = (t / (Math.PI * 2)) % 1.0;
  return Math.min(2 * t1, 1 - 2 * t1);
};

const envelope = (t) => {
  if (t < 0.3) {
    return Math.min(t, 0.3 - t) * 20;
  } else {
    return Math.sin((((t - 0.3) / 0.7) * Math.PI) / 2);
  }
};

const playNoise = () => {
  // Fill the buffer with white noise;
  //just random values between -1.0 and 1.0
  for (let channel = 0; channel < channels; channel++) {
    // This gives us the actual ArrayBuffer that contains the data
    const nowBuffering = myArrayBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      const t = i / audioCtx.sampleRate;

      // Math.random() is in [0; 1.0]
      // audio needs to be in [-1.0; 1.0]

      nowBuffering[i] = 0.0;
      for (let k = 10; k >= 0; k--) {
        nowBuffering[i] = nowBuffering[i] / 2 + Math.sin(t * Math.PI * 400 * k);
      }
      nowBuffering[i] *= envelope(t);
    }
  }

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
//setTimeout(playNoise, 1000);
draw();
