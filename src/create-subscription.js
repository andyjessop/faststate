import createObservable from './create-observable';
import get from './get';

export default (state, path, handler) => {
  const p = typeof path === 'string' ? path.split('.') : path;

  const parentPath = p.slice(-1);
  const prop = p.pop();

  return createObservable(get(parentPath, state)).on(prop, handler);
};
