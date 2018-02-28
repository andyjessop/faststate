import getDependencyGraph from './computed/get-dependency-graph';
import makeDepPathsAbsolute from './utils/make-dep-paths-absolute';
import wireActions from './wire-actions';

export default createStore;

function createStore(modules) {
  const {
    actions,
    computed,
    state,
  } = Object.entries(modules || {})
    .reduce((acc, cur) => {
      const [name, mod] = cur;

      acc.state[name] = mod.state || {};
      acc.actions[name] = mod.actions || {};
      acc.computed = Object.assign(acc.computed, makeDepPathsAbsolute(mod.computed || {}, name));

      return acc;
    }, { actions: {}, computed: {}, state: {} });

  // Build dependency graph of computed functions
  const graph = getDependencyGraph(computed);

  wireActions([], actions, state, actions, state, graph);

  return {
    actions,
    state,
  };
}
