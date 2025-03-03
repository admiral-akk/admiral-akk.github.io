import { getEntitiesWith } from "./entity";

class System {
  constructor(componentConstructors) {
    this.targetComponents = componentConstructors;
  }

  run() {
    getEntitiesWith(...this.targetComponents).forEach((e) => {
      this.apply(e.components, e);
    });
  }

  // has to be implemented;
  apply(components) {}
}

export { System };
