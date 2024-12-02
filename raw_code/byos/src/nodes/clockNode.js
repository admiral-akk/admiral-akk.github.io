class ClockNode {
  constructor(context) {
    this.context = context;
    this.bpm = 60;
    this.connections = [];
    this.schedule();
  }

  static shortName = "c";

  static dataToString(data) {
    return `${data.bpm}`;
  }

  schedule() {
    const currentTime = this.context.currentTime;
    const minBPM = Math.max(1, this.bpm);
    const nextNoteTime =
      currentTime + 60 / minBPM - (currentTime % (60 / minBPM));
    const nextNextNoteTime = nextNoteTime + 60 / minBPM;
    for (let i = 0; i < this.connections.length; i++) {
      const connection = this.connections[i];
      connection.applyEnvelope(nextNoteTime);
      connection.applyEnvelope(nextNextNoteTime);
    }
    setTimeout(() => {
      this.schedule();
    }, 30 / Math.max(60, minBPM));
  }

  static dataFromString(str) {
    return { bpm: Number(str) };
  }

  getInput(key) {
    return this;
  }

  updateData(data) {
    this.bpm = Number(data.bpm);
  }

  connect(recievingInput) {
    console.log("current", this.context.currentTime);
    this.connections.push(recievingInput);
  }

  disconnect(targetInput) {
    const index = this.connections.indexOf(targetInput);
    if (index > -1) {
      this.connections = this.connections.splice(index, 1);
    }
  }
}

export { ClockNode };
