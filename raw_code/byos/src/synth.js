class Envelope {
  constructor(minVal) {
    this.minVal = minVal;
    this.currentTime = 0;
    this.points = [];
  }

  push(deltaTime, value) {
    const v = Math.max(value, this.minVal);
    if (this.currentTime === 0) {
      if (deltaTime > 0) {
        this.points.push([0, this.minVal]);
      }
    }
    this.currentTime += deltaTime;
    this.points.push([this.currentTime, v]);
  }
}
