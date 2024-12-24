var entityId = 0;

class Entity {
  constructor() {
    this.id = entityId++;
    this.components = [];
  }

  addComponent(component) {
    this.components.push(component);
  }

  removeComponent(component) {}
}

export { Entity };
