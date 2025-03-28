// keeps track of time, ensures that each step happens at a specific "time"

// tells you:
class Time {
  constructor() {
    this.start = Date.now();
    this.delta = 0.01;
    this.time = 0;
    this.frame = 0;
  }

  tick() {
    const next = Date.now();
    this.delta = (next - this.time * 1000) / 1000;
    this.time = (next - this.start) / 1000;
    this.frame++;
  }
}

const time = new Time();
export { time };
