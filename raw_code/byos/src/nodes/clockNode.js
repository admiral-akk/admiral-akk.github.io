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
    const nextNoteTime =
      currentTime + 60 / this.bpm - (currentTime % (60 / this.bpm));
    const nextNextNoteTime = nextNoteTime + 60 / this.bpm;
    for (let i = 0; i < this.connections.length; i++) {
      const connection = this.connections[i];
      connection.applyEnvelope(nextNoteTime);
      connection.applyEnvelope(nextNextNoteTime);
    }
    setTimeout(() => {
      this.schedule();
    }, 30 / this.bpm);
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
