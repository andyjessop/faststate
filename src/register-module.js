import createStore from './index';

export default (store, module) => {
  const s = createStore(module[1]);
  store[module[0]] = s.state; // eslint-disable-line no-param-reassign
};
