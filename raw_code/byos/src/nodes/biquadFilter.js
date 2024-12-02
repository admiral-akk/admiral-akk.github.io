class BiquadFilter extends BiquadFilterNode {
  constructor(context) {
    super(context);
  }
  static shortName = "f";
  updateData(data) {
    this.type = data.type;
    this.frequency.value = Number(data.frequency);
  }

  getInput(key) {
    switch (key) {
      case "input_1":
        return this;
      case "input_2":
      default:
        return this.frequency;
    }
  }

  static types = [
    "lowpass",
    "highpass",
    "bandpass",
    "lowshelf",
    "peaking",
    "notch",
    "allpass",
  ];

  static dataToString(data) {
    const { type, frequency } = data;
    const typeIndex = BiquadFilter.types.indexOf(type);
    return `${typeIndex}${frequency}`;
  }

  static dataFromString(str) {
    return {
      type: BiquadFilter.types[Number(str[0])],
      frequency: Number(str.substring(1)),
    };
  }
}

export { BiquadFilter };
