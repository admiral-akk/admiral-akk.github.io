var entityId = 0;

class Entity {
  constructor() {
    this.id = entityId++;
    this.components = {};
  }

  addComponent(component) {
    this.components[component.constructor.name.toLowerCase()] = component;
    component.addComponent(this);
  }

  removeComponent(component) {
    component.removeComponent();
    delete this.components[component.constructor.name.toLowerCase()];
  }
}

export { Entity };
