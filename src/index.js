import createSubscription from './create-subscription';
import registerModule from './register-module';
import removeSubscription from './remove-subscription';
import wireActions from './wire-actions';

const createStore = ({
  state,
  actions,
  subscriptions,
  modules,
}) => {
  const wiredActions = wireActions({}, state, actions);

  let subscribed = Object
    .entries(subscriptions || [])
    .map(sub => ({
      name: sub[0],
      handler: sub[1],
      subscription: createSubscription(state, sub[0], sub[1]),
    }));

  const store = {
    actions: wiredActions,
    state,
    subscribe: sub => createSubscription(state, ...sub),
    unsubscribe: (name, handler) => {
      subscribed = removeSubscription(subscribed, name, handler);
    },
  };

  Object.entries(modules || []).forEach(module => registerModule(store, module));

  return {
    ...store,
    registerModule: module => registerModule(store, module),
  };
};

export default createStore;
