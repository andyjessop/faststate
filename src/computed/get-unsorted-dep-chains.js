/**
 * Returns an object of chains of specific dependencies.
 * For instance, if 'a' is depended on by 'b', and 'b' by 'c',
 * then:
 *
 * depsObj: {
 *  b: ['a'],
 *  c: ['b']
 * }
 *
 * returns
 *
 * {
 *  a: ['b', 'c'],
 *  b: ['c']
 * }
 *
 * @param {object} depsObj
 * @returns {object} depChains
 */
export default (depsObj) => {
  const depChains = {};

  Object
    .keys(depsObj)
    .forEach((prop) => {
      depsObj[prop].forEach((dep) => {
        if (!depChains[dep]) {
          depChains[dep] = [];
        }

        if (!depChains[dep].includes(prop)) {
          depChains[dep].push(prop);
        }
      });
    });

  Object
    .keys(depChains)
    .forEach((dep) => {
      // concatenate chains of dependencies
      depChains[dep] = recursivelyConcatDepChains(depChains, dep);
    });

  return depChains;
};

function recursivelyConcatDepChains(depChains, dep) {
  const initialLength = depChains[dep].length;

  const concatenated = depChains[dep].reduce((acc, cur) => {
    // Add dependencies of dependencies...
    if (depChains[cur] && depChains[cur].length > 0) {
      depChains[cur].forEach((d) => {
        // ...but only if they don't already exist
        if (acc.indexOf(d) === -1) acc.push(d);
      });
    }

    return acc;
  }, depChains[dep]);

  // If we've added any dependencies, then we need to search again (for their dependencies)
  if (depChains[dep].length > initialLength) return recursivelyConcatDepChains(depChains, dep);

  return concatenated;
}
