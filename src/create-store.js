import get from './utils/get';

export default createStore;

function createStore({
  state,
  actions,
  modules,
}) {
  const wiredActions = wireActions({}, state, actions);

  const store = {
    actions: wiredActions,
    state,
  };

  Object.entries(modules || []).forEach(module => registerModule(store, module));

  return Object.assign(store, {
    registerModule: module => registerModule(store, module),
  });
}

function registerModule(store, module) {
  const s = createStore(module[1]);
  store[module[0]] = s.state; // eslint-disable-line no-param-reassign
}

function wireActions(path, state, actions) {
  return Object
    .keys(actions)
    .reduce((acc, key) => {
      if (typeof acc[key] === 'function') {
        acc[key] = val => acc[key](val, get(path, state));
        return acc;
      }

      return wireActions(path.concat(key));
    }, {});
}
