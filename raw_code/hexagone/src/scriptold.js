import "./style.css";
import { WindowManager } from "./engine/window.js";
import { DataManager } from "./engine/data.js";
import Stats from "stats-js";
import * as twgl from "twgl.js";
import { InputManager } from "./engine/input.js";
import calculateQuadCascade from "./shaders/quadCascade.fs";
import { withLogging } from "./utils/debug.js";
import renderQuadCascade from "./shaders/renderQuadCascade.fs";
import GUI from "lil-gui";
import "./script.js";

const data = new DataManager();
data.init();

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
function applyEnvelope(node, value, points) {
  for (let i = 0; i < points.length; i++) {
    const [t, v] = points[i];
    node[value].exponentialRampToValueAtTime(v, audioContext.currentTime + t);
  }
}

function play() {
  const debug = {
    fm: {
      type: data.addEnum(
        "FM Osc - Waveform",
        "sine",
        ["sawtooth", "sine", "square", "triangle"],
        () => play()
      ).value,
      frequency: data.addNumber("FM Osc - Frequency", 48, 0, 96, 1, () =>
        play()
      ).value,
      attack: data.addNumber("FM Osc - Attack", 0.1, 0.01, 0.4, 0.01, () =>
        play()
      ).value,
      decay: data.addNumber("FM Osc - Decay", 0.1, 0.01, 0.4, 0.01, () =>
        play()
      ).value,
    },
    osc: {
      type: data.addEnum(
        "Osc - Waveform",
        "sine",
        ["sawtooth", "sine", "square", "triangle"],
        () => play()
      ).value,
      frequency: data.addNumber("Osc - Frequency", 48, 0, 96, 1, () => play())
        .value,
      attack: data.addNumber("Osc - Attack", 0.1, 0.01, 0.4, 0.01, () => play())
        .value,
      decay: data.addNumber("Osc - Decay", 0.1, 0.01, 0.4, 0.01, () => play())
        .value,
    },
    filter: {
      type: data.addEnum(
        "Filter - Type",
        "allpass",
        ["lowpass", "allpass", "bandpass", "highpass", "highshelf", "lowshelf"],
        () => play()
      ).value,
      frequency: data.addNumber("Filter - Frequency", 20, 20, 1000, 1, () =>
        play()
      ).value,
      attack: data.addNumber("Filter - Attack", 0.1, 0.01, 0.4, 0.01, () =>
        play()
      ).value,
      decay: data.addNumber("Filter - Decay", 0.1, 0.01, 0.4, 0.01, () =>
        play()
      ).value,
      strength: data.addNumber("Filter - Strength", 0.5, 0.0, 1, 0.01, () =>
        play()
      ).value,
    },
    delay: {
      time: data.addNumber("Delay - Time", 0.2, 0.01, 0.4, 0.01, () => play())
        .value,
      gain: data.addNumber("Delay - Gain", 0.3, 0.0, 1, 0.01, () => play())
        .value,
    },
    gain: {
      gain: data.addNumber("Gain - Gain", 1, 0.0, 1, 0.01, () => play()).value,
      attack: data.addNumber("Gain - Attack", 0.1, 0.01, 0.4, 0.01, () =>
        play()
      ).value,
      decay: data.addNumber("Gain - Decay", 0.1, 0.01, 0.4, 0.01, () => play())
        .value,
    },
    overall: {
      length: data.addNumber("Overall - Length", 1, 0.1, 3, 0.01, () => play())
        .value,
    },
  };

  const osc = audioContext.createOscillator();
  const oscGain = audioContext.createGain();
  const mixer = audioContext.createGain();

  const filter = audioContext.createBiquadFilter();
  const postFilterGain = audioContext.createGain();
  const skipFilterGain = audioContext.createGain();
  const delay = audioContext.createDelay();
  const delayFeedbackGain = audioContext.createGain();
  const finalGain = audioContext.createGain();
  const compressorNode = audioContext.createDynamicsCompressor();
  const endGain = audioContext.createGain();

  const freq = 256 * Math.pow(2, (debug.osc.frequency - 48) / 12);
  const fmOsc = audioContext.createOscillator();
  fmOsc.frequency.value = debug.fm.frequency;
  const E_gain = audioContext.createGain();
  E_gain.gain.value = freq;
  fmOsc.connect(E_gain);
  E_gain.connect(osc.frequency);
  osc.connect(oscGain);
  oscGain.connect(mixer);
  mixer.connect(skipFilterGain);
  mixer.connect(filter);
  filter.connect(postFilterGain);
  skipFilterGain.connect(delay);
  postFilterGain.connect(delay);
  delay.connect(delayFeedbackGain);
  delayFeedbackGain.connect(mixer);
  delay.connect(finalGain);
  finalGain.connect(endGain);
  endGain.connect(audioContext.destination);

  // osc.frequency.setValueAtTime(freq, 0);
  // applyEnvelope(osc, "frequency", [
  //   [debug.osc.attack, freq],
  //   [debug.osc.attack + debug.osc.decay, 0.001],
  // ]);
  osc.type = debug.osc.type;

  mixer.gain.setValueAtTime(1, audioContext.currentTime);

  filter.type = debug.filter.type;
  filter.frequency.setValueAtTime(
    debug.filter.frequency,
    audioContext.currentTime
  );
  applyEnvelope(filter, "frequency", [
    [0, 10000],
    [debug.filter.attack, debug.filter.frequency],
    [debug.filter.attack + debug.filter.decay, 0.001],
  ]);

  postFilterGain.gain.value = debug.filter.strength;
  skipFilterGain.gain.value = 1 - postFilterGain.gain.value;

  applyEnvelope(oscGain, "gain", [
    [0, 0.001],
    [debug.gain.attack, debug.gain.gain],
    [debug.gain.attack + debug.gain.decay, 0.001],
  ]);

  delay.delayTime.value = debug.delay.time;
  delayFeedbackGain.gain.value = debug.delay.gain;

  const length = debug.overall.length;
  endGain.gain.setValueAtTime(1, audioContext.currentTime);
  endGain.gain.exponentialRampToValueAtTime(
    1,
    audioContext.currentTime + length - 0.04
  );
  endGain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + length - 0.013
  );

  fmOsc.start(audioContext.currentTime);
  fmOsc.stop(audioContext.currentTime + length);
  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + length);
  osc.onended = () => {
    osc.disconnect();
    oscGain.disconnect();
    mixer.disconnect();
    filter.disconnect();
    postFilterGain.disconnect();
    skipFilterGain.disconnect();
    delay.disconnect();
    delayFeedbackGain.disconnect();
    finalGain.disconnect();
    endGain.disconnect();
    osc.disconnect();
  };
}

play();

// Render Pipeline

const gl = document.getElementById("webgl").getContext("webgl2");
twgl.resizeCanvasToDisplaySize(gl.canvas);
twgl.addExtensionsToContext(gl);

// Time

// Canvas Manager

const windowManager = new WindowManager(2);

// Input handler

const input = new InputManager(windowManager);

// Data Storage Layer

// Draw Lines
windowManager.listeners.push({
  updateSize: ({ width, height }) => {
    gl.canvas.width = width;
    gl.canvas.height = height;
  },
});
windowManager.update();

class TimeManager {
  constructor({ fps = 60 }) {
    this.frame = 0;
    this.fps = fps;
    this.initialTime = Date.now();
    this.lastDelta = Date.now();
  }

  getDeltaTime() {
    const now = Date.now();
    const deltaTime = now - this.lastDelta;
    this.lastDelta = Date.now();
    return Math.min(1000 / this.fps, deltaTime);
  }

  timeToNextRender() {
    this.frame++;
    const timeSinceStart = Date.now() - this.initialTime;
    const delta = 1000 / this.fps;
    return timeSinceStart % delta;
  }
}

const time = new TimeManager({ fps: 60 });

const toSave = { requested: false };

function render() {
  stats.begin();
  windowManager.update();
  const state = input.getState();
  if ((state["control"] || state["meta"]) && state["s"]) {
    toSave.requested = true;
  }

  twgl.resizeCanvasToDisplaySize(gl.canvas);

  setTimeout(() => {
    requestAnimationFrame(render);
  }, time.timeToNextRender());
  stats.end();
}

requestAnimationFrame(render);
