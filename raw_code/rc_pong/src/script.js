import "./style.css";
import { WindowManager } from "./engine/window.js";
import { DataManager } from "./engine/data.js";
import Stats from "stats-js";
import * as twgl from "twgl.js";
import { InputManager } from "./engine/input.js";
import { InputStateManager, MyGame } from "./game.js";
import calculateQuadCascade from "./shaders/quadCascade.fs";
import renderQuadCascade from "./shaders/renderQuadCascade.fs";

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// Render Pipeline

const gl = document.getElementById("webgl").getContext("webgl2");
twgl.addExtensionsToContext(gl);

function renderTo(
  gl,
  programInfo,
  bufferInfo,
  uniforms,
  targetFrameBuffer = null,
  targetDimensions = null
) {
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.bindFramebufferInfo(gl, targetFrameBuffer);
  if (targetDimensions) {
    gl.viewport(
      targetDimensions[0],
      targetDimensions[1],
      targetDimensions[2],
      targetDimensions[3]
    );
  }
  twgl.drawBufferInfo(gl, bufferInfo);
}

const arrays = {
  position: {
    numComponents: 3,
    data: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
  },
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

// Time

// Data Storage

const data = new DataManager();
data.init();

// Canvas Manager

const windowManager = new WindowManager(1);

// Input handler

const input = new InputManager(windowManager);

const inputState = new InputStateManager();

// Game

const game = new MyGame(data);

// Data Storage Layer

// Draw Lines

const vs = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fs_constant_fill = `#version 300 es
precision highp float;

uniform vec4 color;

out vec4 outColor;

void main() {
  outColor = color;
}
`;

const fs_write_line = `#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform vec2 lineStart;
uniform vec4 color;
uniform vec2 lineEnd;
uniform float pixelLineSize;
uniform sampler2D tPrev;

out vec4 outColor;

float lineDist() {
  vec2 uv = gl_FragCoord.xy / resolution;
  if (lineStart == lineEnd) {
    return length(lineStart - uv);
  } else {
   vec2 delta = (lineEnd - lineStart);
    vec2 dir = uv - lineStart;
    float t = dot(dir, delta) / dot(delta,delta);
    if (t < 0. || t > 1.) {
      return min(length(uv - lineStart), length(uv - lineEnd));
    } else {
     return length(lineStart + t * delta - uv);
    }
   return 0.;
  }
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float dist = step(lineDist(), pixelLineSize / resolution.x);
  outColor = mix(texture(tPrev, uv).xyzw, color.rgba,  dist);
}
`;

const fs_jump = `#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform float jumpSize; 
uniform sampler2D tPrev;
uniform sampler2D tLine;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  
  vec3 prevClosestPos = texture(tPrev, uv).xyz;

  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 delta = vec2(float(i), float(j)) * jumpSize / resolution;
      vec2 sampleUv = uv + delta;
      vec3 closestPos = texture(tPrev, sampleUv).xyz;
      float lineVal = texture(tLine, sampleUv).a;

      if (lineVal > 0.1) {
        closestPos = vec3(sampleUv, 1.);
      }

      if (closestPos.z > 0.) {
        if (prevClosestPos.z > 0.) {
          if (length(closestPos.xy - uv) < length(prevClosestPos.xy - uv)) {
            prevClosestPos = closestPos;
          }
        } else {
          prevClosestPos = closestPos;
        }
      }
    }
  }
  outColor = vec4( prevClosestPos , 0.);
}
`;

const fs_render_closest = `#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform sampler2D tPrev;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float dist = length(texture(tPrev, uv).xy - uv);
  outColor = vec4(float(gl_FragCoord.x == resolution.x - 0.5), float(gl_FragCoord.y == resolution.y - 0.5), 0. ,1.);
  outColor = vec4(vec3(dist), 1.0);
}

`;

const fs_calculate_distance = `#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform sampler2D tPrev;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  outColor = texture(tPrev, uv);
}

`;

const fs_render_texture = `#version 300 es
precision highp float;

uniform vec2 resolution;
uniform vec4 renderTarget;
uniform sampler2D tPrev;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 targetUv = (renderTarget.zw - renderTarget.xy) * uv + renderTarget.xy;
  outColor = texture(tPrev, targetUv).rgba;
}
`;

const fs_apply_gamma = `#version 300 es
precision highp float;

uniform vec2 resolution;
uniform sampler2D tPrev;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  outColor = pow(texture(tPrev, uv), vec4(1./2.2));
}
`;

const drawLineToBuffer = twgl.createProgramInfo(gl, [vs, fs_write_line]);
const renderTexture = twgl.createProgramInfo(gl, [vs, fs_render_texture]);
const calculateDistance = twgl.createProgramInfo(gl, [vs, fs_render_closest]);
const drawTexture = twgl.createProgramInfo(gl, [vs, fs_render_closest]);
const fillColor = twgl.createProgramInfo(gl, [vs, fs_constant_fill]);
const jumpFill = twgl.createProgramInfo(gl, [vs, fs_jump]);
const applyGamma = twgl.createProgramInfo(gl, [vs, fs_apply_gamma]);
const cascadeQuadCalculate = twgl.createProgramInfo(gl, [
  vs,
  calculateQuadCascade,
]);
const cascadeQuadRender = twgl.createProgramInfo(gl, [vs, renderQuadCascade]);

function drawToBuffer(time, buffer, size, game) {
  time += 100000;
  const vs_instance = `#version 300 es
    in vec2 position;
    in vec4 color;
    in mat4 matrix;
    
    out vec4 v_color;
      void main() {
        // Multiply the position by the matrix.
        gl_Position = matrix * vec4(position, 0.0, 1.0);
        v_color = color;
      }
    `;
  const fs_instance_color = `#version 300 es

    precision mediump float;
    
    in vec4 v_color;
    
    out vec4 outColor;
    void main() {
      outColor = v_color;
    }`;

  const instanceColor = twgl.createProgramInfo(gl, [
    vs_instance,
    fs_instance_color,
  ]);

  const m4 = twgl.m4;
  const matrices = [];
  const colors = [];

  const { ball, balls } = game.data.state;

  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    const scale = m4.scaling([b.size, b.size, b.size]);
    const translation = m4.translation([
      b.position[0] / b.size,
      b.position[1] / b.size,
      0,
    ]);

    const mat = m4.multiply(scale, translation);
    mat.forEach((v, i) => {
      matrices.push(v);
    });
    colors.push(b.color[0], b.color[1], b.color[2], 1);
  }

  const scale = m4.scaling([ball.size, ball.size, ball.size]);
  const translation = m4.translation([
    ball.position[0] / ball.size,
    ball.position[1] / ball.size,
    0,
  ]);

  const mat = m4.multiply(scale, translation);
  mat.forEach((v, i) => {
    matrices.push(v);
  });
  colors.push(ball.color[0], ball.color[1], ball.color[2], 1);

  const vertexData = [];

  const numPts = 32;

  for (var i = 0; i <= numPts; i++) {
    vertexData.push(
      Math.sin((i * Math.PI * 2) / numPts),
      Math.cos((i * Math.PI * 2) / numPts)
    );
  }

  const arrays2 = {
    position: {
      numComponents: 2,
      data: vertexData,
    },
    color: {
      numComponents: 4,
      data: colors,
      divisor: 1,
    },
    matrix: {
      numComponents: 16,
      data: matrices,
      divisor: 1,
    },
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays2);
  const vertexArrayInfo = twgl.createVertexArrayInfo(
    gl,
    instanceColor,
    bufferInfo
  );

  gl.useProgram(instanceColor.program);
  twgl.setBuffersAndAttributes(gl, instanceColor, vertexArrayInfo);
  twgl.setUniforms(instanceColor, {});
  twgl.bindFramebufferInfo(gl, buffer);
  twgl.drawBufferInfo(
    gl,
    vertexArrayInfo,
    gl.TRIANGLE_FAN,
    vertexArrayInfo.numElements,
    0,
    balls.length + 1
  );

  const matrices2 = [];
  const colors2 = [];

  const { paddles } = game.data.state;

  for (let i = 0; i < paddles.length; i++) {
    const p = paddles[i];
    const scale = m4.scaling([p.size[0], p.size[1], 1]);
    const translation = m4.translation([
      p.position[0] / p.size[0],
      p.position[1] / p.size[1],
      0,
    ]);
    const mat = m4.multiply(scale, translation);
    mat.forEach((v, i) => {
      matrices2.push(v);
    });
    colors2.push(p.color[0], p.color[1], p.color[2], 1);
  }
  const vertexData2 = [1, 1, 1, -1, -1, -1, -1, 1];

  const arrays3 = {
    position: {
      numComponents: 2,
      data: vertexData2,
    },
    color: {
      numComponents: 4,
      data: colors2,
      divisor: 1,
    },
    matrix: {
      numComponents: 16,
      data: matrices2,
      divisor: 1,
    },
  };
  const bufferInfo2 = twgl.createBufferInfoFromArrays(gl, arrays3);
  const vertexArrayInfo2 = twgl.createVertexArrayInfo(
    gl,
    instanceColor,
    bufferInfo2
  );

  gl.useProgram(instanceColor.program);
  twgl.setBuffersAndAttributes(gl, instanceColor, vertexArrayInfo2);
  twgl.setUniforms(instanceColor, {});
  twgl.bindFramebufferInfo(gl, buffer);
  twgl.drawBufferInfo(
    gl,
    vertexArrayInfo,
    gl.TRIANGLE_FAN,
    vertexArrayInfo.numElements,
    0,
    paddles.length
  );
}

windowManager.listeners.push({
  updateSize: ({ width, height }) => {
    gl.canvas.width = width;
    gl.canvas.height = height;
  },
});
let toSave = false;

data.addButton({
  name: "Save Image",
  fn: () => {
    toSave = true;
  },
});

const saveImage = () => {
  let canvas = document.getElementById("webgl");

  var image = canvas.toDataURL();
  // Create a link
  var aDownloadLink = document.createElement("a");
  // Add the name of the file to the link
  aDownloadLink.download = "canvas_image.png";
  // Attach the data to the link
  aDownloadLink.href = image;
  // Get the code to click the download link
  aDownloadLink.click();
  toSave = false;
};

const width = 8 * 128;
const height = width;
const frameBuffers = {
  lightEmitters: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA8,
        format: gl.RGBA,
        mag: gl.NEAREST,
        min: gl.NEAREST,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    width,
    height
  ),
  lightEmittersWithCurrent: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA8,
        format: gl.RGBA,
        mag: gl.NEAREST,
        min: gl.NEAREST,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    width,
    height
  ),
  distance: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA8,
        format: gl.RGBA,
        mag: gl.LINEAR,
        min: gl.LINEAR,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    width,
    height
  ),
  fill: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA8,
        format: gl.RGBA,
        mag: gl.NEAREST,
        min: gl.NEAREST,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    width,
    height
  ),
  spare: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA8,
        format: gl.RGBA,
        mag: gl.NEAREST,
        min: gl.NEAREST,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    width,
    height
  ),
  cascadeRT: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA32F,
        format: gl.RGBA,
        mag: gl.LINEAR,
        min: gl.LINEAR,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    2 * width,
    height
  ),
  spareCascadeRT: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA32F,
        format: gl.RGBA,
        mag: gl.LINEAR,
        min: gl.LINEAR,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    2 * width,
    height
  ),
  linearCascadeRT: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA32F,
        format: gl.RGBA,
        mag: gl.LINEAR,
        min: gl.LINEAR,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    2 * width,
    height
  ),
  quadCascadeRT: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA32F,
        format: gl.RGBA,
        mag: gl.LINEAR,
        min: gl.LINEAR,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    width,
    height
  ),
  spareQuadCascadeRT: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA32F,
        format: gl.RGBA,
        mag: gl.LINEAR,
        min: gl.LINEAR,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    width,
    height
  ),
  finalCascadeRT: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA32F,
        format: gl.RGBA,
        mag: gl.LINEAR,
        min: gl.LINEAR,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    width,
    height
  ),
  finalCascadeRTSpare: twgl.createFramebufferInfo(
    gl,
    [
      {
        internalFormat: gl.RGBA32F,
        format: gl.RGBA,
        mag: gl.LINEAR,
        min: gl.LINEAR,
        wrap: gl.CLAMP_TO_EDGE,
        auto: true,
      },
    ],
    width,
    height
  ),
};

data.addColor({
  displayName: "Color",
  defaultValue: [1, 1, 1],
  callback: (color) => {
    game.commands.push(new UpdateColorCommand(color));
  },
});

function renderScene(time) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  renderTo(
    gl,
    fillColor,
    bufferInfo,
    { color: [0, 0, 0, 0] },
    frameBuffers.lightEmittersWithCurrent
  );

  drawToBuffer(time, frameBuffers.lightEmittersWithCurrent, 0.05, game);
}

function renderDepth(time, depth) {
  const startDepth = data.addNumber({
    displayName: "Start Depth",
    defaultValue: Math.log2(width) - 3,
    min: 1,
    max: Math.log2(width) - 3,
    step: 1,
  }).value;
  const shortestDistance = (10 * Math.SQRT2) / frameBuffers.cascadeRT.width;
  const longestDistance = Math.SQRT2;

  const multiplier2 = Math.log2(longestDistance / shortestDistance);

  const minDistance =
    depth === 0
      ? 0
      : shortestDistance *
        Math.pow(2, (multiplier2 * (depth - 1)) / startDepth);
  const maxDistance =
    depth == startDepth
      ? Math.SQRT2
      : shortestDistance * Math.pow(2, (multiplier2 * depth) / startDepth);
  const deeperMaxDistance =
    shortestDistance * Math.pow(2, (multiplier2 * (depth + 1)) / startDepth);

  renderTo(
    gl,
    cascadeQuadCalculate,
    bufferInfo,
    {
      renderResolution: [gl.canvas.width, gl.canvas.height],
      resolution: [
        frameBuffers.quadCascadeRT.width,
        frameBuffers.quadCascadeRT.height,
      ],
      maxSteps: data.addNumber({
        displayName: "Max Steps",
        defaultValue: 32,
        min: 1,
        max: 128,
        step: 1,
      }).value,
      tDistance: frameBuffers.distance.attachments[0],
      tColor: frameBuffers.lightEmittersWithCurrent.attachments[0],
      startDepth: startDepth,
      current: {
        depth: depth,
        minDistance: minDistance,
        maxDistance: maxDistance,
      },
      deeper: {
        depth: depth,
        minDistance: maxDistance,
        maxDistance: deeperMaxDistance,
      },
      debug: {
        continousBilinearFix: data.addNumber({
          displayName: "Continuous Bilinear Fix",
          defaultValue: true,
        }).value,
        cornerProbes: data.addNumber({
          displayName: "Corner Probes",
          defaultValue: true,
        }).value,
        showSampleUv: data.addNumber({
          displayName: "Show Sample Uv",
          defaultValue: false,
        }).value,
        showProbeUv: data.addNumber({
          displayName: "Show Probe Uv",
          defaultValue: false,
        }).value,
        showDirection: data.addNumber({
          displayName: "Show Direction Uv",
          defaultValue: false,
        }).value,
        noFix: data.addNumber({
          displayName: "No Fix",
          defaultValue: false,
        }).value,
        quadSample: data.addNumber({
          displayName: "Quad Sample",
          defaultValue: false,
        }).value,
        finalDepth: data.addNumber({
          displayName: "Final Depth",
          defaultValue: 0,
          min: 0,
          max: 8,
          step: 1,
        }).value,
      },
      tPrevCascade: frameBuffers.quadCascadeRT.attachments[0],
    },
    frameBuffers.spareQuadCascadeRT
  );
  [frameBuffers.spareQuadCascadeRT, frameBuffers.quadCascadeRT] = [
    frameBuffers.quadCascadeRT,
    frameBuffers.spareQuadCascadeRT,
  ];
}

function renderDistance(time) {
  renderTo(
    gl,
    fillColor,
    bufferInfo,
    { color: [0, 0, 0, 0] },
    frameBuffers.spare
  );
  [frameBuffers.fill, frameBuffers.spare] = [
    frameBuffers.spare,
    frameBuffers.fill,
  ];

  for (var i = Math.ceil(Math.log2(width)); i >= 0; i--) {
    renderTo(
      gl,
      jumpFill,
      bufferInfo,
      {
        resolution: [frameBuffers.fill.width, frameBuffers.fill.height],
        jumpSize: 1 << i,
        tPrev: frameBuffers.fill.attachments[0],
        tLine: frameBuffers.lightEmittersWithCurrent.attachments[0],
      },
      frameBuffers.spare
    );
    [frameBuffers.fill, frameBuffers.spare] = [
      frameBuffers.spare,
      frameBuffers.fill,
    ];
  }

  renderTo(
    gl,
    calculateDistance,
    bufferInfo,
    {
      resolution: [frameBuffers.fill.width, frameBuffers.fill.height],
      tPrev: frameBuffers.fill.attachments[0],
    },
    frameBuffers.distance
  );
}

function renderCascadeLevel() {
  renderTo(
    gl,
    renderTexture,
    bufferInfo,
    {
      renderTarget: [
        data.addNumber({
          displayName: "minx",
          defaultValue: 0,
          min: 0,
          max: 1,
          step: 0.01,
        }).value,
        data.addNumber({
          displayName: "miny",
          defaultValue: 0,
          min: 0,
          max: 1,
          step: 0.01,
        }).value,
        data.addNumber({
          displayName: "maxx",
          defaultValue: 1,
          min: 0,
          max: 1,
          step: 0.01,
        }).value,
        data.addNumber({
          displayName: "maxy",
          defaultValue: 1,
          min: 0,
          max: 1,
          step: 0.01,
        }).value,
      ],
      resolution: [
        frameBuffers.quadCascadeRT.width,
        frameBuffers.quadCascadeRT.height,
      ],
      tPrev: frameBuffers.quadCascadeRT.attachments[0],
    },
    frameBuffers.spareQuadCascadeRT
  );

  renderTo(gl, applyGamma, bufferInfo, {
    resolution: [gl.canvas.width, gl.canvas.height],
    tPrev: frameBuffers.spareQuadCascadeRT.attachments[0],
  });
}

function renderCasadeScene() {
  renderTo(
    gl,
    cascadeQuadRender,
    bufferInfo,
    {
      resolution: [
        frameBuffers.spareQuadCascadeRT.width,
        frameBuffers.spareQuadCascadeRT.height,
      ],
      tPrevCascade: frameBuffers.quadCascadeRT.attachments[0],
    },
    frameBuffers.spareQuadCascadeRT
  );
}

function render(time) {
  stats.begin();
  windowManager.update();
  inputState.update(game, input.getState());
  game.update();
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  renderScene(time);
  renderDistance(time);

  let depth = data.addNumber({
    displayName: "Initial Depth",
    defaultValue: Math.log2(width) - 3,
    min: 1,
    max: Math.log2(width) - 3,
    step: 1,
  }).value;

  renderTo(
    gl,
    fillColor,
    bufferInfo,
    { color: [0, 0, 0, 0] },
    frameBuffers.cascadeRT
  );
  renderTo(
    gl,
    fillColor,
    bufferInfo,
    { color: [0, 0, 0, 0] },
    frameBuffers.quadCascadeRT
  );

  while (
    depth >=
    data.addNumber({
      displayName: "Final Depth",
      defaultValue: 0,
      min: 0,
      max: 8,
      step: 1,
    }).value
  ) {
    renderDepth(time, depth);
    depth--;
  }

  switch (
    data.addEnum({
      displayName: "Render Mode",
      defaultValue: "Render Cascade",
      options: ["Render Cascade", "Cascade Levels"],
    }).value
  ) {
    case "Cascade Levels":
      renderCascadeLevel();
      break;
    case "Render Cascade":
    default:
      renderCasadeScene();
      break;
  }

  drawToBuffer(time, frameBuffers.spareQuadCascadeRT, 0.05, game);

  renderTo(gl, applyGamma, bufferInfo, {
    resolution: [gl.canvas.width, gl.canvas.height],
    tPrev: frameBuffers.spareQuadCascadeRT.attachments[0],
  });

  if (toSave) {
    saveImage();
  }

  stats.end();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
