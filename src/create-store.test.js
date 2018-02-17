import createStore from './create-store';

const mockConfig = {
  actions: {
    alertInitialized: (value, actions) => actions.setAlert('Initialized'),
    setAlert: value => () => ({ alert: value }),
    initialized: () => () => ({ initialized: true }),
    user: {
      setUsername: value => () => ({ username: value }),
      alertLoggedOut: (obj, actions, rootActions) => { rootActions.setAlert('You have been logged out.'); },
    },
  },
  state: {
    alert: '',
    initialized: false,
    user: {
      username: '',
    },
  },
};

describe('createStore', () => {
  test('should wire action to state', () => {
    const store = createStore(mockConfig);

    store.actions.initialized();

    expect(store.state.initialized).toEqual(true);
  });

  test('should wire nested action to nested state', () => {
    const store = createStore(mockConfig);

    store.actions.user.setUsername('aggers');

    expect(store.state.user.username).toEqual('aggers');
  });

  test('should run action that does not return state', () => {
    const store = createStore(mockConfig);

    store.actions.alertInitialized();

    expect(store.state.alert).toEqual('Initialized');
  });

  test('should pass global actions action that does not return state', () => {
    const store = createStore(mockConfig);

    store.actions.user.alertLoggedOut();

    expect(store.state.alert).toEqual('You have been logged out.');
  });

  test('should create module as namespaced sub-store', () => {
    const module = {
      actions: {
        increment: value => state => ({ count: state.count + value }),
      },
      state: {
        count: 0,
      },
    };
    const store = createStore({
      ...mockConfig,
      modules: { counter: module },
    });

    store.counter.actions.increment(1);

    expect(store.counter.state.count).toEqual(1);
  });
});
