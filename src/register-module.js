import createStore from './create-store';

export default (store, moduleName, module) => {
  store[moduleName] = createStore(module); // eslint-disable-line no-param-reassign
};
