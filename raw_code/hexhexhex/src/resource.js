import { generateRegularPolygon, generateSymmetricMesh } from "./renderer/mesh";

const resourceSize = 0.05;

const green = [0.75, 0.6, 0];
const yellow = [1, 0.5, 0];
const grey = [0.5, 0.5, 0.5];
const brown = [0.45, 0.25, 0];

const generateResourceMesh = (color) =>
  generateSymmetricMesh(
    [
      [-resourceSize, resourceSize, color],
      [resourceSize, resourceSize, color],
      [resourceSize, 0, color],
    ],
    generateRegularPolygon(4, 1)
  );

const resources = {};

const addResource = (...newResources) => {
  for (let i = 0; i < newResources.length; i++) {
    const resource = newResources[i];
    resource.id = Object.keys(resource).length;
    resources[resource.name] = resource;
  }
};

addResource(
  {
    name: "food",
    mesh: generateResourceMesh(green),
    color: green,
  },
  {
    name: "people",
    mesh: generateResourceMesh(yellow),
    color: yellow,
  },
  {
    name: "stone",
    mesh: generateResourceMesh(grey),
    color: grey,
  },
  {
    name: "wood",
    mesh: generateResourceMesh(brown),
    color: brown,
  }
);

export { resources };
