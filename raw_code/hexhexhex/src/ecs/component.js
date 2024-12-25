const entityMap = new Map();

class Component {
  constructor() {}

  addComponent(entity) {
    entityMap.set(this, entity);
  }

  removeComponent() {
    entityMap.delete(this);
  }

  getEntity() {
    return entityMap.get(this);
  }
}

export { Component };
