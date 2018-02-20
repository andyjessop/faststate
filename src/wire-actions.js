import get from './get';

const wireActions = (path, state, actions, subscriptions, computedDeps) => {
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

          const subscriptionsKeys = Object.keys(subscriptions || {});

          if (subscriptions && subscriptionsKeys.length > 0) {
            const computedKeys = Object.keys(computedDeps || {});
            const dataKeys = Object.keys(data || {});

            [
              ...dataKeys,
              ...computedKeys.filter(k => computedDeps[k].some(q => dataKeys.includes(q))),
            ]
              .filter((k) => {
                return subscriptionsKeys.includes(k);
              })
              .map((subKey) => {
                return {
                  fn: subscriptions[[...path, subKey].join('.')],
                  value: data[subKey] || state[subKey],
                };
              })
              .forEach(({ fn, value }) => {
                return fn && fn(value);
              });
          }
        };
      } else {
        const nextPath = path.concat(key);
        wireActions(nextPath, state, get(nextPath, actions), subscriptions, computedDeps);
      }
    });

  return actions;
};

export default wireActions;
