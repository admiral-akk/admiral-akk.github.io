import { generateRegularPolygon, generateSymmetricMesh } from "./renderer/mesh";

const resourceSize = 0.05;

const green = "#5DE00";
const yellow = [1, 0.5, 0];

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

resources.food = {
  mesh: generateResourceMesh(green),
};

resources.people = {
  mesh: generateResourceMesh(yellow),
};

export { resources };
