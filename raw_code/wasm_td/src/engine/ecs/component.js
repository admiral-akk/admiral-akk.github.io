const entityMap = new Map();

const componentWithoutEntity = [];

class Component {
  constructor() {
    componentWithoutEntity.push(this);
  }

  addComponent(entity) {
    componentWithoutEntity.remove(this);
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

  static checkUnallocatedComponents() {
    if (componentWithoutEntity.length > 0) {
      throw new Error(
        "Components are allocated without entities!",
        componentWithoutEntity
      );
    }
  }
}

export { Component };
