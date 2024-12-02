class Delay extends DelayNode {
  constructor(context) {
    super(context);
  }
  static shortName = "d";
  getInput(key) {
    switch (key) {
      case "input_1":
        return this;
      case "input_2":
      default:
        return this.delayTime;
    }
  }
  updateData(data) {
    this.delayTime.value = Number(data.delay);
  }

  static dataFromString(str) {
    const delay = Number(str);
    return {
      delay,
    };
  }
  static dataToString(data) {
    const { delay } = data;
    const dataStr = `${delay}`;

    return dataStr;
  }
}

export { Delay };
