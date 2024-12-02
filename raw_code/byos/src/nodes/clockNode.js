class ClockNode {
  constructor(context) {
    this.context = context;
    this.bpm = 60;
    this.scheduledTil = 0;
    this.connections = [];
  }

  static shortName = "c";

  static dataToString(data) {
    return `${data.bpm}`;
  }

  schedule() {
    for (let i = 0; i < this.connections.length; i++) {
      const connection = this.connections[i];
    }
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
