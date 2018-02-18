import createComputedProperty from './create-computed-property';
import registerModule from './register-module';
import wireActions from './wire-actions';

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
