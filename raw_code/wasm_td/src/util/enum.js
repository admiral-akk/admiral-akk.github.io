// https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
export function makeEnum(arr) {
  let obj = Object.create(null);
  for (let val of arr) {
    obj[val] = val;
  }
  return Object.freeze(obj);
}

export { makeEnum };
