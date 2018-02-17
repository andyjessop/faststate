import get from './utils/get';

export default createStore;

function createStore({
  state,
  actions,
  modules,
}) {
  wireActions([], state, actions, actions);

  const store = {
    actions,
    state,
  };

  Object.entries(modules || []).forEach(module => registerModule(store, module[0], module[1]));

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
        actions[key] = (val) => { // eslint-disable-line
          const nextFn = action(val, actions, rootActions);

          // If we get a function back then it's a synchronous state
          // update. So we call it and update the nested state.
          if (typeof nextFn === 'function') {
            const nestedState = get(path, state);

            Object.assign(
              nestedState,
              nextFn(nestedState),
            );
          }
        };
      } else {
        const nextPath = path.concat(key);
        wireActions(nextPath, state, get(nextPath, actions), rootActions);
      }
    });
}
