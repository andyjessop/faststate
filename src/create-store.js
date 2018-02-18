import get from './utils/get';
import set from './utils/set';
import createComputedProperty from './create-computed-property';

export default createStore;

function createStore({
  actions,
  computedProperties,
  modules,
  state,
}) {
  wireActions([], state, actions, actions);

  const store = {
    actions,
    state,
  };

  Object.entries(modules || []).forEach(module => registerModule(store, module[0], module[1]));

  Object.entries(computedProperties || [])
    .forEach(prop => createComputedProperty(
      state,
      prop[0],
      prop[1].deps(state),
      prop[1].rootDeps && prop[1].rootDeps(state),
      prop[1].getter,
    ));

  return Object.assign(store, {
    registerModule: module => registerModule(store, module),
  });
}

function registerModule(store, moduleName, module) {
  store[moduleName] = createStore(module); // eslint-disable-line no-param-reassign
}

function wireActions(path, state, actions, rootActions) {
  Object
    .keys(actions)
    .forEach((key) => {
      if (typeof actions[key] === 'function') {
        const action = actions[key];
        const nestedState = get(path, state);

        actions[key] = (val) => { // eslint-disable-line
          const data = action(val)({
            state: nestedState,
            actions,
            rootState: state,
            rootActions,
          });

          if (data && !data.then) {
            Object.assign(
              nestedState,
              data,
            );
          }
        };
      } else {
        const nextPath = path.concat(key);
        wireActions(nextPath, state, get(nextPath, actions), rootActions);
      }
    });
}
