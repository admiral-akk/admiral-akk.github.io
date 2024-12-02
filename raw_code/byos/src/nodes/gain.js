class Gain extends GainNode {
  constructor(context) {
    super(context);
  }

  getInput(key) {
    switch (key) {
      case "input_1":
        return this;
      case "input_2":
      default:
        return this.gain;
    }
  }
  static dataToString(data) {
    return `${data.gain}`;
  }
  static dataFromString(str) {
    return {
      gain: Number(str),
    };
  }
  updateData(data) {
    this.gain.value = Number(data.gain);
  }
}

export { Gain };
