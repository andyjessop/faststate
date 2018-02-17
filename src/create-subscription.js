import get from './utils/get';

export default (state, path, handler) => {
  const p = typeof path === 'string' ? path.split('.') : path;

  const parentPath = p.slice(-1);
  const prop = p.pop();

  return createObservable(get(parentPath, state)).on(prop, handler);
};

function createObservable(target) {
  if (target.on && target.off) return target;

  const emitter = createEventEmitter();

  return new Proxy(target, {
    get: (t, prop) => ((['on', 'once', 'off'].indexOf(prop) !== -1) ? emitter[prop] : t[prop]),
    set: (t, prop, val) => {
      if (emitter.subscriptions.find(sub => sub[prop])) {
        emitter.fire(prop, val);
      }
      t[prop] = val; // eslint-disable-line no-param-reassign
      return true;
    },
  });
}

function createEventEmitter() {
  const subscriptions = {};

  const fire = (type, data) => {
    (subscriptions[type] || []).forEach(listener => listener.handler(data));
  };

  const on = (type, handler) => {
    const listener = { type, handler };
    subscriptions[type] = subscriptions[type] || [];
    subscriptions[type].push(listener);
    return listener;
  };

  const off = (listener) => {
    subscriptions[listener.type] = subscriptions[listener.type]
      .filter(l => !(listener.type === l.type && listener.handler === l.handler));
  };

  const once = (type, handler) => {
    const callThenUnsubscribe = (...params) => {
      handler(...params);
      off({ type, handler: callThenUnsubscribe });
    };
    on(type, callThenUnsubscribe);
  };

  return {
    fire,
    off,
    on,
    once,
    subscriptions,
  };
}
