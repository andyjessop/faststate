import createComputedProperty from './create-computed-property';
import registerModule from './register-module';
import wireActions from './wire-actions';

export default createStore;

function createStore({
  actions,
  computed,
  modules,
  state,
  subscriptions,
}) {
  wireActions([], state, actions, actions, subscriptions);

  const store = {
    actions,
    state,
  };

  Object.entries(computed || [])
    .forEach(prop => createComputedProperty(
      state,
      prop[0],
      prop[1].deps(state),
      prop[1].rootDeps && prop[1].rootDeps(state),
      prop[1].getter,
    ));

  Object.entries(modules || []).forEach(module => registerModule(store, module[0], module[1]));

  return Object.assign(store, {
    registerModule: module => registerModule(store, module),
  });
}
