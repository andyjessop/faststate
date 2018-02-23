import createComputedProperty from './create-computed-property';
import wireActions from './wire-actions';

export default createStore;

function createStore(modules) {
  const {
    actions,
    state,
  } = Object.entries(modules || {})
    .filter(mod => mod[0] !== '$root')
    .reduce((acc, cur) => {
      const [name, mod] = cur;

      acc.state[name] = mod.state;

      Object.entries(mod.computed || [])
        .forEach((computed) => {
          const [label, getter] = computed;

          createComputedProperty(
            acc.state[name],
            label,
            getter.slice(0, -1), // dependencies
            getter.slice(-1)[0], // getter function
          );

          acc.computed[name] = {
            [label]: getter.slice(0, -1), // dependencies array
          };
        });

      acc.actions[name] = wireActions(
        [], // path
        acc.state[name], // state
        mod.actions, // actions
        mod.subscriptions, // subscriptions
        acc.computed[name], // computed
      );

      return acc;
    }, { actions: {}, computed: {}, state: {} });

  return {
    actions,
    state,
  };
}
