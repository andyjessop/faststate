import get from './utils/get';
import getFnsToRun from './computed/get-fns-to-run';
import joinPaths from './utils/join-paths';

const wireActions = (path, actions, state, rootActions, rootState, graph) => {
  Object
    .keys(actions)
    .forEach((key) => {
      if (typeof actions[key] === 'function') {
        const action = actions[key];
        const localState = get(path, state);

        actions[key] = (val) => { // eslint-disable-line no-param-reassign
          const data = action(val)({
            actions,
            state: localState,
          });

          if (!data) return;

          if (data.then) return data; // eslint-disable-line consistent-return

          Object.assign(localState, data);

          // Map data property names to their root value
          const rootData = Object.keys(data)
            .reduce((acc, cur) => {
              acc[joinPaths(path, cur)] = data[cur];
              return acc;
            }, {});

          getFnsToRun(graph.depChains, graph.resolvedDepGraph, graph.fns, rootData)
            .forEach(fn => fn({
              actions,
              state: localState,
              rootActions,
              rootState,
            }));
        };
      } else {
        const nextPath = path.concat(key);
        wireActions(nextPath, get([key], actions), state, rootActions, rootState, graph);
      }
    });

  return actions;
};

export default wireActions;
