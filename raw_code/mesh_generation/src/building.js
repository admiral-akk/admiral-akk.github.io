import { generateRegularPolygon, generateSymmetricMesh } from "./renderer/mesh";

const optionSize = 0.1;

const blueprintBlue = "#5D40EE";
const villageBeige = "#e4d5b7";
const quarryGrey = "#aaaaaa";
const loggingBrown = "#5D4037";
const farmYellow = "#dddd00";

const buildings = {};

const generateHutMesh = (color) =>
  generateSymmetricMesh(
    [
      [0, 0.3, color],
      [0.2, 0.3, color],
      [0.2, 0.4, color],
      [0.4, 0, color],
    ],
    generateRegularPolygon(12, 1)
  );

const generateQuarryMesh = (color) =>
  generateSymmetricMesh(
    [
      [0, 0.3, color],
      [0.4, 0, color],
    ],
    generateRegularPolygon(4, 1)
  );
const generateLoggingMesh = (color) =>
  generateSymmetricMesh(
    [
      [0, 0.3, color],
      [0.4, 0.3, color],
      [0.4, 0, color],
    ],
    generateRegularPolygon(12, 1)
  );
const generateOptionMesh = (color) =>
  generateSymmetricMesh(
    [
      [-optionSize, optionSize, color],
      [optionSize, optionSize, color],
      [optionSize, 0, color],
    ],
    generateRegularPolygon(4, 1)
  );

const addBuilding = (...newBuildings) => {
  for (let i = 0; i < newBuildings.length; i++) {
    const building = newBuildings[i];
    building.id = Object.keys(buildings).length;
    buildings[building.name] = building;
  }
};

const addBuildingBlueprint = (blueprint, building) => {
  buildings[building.name] = building;
  blueprint.name = building.name + "Blueprint";
  blueprint.upgrade[0].result = buildings[building.name];
  blueprint.production = [];
};

const addParamBuilding = ({
  name,
  color,
  production,
  upgradeInput,
  meshGenerator,
}) => {
  const building = {
    name,
    production,
    mesh: meshGenerator(color),
    upgrade: [],
    option: generateOptionMesh(color),
  };
  buildings[building.name] = building;
  const buildingBlueprint = {
    name: building.name + "Blueprint",
    production: [],
    mesh: meshGenerator(blueprintBlue),
    upgrade: [
      {
        input: upgradeInput,
        result: building,
      },
    ],
    option: generateOptionMesh(color),
  };
  buildings[buildingBlueprint.name] = buildingBlueprint;
};

addParamBuilding({
  name: "farm",
  color: farmYellow,
  production: [{ input: { people: 1 }, output: { food: 2 } }],
  upgradeInput: {
    people: 1,
    wood: 1,
  },
  meshGenerator: generateHutMesh,
});

addParamBuilding({
  name: "village",
  color: villageBeige,
  production: [
    {
      input: {},
      output: { people: 3 },
    },
  ],
  upgradeInput: {
    people: 1,
    wood: 1,
  },
  meshGenerator: generateHutMesh,
});

addParamBuilding({
  name: "quarry",
  color: quarryGrey,
  production: [{ input: { people: 1 }, output: { stone: 2 } }],
  upgradeInput: {
    people: 2,
  },
  meshGenerator: generateQuarryMesh,
});

addParamBuilding({
  name: "loggingCamp",
  color: loggingBrown,
  production: [{ input: { people: 1 }, output: { wood: 2 } }],
  upgradeInput: {
    people: 2,
  },
  meshGenerator: generateLoggingMesh,
});

export { buildings };
