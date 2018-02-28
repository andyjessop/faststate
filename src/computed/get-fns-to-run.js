import removeDuplicates from '../utils/remove-duplicates';

export default (depChains, resolvedDepGraph, fns, data) => removeDuplicates(Object.keys(data)
  .reduce((acc, cur) => acc.concat(depChains[cur]), []))
  .sort((a, b) => resolvedDepGraph.indexOf(a) - resolvedDepGraph.indexOf(b))
  .map(dep => fns[dep]);
