import { generateRegularPolygon, generateSymmetricMesh } from "./renderer/mesh";

const resourceSize = 0.05;
const optionSize = 0.1;

const village = {
  id: 1,
  name: "",
  production: [
    {
      input: {
        food: 1,
      },
      output: { people: 3 },
    },
  ],
  upgrade: [],
  mesh: hutMesh,
  option: farmOptionArr,
};

const farmBlueprint = {
  id: 2,
  name: "",
  production: [],
  upgrade: [
    {
      input: {
        people: 2,
      },
      result: buildings.farm,
    },
  ],
  mesh: hutBlueprintMesh,
  option: farmOptionArr,
};

const farm = {
  id: 3,
  production: [{ input: { people: 1 }, output: { food: 2 } }],
  upgrade: [],
  mesh: treeMesh,
  option: farmOptionArr,
};

const buildings = {};

buildings.farm = {
  id: 3,
  production: [{ input: { people: 1 }, output: { food: 2 } }],
  upgrade: [],
  mesh: [
    generateSymmetricMesh(
      [
        [-optionSize, optionSize, [0.5, 0.7, 0]],
        [optionSize, optionSize, [0.5, 0.7, 0]],
        [optionSize, 0, [0.5, 0.7, 0]],
      ],
      generateRegularPolygon(6, 1)
    ),
    treeProgram,
  ],
  option: farmOptionArr,
};

export { buildings };
