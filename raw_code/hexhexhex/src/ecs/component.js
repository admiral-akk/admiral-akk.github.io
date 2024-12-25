const entityMap = new Map();

class Component {
  addComponent(entity) {
    entityMap.set(this, entity);
  }

  removeComponent() {
    entityMap.delete(this);
  }

  getEntity() {
    return entityMap.get(this);
  }

  getName() {
    return this.constructor.name.toLowerCase();
  }
}

export { Component };
