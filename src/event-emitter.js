export default () => {
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
};
