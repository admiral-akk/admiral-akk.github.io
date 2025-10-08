import "./util/array.js";
import { time } from "./engine/time.js";
import * as THREE from "three";
import { Network } from "./engine/network";

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

const DEV_URL = "localhost:3000";
const PROD_URL = "https://matchmaker.k3z3.com";

const socket = new Network("hello world", DEV_URL);

const mousePos = { x: 0, y: 0 };

document.addEventListener("click", (event) => {});

document.addEventListener("mousemove", (event) => {
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;
});

document.addEventListener("keydown", (event) => {});

function getFrame() {
  return Math.floor((60 * (performance.timeOrigin + performance.now())) / 1000);
}
document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowUp":
      socket.emit({ type: "move", x: 0, y: 0.1 });
      break;
    case "ArrowDown":
      socket.emit({ type: "move", x: 0, y: -0.1 });
      break;
    case "ArrowLeft":
      socket.emit({ type: "move", x: -0.1, y: 0 });
      break;
    case "ArrowRight":
      socket.emit({ type: "move", x: 0.1, y: 0 });
      break;
  }
});

// 1️⃣ Scene
const scene = new THREE.Scene();

// 2️⃣ Camera (Perspective)
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.z = 3;

// 3️⃣ Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 5️⃣ Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

const state = {
  lastMessage: 0,
  players: {},
  cubes: {},
};

function addCube() {
  // 4️⃣ Add a Cube
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  return cube;
}
// 7️⃣ Handle Resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const gameLoop = () => {
  inputManager.update();
  time.tick();
  requestAnimationFrame(gameLoop);

  const frameNumber = getFrame();
  // sync players
  for (let i = 0; i < socket.server.clients.length; i++) {
    const id = socket.server.clients[i].id;
    if (!state.players[id]) {
      console.log("New player", id);
      state.players[id] = socket.server.clients[i];
      state.cubes[id] = addCube();
    }
  }
  for (const id in state.players) {
    if (!socket.server.clients.find((c) => c.id === id)) {
      delete state.players[id];
      scene.remove(state.cubes[id]);
      delete state.cubes[id];
    }
  }
  for (let i = state.lastMessage; i < socket.messages.length; i++) {
    const msg = socket.messages[i];
    console.log(msg);
    switch (msg.data.msg.type) {
      case "move":
        state.cubes[msg.userId].position.x += msg.data.msg.x;
        state.cubes[msg.userId].position.y += msg.data.msg.y;
        break;
      default:
        if (msg.userId !== socket.socket.id) {
          appendMessage(msg.username, msg.data.msg);
        } else {
          appendMessage("You", msg.data.msg);
        }
    }
  }
  state.lastMessage = socket.messages.length;
  // Rotate the cube
  for (const id in state.cubes) {
    state.cubes[id].rotation.x = 0.01 * frameNumber;
    state.cubes[id].rotation.y = 0.01 * frameNumber;
  }

  renderer.render(scene, camera);
};

gameLoop();
