import createComputedProperty from './create-computed-property';
import wireActions from './wire-actions';

export default createStore;

function createStore(modules) {
  const {
    actions,
    state,
  } = Object.entries(modules || {})
    .map(module => ({ name: module[0], module: module[1] }))
    .filter(module => module.name !== '$root')
    // map module state/actions to namespaced state/actions
    // e.g. { counter: { actions, state } }
    //   => { actions: { counter }, state: { counter } }
    .reduce((acc, cur) => {
      acc.state[cur.name] = cur.module.state;

      Object.entries(cur.module.computed || [])
        .map(computed => ({ name: computed[0], getter: computed[1] }))
        .forEach((prop) => {
          createComputedProperty(
            acc.state[cur.name],
            prop.name,
            prop.getter.slice(0, -1), // dependencies
            prop.getter.slice(-1)[0], // getter function
          );

          acc.computed[cur.name] = {
            [prop.name]: prop.getter.slice(0, -1), // dependencies
          };
        });

      acc.actions[cur.name] = wireActions(
        [], // path
        acc.state[cur.name], // state
        cur.module.actions, // actions
        cur.module.subscriptions, // subscriptions
        acc.computed[cur.name], // computed
      );

      return acc;
    }, { actions: {}, computed: {}, state: {} });

  return {
    actions,
    state,
  };
}
