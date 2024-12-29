var entityId = 0;

const entities = [];

class Entity {
  constructor(...components) {
    this.id = entityId++;
    this.components = {};
    entities.push(this);
    this.addComponent(...components);
  }

  addComponent(...components) {
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      this.components[component.getName()] = component;
      component.addComponent(this);
    }
  }

  removeComponent(component) {
    component.removeComponent();
    delete this.components[component.getName()];
  }

  deleteEntity() {
    for (const [_, c] of Object.entries(this.components)) {
      this.removeComponent(c);
    }

    entities.splice(entities.indexOf(this), 1);
  }
}

export { Entity, entities };
