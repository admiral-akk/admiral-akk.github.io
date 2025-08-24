function toAudioBufferNode(audioCtx, arr) {
  const myArrayBuffer = audioCtx.createBuffer(1, arr.length, 44100);
  const nowBuffering = myArrayBuffer.getChannelData(0);
  for (let i = 0; i < arr.length; i++) {
    let t = Math.min(1, i / 2000, (arr.length - i - 1) / 2000);
    nowBuffering[i] = (t * (arr[i] - 64)) / 64;
  }
  return myArrayBuffer;
}

class DrumMachine {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.sounds = new Map();
    this.isPlaying = false;
    this.tempo = 60; // BPM
    this.currentStep = 0;
    this.totalSteps = 16;
    this.patterns = new Map();
    this.nextNoteTime = 0;
    this.lookahead = 125.0; // ms
    this.scheduleAheadTime = 0.2; // seconds
  }

  addSound(name, sfxrConfig) {
    const audioBuffer = toAudioBufferNode(
      this.audioContext,
      sfxr.toBuffer(sfxrConfig)
    );

    this.sounds.set(name, audioBuffer);
    this.patterns.set(name, new Array(this.totalSteps).fill(false));
  }

  setPattern(soundName, pattern) {
    this.patterns.set(soundName, pattern);
  }

  playSound(soundName, when = 0, volume = 0.1) {
    const audioBuffer = this.sounds.get(soundName);
    if (!audioBuffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(when);
    return source;
  }

  scheduler() {
    while (
      this.nextNoteTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      this.nextStep();
    }
  }

  scheduleNote(beatNumber, time) {
    // Check each sound's pattern
    this.patterns.forEach((pattern, soundName) => {
      if (pattern.includes(beatNumber)) {
        this.playSound(soundName, time);
      }
    });
  }

  nextStep() {
    const secondsPerBeat = 60.0 / this.tempo / 4; // 16th notes
    this.nextNoteTime += secondsPerBeat;
    this.currentStep = (this.currentStep + 1) % this.totalSteps;
  }

  start() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.audioContext.currentTime;

    // Use setInterval for scheduling
    this.timer = setInterval(() => this.scheduler(), this.lookahead);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export { DrumMachine };
