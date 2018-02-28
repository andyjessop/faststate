import joinPaths from './join-paths';

export default (computed, moduleName) => {
  const rootComputed = {};

  Object.keys(computed)
    .forEach((prop) => {
      rootComputed[prop] = {
        deps: computed[prop].rootDeps.concat(computed[prop].deps
          .map(dep => joinPaths([moduleName], dep))),
        getter: computed[prop].getter,
      };
    });

  return rootComputed;
};
