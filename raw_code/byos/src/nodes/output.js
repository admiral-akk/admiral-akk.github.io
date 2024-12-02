class Output {
  constructor(context) {
    this.context = context;
  }

  static shortName = "c";

  getInput(key) {
    switch (key) {
      default:
        return this.context.destination;
    }
  }
  static dataToString = function (data) {
    return ``;
  };
  static dataFromString = function (str) {
    return {};
  };

  updateData() {}
}

export { Output };
