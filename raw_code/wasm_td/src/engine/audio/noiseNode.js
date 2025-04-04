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

export class NoiseNode extends AudioBufferSourceNode {
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
