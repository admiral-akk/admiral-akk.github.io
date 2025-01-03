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

const generateQuarryMesh = (color) => {
  generateSymmetricMesh(
    [
      [0, 0.3, color],
      [0.4, 0, color],
    ],
    generateRegularPolygon(4, 1)
  );
};

const generateLoggingMesh = (color) => {
  generateSymmetricMesh(
    [
      [0, 0.3, color],
      [0.4, 0.3, color],
      [0.4, 0, color],
    ],
    generateRegularPolygon(12, 1)
  );
};

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

addBuilding(
  {
    name: "farm",
    production: [{ input: { people: 1 }, output: { food: 2 } }],
    upgrade: [],
    mesh: generateHutMesh(farmYellow),
    option: generateOptionMesh(farmYellow),
  },
  {
    name: "farmBlueprint",
    production: [],
    upgrade: [
      {
        input: {
          people: 1,
          wood: 1,
        },
        result: buildings.farm,
      },
    ],
    mesh: generateHutMesh(blueprintBlue),
    option: generateOptionMesh(farmYellow),
  },
  {
    name: "village",
    production: [
      {
        input: {},
        output: { people: 3 },
      },
    ],
    upgrade: [],
    mesh: generateHutMesh(villageBeige),
    option: generateOptionMesh(villageBeige),
  },
  {
    name: "quarry",
    production: [{ input: { people: 1 }, output: { stone: 2 } }],
    upgrade: [],
    mesh: generateQuarryMesh(quarryGrey),
    option: generateOptionMesh(quarryGrey),
  },

  {
    name: "quarryBlueprint",
    production: [
      {
        input: {
          people: 2,
        },
        result: buildings.quarry,
      },
    ],
    upgrade: [],
    mesh: generateQuarryMesh(blueprintBlue),
    option: generateOptionMesh(quarryGrey),
  },
  {
    name: "loggingCamp",
    production: [{ input: { people: 1 }, output: { wood: 2 } }],
    upgrade: [],
    mesh: generateLoggingMesh(loggingBrown),
    option: generateOptionMesh(loggingBrown),
  },

  {
    name: "loggingCampBlueprint",
    production: [
      {
        input: {
          people: 2,
        },
        result: buildings.loggingCamp,
      },
    ],
    upgrade: [],
    mesh: generateLoggingMesh(blueprintBlue),
    option: generateOptionMesh(loggingBrown),
  }
);

export { buildings };
