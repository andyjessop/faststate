import getState from './get-state';

const wireActions = (path, state, actions, subscriptions, computedDeps) => {
  Object
    .keys(actions)
    .forEach((key) => {
      if (typeof actions[key] === 'function') {
        const action = actions[key];
        const localState = getState(path, state);

        actions[key] = (val) => { // eslint-disable-line no-param-reassign
          const data = action(val)({
            actions,
            state: localState,
          });

          if (!data) return;

          if (data.then) return data; // eslint-disable-line consistent-return

          Object.assign(localState, data);

          const subscriptionsKeys = Object.keys(subscriptions || {});

          if (subscriptions && subscriptionsKeys.length > 0) {
            const depsKeys = Object.keys(computedDeps || {});
            const dataKeys = Object.keys(data || {});

            depsKeys
              // Find dependencies of computed properties that have changed
              // i.e. that are in 'data'.
              .reduce((acc, cur) => {
                if (
                  !acc.includes(cur) && // don't repeat keys
                  computedDeps[cur].some(dep => dataKeys.includes(dep))
                ) {
                  acc.push(cur);
                }

                return acc;
              }, dataKeys)
              .filter(subKey => subscriptionsKeys.includes(subKey))
              .forEach((subKey) => {
                const fn = subscriptions[path.concat(subKey).join('.')];

                if (fn) {
                  fn(data[subKey] || state[subKey]);
                }
              });
          }
        };
      } else {
        const nextPath = path.concat(key);
        wireActions(nextPath, state, getState(nextPath, actions), subscriptions, computedDeps);
      }
    });

  return actions;
};

export default wireActions;
