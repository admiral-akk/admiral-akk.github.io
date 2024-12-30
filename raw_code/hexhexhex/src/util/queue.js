export class Queue extends Array {
  constructor(initialSize = 10) {
    super();
    this.start = 0;
    this.count = 0;
    this.push(undefined);
    this.resize(initialSize);
  }

  resize(newSize) {
    // move all of the elements that wrap around to the back.
    const wrapSize =
      this.start === 0 ? this.count : this.count - (this.length - this.start);

    for (let i = 0; i < wrapSize; i++) {
      this.push(this[i]);
    }

    while (this.length < newSize) {
      this.push(undefined);
    }
  }

  size() {
    return this.count;
  }

  front() {
    return this.count === 0 ? undefined : this[this.start];
  }

  back() {
    return this.count === 0
      ? undefined
      : this[(this.start + this.count - 1) % this.length];
  }

  queue(elem) {
    if (this.length == this.count) {
      this.resize(2 * this.length);
    }
    this[(this.start + this.count++) % this.length] = elem;
  }

  dequeue() {
    if (this.count === 0) {
      return undefined;
    }
    const v = this[this.start];
    this.count--;
    this.start = (this.start + 1) % this.length;
    return v;
  }

  [Symbol.iterator]() {
    var index = this.start;
    var count = this.count;
    var data = this._data;

    const getIndex = () => {
      index = (index + 1) % data.length;
      return index;
    };
    return {
      next: () => {
        return { value: data[getIndex()], done: --count };
      },
    };
  }
}
