import { generateRegularPolygon, generateSymmetricMesh } from "./renderer/mesh";

const resourceSize = 0.05;

const green = "#5DE000";
const yellow = [1, 0.5, 0];
const grey = [0.5, 0.5, 0.5];
const brown = "#663300";

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
  },
  {
    name: "people",
    mesh: generateResourceMesh(yellow),
  },
  {
    name: "stone",
    mesh: generateResourceMesh(grey),
  },
  {
    name: "wood",
    mesh: generateResourceMesh(brown),
  }
);

export { resources };
