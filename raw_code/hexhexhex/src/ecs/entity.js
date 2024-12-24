var entityId = 0;

class Entity {
  constructor() {
    this.id = entityId++;
    this.components = {};
  }

  addComponent(component) {
    this.components[component.constructor.name.toLowerCase()] = component;
  }

  removeComponent(component) {
    delete this.components[component.constructor.name.toLowerCase()];
  }
}

const archetypes = new Map();

const getArchetype = (components) => {
  var name = "";
  for (let i = 0; i < components.length; i++) {
    name = name + component.constructor.name + ",";
  }

  if (archetypes.get(name) === undefined) {
    archetypes.set(name, new Archetype(components));
  }
  return archetypes.get(name);
};

class Archetype {
  constructor(components) {}
}

export { Entity };
