export class Bimap {
  constructor() {
    this.kv = new Map();
    this.vk = new Map();
  }

  set(k, v) {
    this.kv.set(k, v);
    this.vk.set(v, k);
  }

  getKey(k) {
    return this.kv.get(k);
  }

  getValue(v) {
    return this.vk.get(v);
  }

  removeKey(k) {
    this.vk.delete(this.kv.get(k));
    this.kv.delete(k);
  }

  removeValue(v) {
    this.kv.delete(this.vk.get(v));
    this.vk.delete(v);
  }

  size() {
    return this.kv.size;
  }
}
