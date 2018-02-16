import get from './get';

const wireActions = (path, state, actions) => Object
  .keys(actions)
  .reduce((acc, key) => {
    if (typeof acc[key] === 'function') {
      acc[key] = val => acc[key](val, get(path, state));
      return acc;
    }

    return wireActions([...path, key]);
  }, {});

export default wireActions;
