/**
 * Sort dependency chain.
 * e.g.
 * depsObj = {
 *   b: ['a']
 * }
 * chain = ['b', 'a']
 *
 * returns: ['a', 'b'] (because 'b' depends on 'a')
 *
 * @param {object} depsObj
 * @param {array} chain
 * @returns {array} sorted chain array
 */
export default (depsObj) => {
  const sorted = []; // sorted list of IDs ( returned value )
  const visited = {}; // hash: id of already visited node => true

  Object.keys(depsObj).forEach(function visit(name, ancestors) {
    if (!Array.isArray(ancestors)) ancestors = []; // eslint-disable-line no-param-reassign
    ancestors.push(name);
    visited[name] = true;

    depsObj[name].forEach((dep) => {
      if (ancestors.indexOf(dep) >= 0) {
        throw new Error(`Circular dependency "${dep}" is required by "${name}": ${ancestors.join(' -> ')}`);
      }

      // if already exists, do nothing
      if (visited[name]) return;
      visit(dep, ancestors.slice(0)); // recursive call
    });

    if (sorted.indexOf(name) < 0) sorted.push(name);
  });

  return sorted;
};
