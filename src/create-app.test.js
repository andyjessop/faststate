import createApp from './create-app';

const getMockConfig = () => ({
  counter: {
    actions: {
      get: () => ({ actions }) => new Promise((resolve) => {
        actions.up(1);
        resolve();
      }),
      incTimesCounted: () => ({ state }) =>
        ({ timesCounted: state.timesCounted ? state.timesCounted + 1 : 1 }),
      setInitial: value => () => ({ initial: value }),
      subCounter: {
        up: value => ({ state }) => ({ subCount: state.subCount + value }),
      },
      up: value => ({ state }) => ({ count: state.count + value }),
    },
    computed: {
      callAction: {
        deps: ['count'],
        getter: ({ actions }) => {
          actions.incTimesCounted();
        },
      },
      total: {
        deps: ['count', 'initial'],
        getter: ({ state }) => state.count + state.initial,
      },
      userTotal: {
        deps: ['count', 'initial'],
        rootDeps: ['user.username'],
        getter: ({ state, rootState }) => `${rootState.user.username}: ${state.count + state.initial}`,
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
      username: 'alice',
    },
  },
});

let mockConfig = getMockConfig;

describe('createApp', () => {
  beforeEach(() => {
    mockConfig = getMockConfig();
  });

  test('should wire action to state', () => {
    const app = createApp(mockConfig);

    app.actions.counter.up(1);

    expect(app.state.counter.count).toEqual(1);
  });

  test('should wire nested action to nested state', () => {
    const app = createApp(mockConfig);

    app.actions.counter.subCounter.up(1);

    expect(app.state.counter.subCounter.subCount).toEqual(1);
  });

  test('should call async action', (done) => {
    const app = createApp(mockConfig);

    return app.actions.counter.get().then(() => {
      expect(app.state.counter.count).toEqual(1);
      done();
    });
  });

  test('should create a computed property', () => {
    const app = createApp(mockConfig);

    app.actions.counter.up(1);

    expect(app.state.counter.total).toEqual(6);
  });

  test('should compute total', () => {
    const app = createApp(mockConfig);

    app.actions.counter.up(1);
    expect(app.state.counter.total).toEqual(6);

    app.actions.counter.setInitial(6);
    expect(app.state.counter.total).toEqual(7);
  });

  test('rootDeps and rootState should work for computed getter', () => {
    const app = createApp(mockConfig);

    app.actions.counter.up(1);
    expect(app.state.counter.userTotal).toEqual('alice: 6');
  });

  test('should call action from computed getter', () => {
    const app = createApp(mockConfig);

    app.actions.counter.up(1);
    expect(app.state.counter.timesCounted).toEqual(1);
  });
});
