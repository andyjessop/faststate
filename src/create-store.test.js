import createStore from './create-store';

const getMockConfig = () => ({
  counter: {
    actions: {
      get: () => ({ actions }) => new Promise((resolve) => {
        actions.up(1);
        resolve();
      }),
      subCounter: {
        up: value => ({ state }) => ({ subCount: state.subCount + value }),
      },
      up: value => ({ state }) => ({ count: state.count + value }),
    },
    computed: {
      total: {
        deps: ['count', 'initial'],
        rootDeps: ['user.username'],
        getter: ({ state, rootState }) => {
          debugger;
          console.log(state.count, state.initial, rootState.user.username);
        },
      },
    },
    state: {
      count: 0,
      initial: 5,
      subCounter: {
        subCount: 0,
      },
    },
  },
  user: {
    state: {
      username: 'andyjessop',
    },
  },
});

let mockConfig = getMockConfig;

describe('createStore', () => {
  beforeEach(() => {
    mockConfig = getMockConfig();
  });

  test('should wire action to state', () => {
    debugger;
    const store = createStore(mockConfig);

    store.actions.counter.up(1);

    expect(store.state.counter.count).toEqual(1);
  });

  test('should wire nested action to nested state', () => {
    const store = createStore(mockConfig);

    store.actions.counter.subCounter.up(1);

    expect(store.state.counter.subCounter.subCount).toEqual(1);
  });

  test('should call async action', (done) => {
    const store = createStore(mockConfig);

    return store.actions.counter.get().then(() => {
      expect(store.state.counter.count).toEqual(1);
      done();
    });
  });

  test('should create a computed property', () => {
    const store = createStore(mockConfig);

    store.actions.counter.up(1);

    expect(store.state.counter.total).toEqual(6);
  });

  test('should create a subscription', () => {
    let output;

    const store = createStore({
      ...mockConfig,
      counter: {
        ...mockConfig.counter,
        subscriptions: {
          count: (newVal) => { output = newVal; },
        },
      },
    });

    store.actions.counter.up(1);

    expect(output).toEqual(1);
  });

  test('should subscribe to a computed property', () => {
    let output;

    const store = createStore({
      ...mockConfig,
      counter: {
        ...mockConfig.counter,
        subscriptions: {
          total: (newVal) => { output = newVal; },
        },
      },
    });

    store.actions.counter.up(1);

    expect(output).toEqual(6);
  });
});
