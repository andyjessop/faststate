import createStore from './create-store';

const getMockConfig = () => ({
  actions: {
    alertInitialized: () => ({ actions }) => new Promise((resolve) => {
      actions.setAlert('Initialized');
      resolve();
    }).then(() => actions.setAlert('Initialized')),
    setAlert: value => () => ({ alert: value }),
    initialized: () => () => ({ initialized: true }),
    user: {
      setUsername: value => () => ({ username: value }),
      alertLoggedOut: () => ({ rootActions }) => { rootActions.setAlert('You have been logged out.'); },
    },
  },
  state: {
    alert: '',
    initialized: false,
    num: 0,
    user: {
      username: '',
    },
  },
});

let mockConfig = getMockConfig;

describe('createStore', () => {
  beforeEach(() => {
    mockConfig = getMockConfig();
  });

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
        increment: value => ({ state }) => ({ count: state.count + value }),
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

  test('should create a computed property', () => {
    const computed = {
      initNum: {
        deps: state => [
          state.initialized,
          state.num,
        ],
        getter: state => (`${state.initialized}${state.num}`),
      },
    };

    const store = createStore({
      ...mockConfig,
      computed,
    });

    expect(store.state.initNum).toEqual('false0');
  });

  test('should create a subscription', () => {
    let output;

    const subscription = {
      'user.username': (newVal) => {
        output = newVal;
      },
    };

    const store = createStore({
      ...mockConfig,
      subscriptions: { ...subscription },
    });

    store.actions.user.setUsername('alice');

    expect(output).toEqual('alice');
  });
});
