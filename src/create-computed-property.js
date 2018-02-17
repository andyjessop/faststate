export default (obj, prop, deps, rootDeps, getter) => {
  const cache = {};

  Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: true,
    get: () => {
      const argString = JSON.stringify({ ...deps, ...rootDeps });

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
