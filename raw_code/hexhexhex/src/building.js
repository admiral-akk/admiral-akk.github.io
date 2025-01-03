import { generateRegularPolygon, generateSymmetricMesh } from "./renderer/mesh";

const optionSize = 0.1;

const blue = "#5D40EE";
const brown = "#5D4037";

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

const generateOptionMesh = (color) =>
  generateSymmetricMesh(
    [
      [-optionSize, optionSize, color],
      [optionSize, optionSize, color],
      [optionSize, 0, color],
    ],
    generateRegularPolygon(4, 1)
  );

buildings.farm = {
  id: 1,
  production: [{ input: { people: 1 }, output: { food: 2 } }],
  upgrade: [],
  mesh: generateHutMesh("#dddd00"),
  option: generateOptionMesh("#dddd00"),
};

buildings.farmBlueprint = {
  id: 2,
  production: [],
  upgrade: [
    {
      input: {
        people: 2,
      },
      result: buildings.farm,
    },
  ],
  mesh: generateHutMesh(blue),
  option: generateOptionMesh(blue),
};
buildings.village = {
  id: 3,
  production: [
    {
      input: {
        food: 1,
      },
      output: { people: 3 },
    },
  ],
  upgrade: [],
  mesh: generateHutMesh(brown),
  option: generateOptionMesh(brown),
};

export { buildings };
