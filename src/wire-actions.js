import get from './get';

const wireActions = (path, state, actions, rootActions = actions, subscriptions) => {
  Object
    .keys(actions)
    .forEach((key) => {
      if (typeof actions[key] === 'function') {
        const action = actions[key];
        const localState = get(path, state);

        actions[key] = (val) => { // eslint-disable-line
          const data = action(val)({
            state: localState,
            actions,
            rootState: state,
            rootActions,
          });

          if (data && !data.then) {
            Object.assign(
              localState,
              data,
            );

            if (Object.keys(subscriptions || []).length > 0) {
              Object.keys(data)
                .map((dataKey) => {
                  return {
                    fn: subscriptions[[...path, dataKey].join('.')],
                    value: data[dataKey],
                  };
                })
                .forEach(({ fn, value }) => fn && fn(value));
            }
          }
        };
      } else {
        const nextPath = path.concat(key);
        wireActions(nextPath, state, get(nextPath, actions), rootActions, subscriptions);
      }
    });
};

export default wireActions;
