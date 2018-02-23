import getState from './get-state';

export default (obj, prop, deps, getter) => {
  const cache = {};

  Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: true,
    get: () => {
      const depObjects = deps.map(dep => getState(dep.split('.'), obj));

      const argString = JSON.stringify(depObjects);

      if (cache[argString]) {
        return cache[argString];
      }

      const res = getter(obj);
      cache[argString] = res;
      return res;
    },
    set() {
      throw new TypeError(`"${prop}" is a computed property, it can't be set directly.`);
    },
  });
};
