class Oscillator extends OscillatorNode {
  constructor(context) {
    super(context);
  }
  static shortName = "o";
  static types = ["sine", "square", "sawtooth", "triangle"];
  getInput(key) {
    switch (key) {
      default:
        return this.frequency;
    }
  }
  static dataToString = function (data) {
    const { type, frequency } = data;
    const typeIndex = Oscillator.types.indexOf(type);
    return `${typeIndex}${frequency}`;
  };
  static dataFromString = function (str) {
    return {
      type: Oscillator.types[Number(str[0])],
      frequency: Number(str.substring(1)),
    };
  };
  updateData(data) {
    this.type = data.type;
    this.frequency.value = Number(data.frequency);
  }
}

export { Oscillator };
