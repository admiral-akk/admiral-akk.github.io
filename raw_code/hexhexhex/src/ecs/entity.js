var entityId = 0;

class Entity {
  constructor() {
    this.id = entityId++;
    this.components = {};
  }

  addComponent(component) {
    this.components[component.getName()] = component;
    component.addComponent(this);
  }

  removeComponent(component) {
    component.removeComponent();
    delete this.components[component.getName()];
  }
}

export { Entity };
