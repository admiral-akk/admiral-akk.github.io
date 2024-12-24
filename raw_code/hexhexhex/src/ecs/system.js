class System {
  constructor(componentConstructors) {
    this.targetComponents = Array.from(
      componentConstructors.map((c) => c.name.toLowerCase())
    );
  }

  canApply(entity) {
    var hasAll = true;
    for (let i = 0; i < this.targetComponents.length; i++) {
      hasAll &= entity.components[this.targetComponents[i]] !== undefined;
    }
    return hasAll;
  }

  // has to be implemented;
  apply(components) {}
}

export { System };
