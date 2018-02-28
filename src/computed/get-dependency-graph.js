import getResolvedDepGraph from './get-resolved-dep-graph';
import getUnsortedDepChains from './get-unsorted-dep-chains';

export default (computed) => {
  const depsObj = {};
  const fns = {};

  Object.keys(computed)
    .forEach((prop) => {
      depsObj[prop] = computed[prop].deps;
      fns[prop] = computed[prop].getter;
    });

  const resolvedDepGraph = getResolvedDepGraph(depsObj);

  const depChains = getUnsortedDepChains(depsObj);

  return {
    depChains,
    fns,
    resolvedDepGraph,
  };
};
