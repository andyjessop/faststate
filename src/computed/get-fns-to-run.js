import removeDuplicates from '../utils/remove-duplicates';

export default (depChains, resolvedDepGraph, fns, data) => removeDuplicates(Object.keys(data)
  .reduce((acc, cur) => {
    if (depChains[cur]) {
      return acc.concat(depChains[cur]);
    }

    return acc;
  }, []))
  .sort((a, b) => resolvedDepGraph.indexOf(a) - resolvedDepGraph.indexOf(b))
  .map(dep => ({
    prop: dep,
    fn: fns[dep],
  }));
