import wireActions from './wire-actions';

export default (state, moduleName, module) => {
  wireActions([], state, actions, actions, subscriptions);
  store[moduleName] = createStore(module); // eslint-disable-line no-param-reassign
};
