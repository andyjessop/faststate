import eventEmitter from './event-emitter';

export default (target) => {
  if (target.on && target.off) return target;

  const emitter = eventEmitter();

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
};
