import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import { WindowManager } from "./util/window.js";
import { generateRegularPolygon, generateSymmetricMesh } from "./mesh.js";
import { Camera } from "./components/camera.js";
import {
  createProgram,
  createPostProcessProgram,
  getPostProcessVao,
} from "./program.js";
import { InstancedMesh } from "./renderer/instancedMesh.js";
import { Entity } from "./ecs/entity.js";
import { Mesh } from "./components/mesh.js";
import { Hex } from "./components/hex.js";
import { Transform } from "./components/transform.js";
import { UpdateMeshTransform } from "./systems/UpdateMeshTransform.js";
import { AnimateMeshTransform } from "./systems/animateMeshTransform.js";
import { MoveCamera } from "./systems/moveCamera.js";

const dataManager = new DataManager(
  new DefaultCompressor(),
  new DefaultPreprocessor()
);
const windowManager = new WindowManager(16 / 9);
const gl = windowManager.canvas.getContext("webgl2");

const vertexShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: vert

precision mediump float;

uniform mat4 uView;
uniform mat4 uProjection;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aColor;
layout(location = 2) in mat4 aModel;
layout(location = 6) in ivec4 aInstancedMetadata;

out vec3 vColor;
out vec2 vUv;
out vec4 vPos;
out vec4 vTransPos;
flat out ivec4 vInstancedMetadata;

void main() {
    vPos = aModel * vec4(aPosition,1.);

    gl_Position = uProjection * uView * vPos;
    vUv = aPosition.xz;
    vColor = aColor;
    vTransPos = gl_Position;
    vInstancedMetadata = aInstancedMetadata;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec3 vColor;
in vec2 vUv;
in vec4 vPos;
in vec4 vTransPos;
flat in ivec4 vInstancedMetadata;

uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform ivec4 uClickedCoord;

layout(location=0) out vec4 fragColor; 
layout(location=1) out float depth; 

void main() {
  
  float noiseVal = texture(uSampler2, 0.9 * vPos.xz).r - texture(uSampler1, 0.9 * vPos.xz).r;
  float dist = smoothstep(0.3,0.35,length(vUv)-  0.4 * noiseVal);

  float distFromZero = 0.;


  fragColor = vec4((dist / 2. + 0.5 - distFromZero / 4.) * vColor, 1.);
  if (vInstancedMetadata.x - uClickedCoord.x == 0 ) {
    fragColor = vec4(1.,0.,0.,1.);
  }
  depth = vTransPos.z / 20.;
}`;

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
const quadFragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

uniform sampler2D uDepth;
uniform sampler2D uColor;
uniform vec3 uBackgroundColor;

in vec2 vTexCoord;

out vec4 fragColor;

float linearDepth(float depthSample)
{
float f = 10.0; //far plane
float n =  0.01; //near plane
return (2.0 * n) / (f + n - depthSample * (f - n));
}
void main()
{
float far = 10.0; //far plane
float near =  0.01; //near plane
float depthTexVal = texture(uDepth, vTexCoord).x ;
float depth = near + texture(uDepth, vTexCoord).x * (far - near);
float nonLinearDepth = 1. / (depthTexVal * (1. / far + 1. / near) + 1. / near);
  fragColor =  vec4(depth, 0., 0., 1.);
  fragColor =  vec4(depth - 9., 0., 0., 1.);
  fragColor =  vec4(texture(uColor, vTexCoord).rgb, 1.);

  fragColor = mix(fragColor, vec4(uBackgroundColor, 1.), pow(depthTexVal, 0.25) * vTexCoord.y);
}`;

const quadProgram = createPostProcessProgram(gl, quadFragmentShaderSource);

const quadVAO = getPostProcessVao(gl);

const generateHexVerts = () => {
  const params = [
    [-0.5, 1, [0.3, 0.3, 0.3]],
    [-0.25, 1, [0.4, 0.4, 0.0]],
    [0, 0.8, [0.0, 0.4, 0.0]],
  ];
  const hexVerts = generateRegularPolygon(6, 1);
  return generateSymmetricMesh(params, hexVerts);
};

const xDim = 4;
const yDim = 4;
const instancedMesh = new InstancedMesh(gl, generateHexVerts(), 1000);
const backgroundInstance = new InstancedMesh(
  gl,
  generateSymmetricMesh(
    [[0, 1, [123 / 255, 217 / 255, 246 / 255]]],
    generateRegularPolygon(4, 100)
  ),
  1
);

const target = new InstancedMesh(
  gl,
  generateSymmetricMesh(
    [
      [-0.25, 0.25, [1, 0, 0]],
      [0.25, 0.25, [1, 0, 0]],
    ],
    generateRegularPolygon(4, 1)
  ),
  1
);

var clickedIndex = -1;

// FBO
const catLoc = 1;
const otherLoc = 2;
const colorLoc = 1;
const depthLoc = 2;
const catTexture = gl.createTexture();
const noiseTexture = gl.createTexture();
const fragColorTexture = gl.createTexture();

const fbo = gl.createFramebuffer();

gl.bindTexture(gl.TEXTURE_2D, fragColorTexture);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, gl.canvas.width, gl.canvas.height);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.bindTexture(gl.TEXTURE_2D, null);

const depthTexture = gl.createTexture();
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

const entities = [];

const cameraEntity = new Entity();

{
  cameraEntity.addComponent(new Camera());
  const t = new Transform();
  t.setPosition([0, -4, 0]);
  cameraEntity.addComponent(t);
  entities.push(cameraEntity);
}
const spawnHexAt = (coord) => {
  if (!Hex.get(coord)) {
    const e = new Entity();
    e.addComponent(new Mesh(gl, instancedMesh));
    e.addComponent(new Transform());
    e.addComponent(new Hex(coord));
    entities.push(e);
    return e;
  }
  return null;
};

const spawnAroundHex = (entity) => {
  const center = entity.components.hex.coords;
  const offset = center[0] % 2 === 0 ? 0 : -1;
  spawnHexAt([center[0], center[1] + 1]);
  spawnHexAt([center[0], center[1] - 1]);
  spawnHexAt([center[0] + 1, center[1] + offset]);
  spawnHexAt([center[0] + 1, center[1] + offset + 1]);
  spawnHexAt([center[0] - 1, center[1] + offset]);
  spawnHexAt([center[0] - 1, center[1] + offset + 1]);
};

// to spawn around 0,0, we need
//

const start = spawnHexAt([1, 0]);
spawnAroundHex(start);

{
  const e = new Entity();
  e.addComponent(new Mesh(gl, backgroundInstance));
  const t = new Transform();
  t.setPosition([0, -4, 0]);
  e.addComponent(t);
  entities.push(e);
}

const targetTransform = new Transform();
{
  const targetEntity = new Entity();
  targetEntity.addComponent(new Mesh(gl, target));
  targetTransform.setPosition([0, -50, 0]);
  targetEntity.addComponent(targetTransform);
  entities.push(targetEntity);
}

const systems = [
  new MoveCamera(),
  new AnimateMeshTransform(),
  new UpdateMeshTransform(),
];

document.addEventListener("click", handleClick);

const actions = [];
function handleClick(event) {
  const { horizontalOffset, verticalOffset } = windowManager.sizes;
  if (event.target.id === "webgl") {
    const x = (event.clientX - horizontalOffset) / gl.canvas.width;
    const y = (event.clientY - verticalOffset) / gl.canvas.height;
    actions.push({ type: "clicked", val: [x, y] });
  }
}

var clickedEntity = null;

const applyActions = () => {
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    switch (action.type) {
      case "clicked":
        const val = action.val;
        const [startPos, dir] = cameraEntity.components.camera.rayCast(gl, val);

        const [h, coord, mesh] = instancedMesh.hit(startPos, dir, xDim * yDim);
        if (h !== null) {
          const e = mesh.getEntity();
          clickedEntity = e;
          const [x, y] = e.components["hex"].coords;
          clickedIndex = coord;
          targetTransform.setPosition(h);
          cameraEntity.components.camera.setTarget(
            e.components["transform"].pos
          );
          spawnAroundHex(e);
        }

        break;
      default:
        break;
    }
  }
  actions.length = 0;
};

// two kinds of steps - animation and game action
//
// idea for animation:
// have an "animation stack" for things, so that the game state can be ahead of the animation

const applySystems = () => {
  for (let systemIndex = 0; systemIndex < systems.length; systemIndex++) {
    const system = systems[systemIndex];
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (system.canApply(entity)) {
        systems[systemIndex].apply(entity.components);
      }
    }
  }
};

const step = () => {
  // handle user input
  applyActions();

  // step through system
  applySystems();
};

const draw = () => {
  requestAnimationFrame(draw);

  step();

  gl.useProgram(program);
  cameraEntity.components.camera.applyCameraUniforms(gl, program);

  gl.activeTexture(gl.TEXTURE0 + otherLoc);
  gl.bindTexture(gl.TEXTURE_2D, catTexture);
  gl.activeTexture(gl.TEXTURE0 + catLoc);
  gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
  gl.uniform1i(gl.getUniformLocation(program, "uSampler1"), catLoc);
  gl.uniform1i(gl.getUniformLocation(program, "uSampler2"), otherLoc);

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  gl.uniform4iv(gl.getUniformLocation(program, "uClickedCoord"), [
    clickedIndex,
    0,
    0,
    0,
  ]);

  instancedMesh.render(gl);
  backgroundInstance.render(gl);
  target.render(gl);

  gl.disable(gl.DEPTH_TEST);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // Step 2: Draw the quad and pick a texture to render
  gl.useProgram(quadProgram);
  gl.bindVertexArray(quadVAO);

  gl.activeTexture(gl.TEXTURE0 + depthLoc);
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.activeTexture(gl.TEXTURE0 + colorLoc);
  gl.bindTexture(gl.TEXTURE_2D, fragColorTexture);
  gl.uniform3fv(
    gl.getUniformLocation(quadProgram, "uBackgroundColor"),

    new Float32Array([123 / 255, 217 / 255, 246 / 255])
  );
  gl.uniform1i(gl.getUniformLocation(quadProgram, "uDepth"), depthLoc);
  gl.uniform1i(gl.getUniformLocation(quadProgram, "uColor"), colorLoc);

  gl.enable(gl.BLEND);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.disable(gl.BLEND);
  gl.bindVertexArray(null);
};

const loadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.src = src;
  });

const run = async () => {
  const image = await loadImage("./kitten.png");
  gl.bindTexture(gl.TEXTURE_2D, catTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    256,
    256,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    image
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.bindTexture(gl.TEXTURE_2D, null);
  const noise = await loadImage("./noiseTexture.png");
  gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    256,
    256,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    noise
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.bindTexture(gl.TEXTURE_2D, null);
  draw();
};

run();

// webgl types

// Standard Objects

// buffer
// texture
// renderbuffer
// sampler??
// query??

// Containers

// VertexArray
// Framebuffer
// TransformFeedback

// need to add:

// 1. Camera support - can mimic this on the software side
// 2. Hex Mesh -
// 3. Hex placement
// 4. Hex shader
// 5. More complicated hex mesh
// 6. Layout trees and stuff
