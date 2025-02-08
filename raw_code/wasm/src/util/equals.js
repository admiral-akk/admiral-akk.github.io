import { quat, vec2, vec3, vec4 } from "gl-matrix";

export function equals(a, b) {
  const typeA = typeof a;
  const typeB = typeof b;

  if (typeA !== typeB) {
    return false;
  }

  switch (typeA) {
    case "number":
    case "string":
    case "boolean":
    case "bigint":
      return a === b;
    case "object":
      //
      const constNameA = a.constructor.name;
      const constNameB = b.constructor.name;
      if (constNameA !== constNameB) {
        return false;
      }
      switch (constNameA) {
        case "Float32Array":
        case "Array":
          if (a.length !== b.length) {
            return false;
          }
          for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
              return false;
            }
          }
          return true;
        case "vec2":
          return vec2.equals(a, b);
        case "vec3":
          return vec3.equals(a, b);
        case "vec4":
          return vec4.equals(a, b);
        case "quat":
          return quat.equals(a, b);
        default:
          console.log(a, b);
          console.log(constNameA, constNameB);
          throw new Error(`equals not supported for ${typeA}`);
      }
    default:
      console.log(a, b);
      throw new Error(`equals not supported for ${typeA}`);
  }
}
