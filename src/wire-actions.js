import get from './get';

const wireActions = (path, state, actions, rootActions) => {
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
};

export default wireActions;
