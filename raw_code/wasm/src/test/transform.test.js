import { test } from "vitest";
import { Quat, Vec3 } from "gl-matrix";
import { Transform } from "../components/render/transform";
import { expectedApprox } from "./engine/geometry/line.test";

test("transform - identity", () => {
  const transform = new Transform();

  const local = Vec3.clone([1, 1, 1]);

  const mat = transform.getWorldMatrix();

  const actual = Vec3.create();
  Vec3.transformMat4(actual, local, mat);

  const expected = Vec3.clone([1, 1, 1]);

  expectedApprox(Vec3.distance(actual, expected), 0, {
    actual,
    expected,
  });
});

test("transform - translation", () => {
  const transform = new Transform({ pos: [-2, -2, -2] });

  const local = Vec3.clone([1, 1, 1]);

  const mat = transform.getWorldMatrix();

  const actual = Vec3.create();
  Vec3.transformMat4(actual, local, mat);

  const expected = Vec3.clone([-1, -1, -1]);

  expectedApprox(Vec3.distance(actual, expected), 0, {
    actual,
    expected,
  });
});

test("transform - rotation", () => {
  const transform = new Transform({ rot: Quat.create().rotateY(Math.PI) });

  const local = Vec3.clone([1, 1, 1]);

  const mat = transform.getWorldMatrix();

  const actual = Vec3.create();
  Vec3.transformMat4(actual, local, mat);

  const expected = Vec3.clone([-1, 1, -1]);

  expectedApprox(Vec3.distance(actual, expected), 0, {
    actual,
    expected,
  });
});

test("transform - scale", () => {
  const transform = new Transform({ scale: [2, 2, 2] });

  const local = Vec3.clone([1, 1, 1]);

  const mat = transform.getWorldMatrix();

  const actual = Vec3.create();
  Vec3.transformMat4(actual, local, mat);

  const expected = Vec3.clone([2, 2, 2]);

  expectedApprox(Vec3.distance(actual, expected), 0, {
    actual,
    expected,
  });
});

test("transform - translate + rotate", () => {
  const transform = new Transform({
    pos: [-2, -3, -2],
    rot: Quat.create().rotateY(Math.PI),
  });

  const local = Vec3.clone([1, 1, 1]);

  const mat = transform.getWorldMatrix();

  const actual = Vec3.create();
  Vec3.transformMat4(actual, local, mat);

  const expected = Vec3.clone([1, -2, 1]);

  expectedApprox(Vec3.distance(actual, expected), 0, {
    actual,
    expected,
  });
});

test("transform - translate + scale", () => {
  const transform = new Transform({
    pos: [-2, -3, -2],
    scale: [2, 2, 2],
  });

  const local = Vec3.clone([1, 1, 1]);

  const mat = transform.getWorldMatrix();

  const actual = Vec3.create();
  Vec3.transformMat4(actual, local, mat);

  const expected = Vec3.clone([0, -1, 0]);

  expectedApprox(Vec3.distance(actual, expected), 0, {
    actual,
    expected,
  });
});

test("transform - translate + rotation + scale", () => {
  const transform = new Transform({
    pos: [-2, -3, -2],
    rot: Quat.create().rotateX(Math.PI / 2),
    scale: [2, 2, 2],
  });

  const local = Vec3.clone([1, 1, 1]);

  const mat = transform.getWorldMatrix();

  const actual = Vec3.create();
  Vec3.transformMat4(actual, local, mat);

  const expected = Vec3.clone([0, 0, -1]);

  expectedApprox(Vec3.distance(actual, expected), 0, {
    actual,
    expected,
  });
});

test("transform parents - translate -> rotation", () => {
  const parent = new Transform({
    pos: [-2, -3, -2],
  });
  const transform = new Transform({
    parent,
    rot: Quat.create().rotateY(Math.PI),
  });

  const local = Vec3.clone([1, 1, 1]);

  const mat = transform.getWorldMatrix();

  const actual = Vec3.create();
  Vec3.transformMat4(actual, local, mat);

  const expected = Vec3.clone([-3, -2, -3]);

  expectedApprox(Vec3.distance(actual, expected), 0, {
    actual,
    expected,
  });
});

test("transform parents - rotation -> translate", () => {
  const parent = new Transform({
    rot: Quat.create().rotateY(Math.PI),
  });
  const transform = new Transform({
    pos: [-2, -3, -2],
    parent,
  });

  const local = Vec3.clone([1, 1, 1]);

  const mat = transform.getWorldMatrix();

  const actual = Vec3.create();
  Vec3.transformMat4(actual, local, mat);

  const expected = Vec3.clone([1, -2, 1]);

  expectedApprox(Vec3.distance(actual, expected), 0, {
    actual,
    expected,
  });
});
