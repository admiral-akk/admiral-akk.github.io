class EnvelopeNode extends GainNode {
  static types = ["linear", "instant", "exp"];
  constructor(audioContext) {
    super(audioContext);
    this.audioContext = audioContext;
    this.constantNode = audioContext.createConstantSource();
    this.constantNode.connect(this);
    this.constantNode.start();
    this.data = {
      ramptype: "exp",
      peak: 1,
      attack: 1,
      decay: 1,
    };
  }

  static dataToString(data) {
    const { ramptype, peak, attack, decay } = data;
    const typeIndex = EnvelopeNode.types.indexOf(ramptype);
    const dataStr = `${typeIndex}${peak},${attack},${decay}`;

    return dataStr;
  }

  static dataFromString(str) {
    const ramptype = EnvelopeNode.types[Number(str[0])];
    const [peak, attack, decay] = str.substring(1).split(",");
    return {
      ramptype,
      attack: Number(attack),
      decay: Number(decay),
      peak: Number(peak),
    };
  }

  getInput(key) {
    return this;
  }

  updateData(data) {
    this.data.ramptype = data.ramptype;
    this.data.peak = Number(data.peak);
    this.data.attack = Number(data.attack);
    this.data.decay = Number(data.decay);
    this.applyEnvelope();
  }

  applyEnvelope() {
    var setValue;
    var currentTime = this.audioContext.currentTime;

    this.gain.cancelScheduledValues(currentTime);
    switch (this.data.ramptype) {
      case "linear":
        setValue = (val, t) => this.gain.linearRampToValueAtTime(val, t);
        break;
      case "instant":
        setValue = (val, t) => this.gain.setValueAtTime(val, t);
        break;
      default:
      case "exp":
        setValue = (val, t) => this.gain.exponentialRampToValueAtTime(val, t);
        break;
    }
    const addStep = (val, deltaTime) => {
      if (deltaTime > 0) {
        currentTime += deltaTime;
        setValue(val, currentTime);
      }
    };
    if (this.data.attack > 0) {
      this.gain.setValueAtTime(0.001, currentTime);
    }

    addStep(this.data.peak, this.data.attack);
    addStep(0.001, this.data.decay);
  }
}

export { EnvelopeNode };
