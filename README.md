# PicoStore

PicoStore is a tiny and exceptionally fast state management container for JavaScript apps.

Features:
- **tiny** (<1KB minified)
- **no dependencies**
- **fast and low memory**: does a small amount of work to update state and respond to changes
- **single atomic state object**
- **namespaced actions**: only update small segments of the global state in any single operation
- **modular**: stores are fractal by nature and can be infinitely nested to provide encapsulation yet still reflect the structure of your data
- [**computed properties**](https://github.com/andyjessop/picostore#computed-properties)
- [**subscribe**](https://github.com/andyjessop/picostore#subscriptions) to changes in specific properties in the state object

### Installation
```
$ npm install picostore --save
```

### Minimal example
```
import createStore from 'picostore';

const config = {
  actions: {
    counter: {
      up: value => state => ({ count: state.count + value }), // nested to provide namespacing
      down: value => state => ({ count: state.count - value })
    }
  },
  state: {
    counter: {
      count: 0
    }
  }
};

const store = createStore(config);

store.actions.counter.up(1);

console.log(store.state.count); // 1

```

### Modules
```
const module = {
  actions: {
    setTrue: () => state => ({ state.isTrue: true })
  },
  state: { ... }
}

const config = {
  actions: {
    init: value => state => ({ state.initialized: true })
  },
  state: {
    initialized: true
  },
  modules: {
    module1: module
  }
};

const store = createStore(config);

store.actions.init(); // store.state.initialized: true
store.module1.actions.setTrue(); // store.module1.state.isTrue: true
```

Modules can also be added dynamically:
```
const module = {
  actions: {
    setTrue: () => state => ({ state.isTrue: true })
  },
  state: { ... }
}

const config = {
  actions: {
    init: value => state => ({ state.initialized: true })
  },
  state: {
    initialized: true
  }
};

const store = createStore(config);
store.registerModule(module);

store.module1.actions.setTrue();

console.log(store.module1.state.isTrue); // true

```

### Async
Actions don't have to return a segment of the state, they can be used to fire asynchronous actions, or do anything else you want. If you later want to update the state synchronously, you must call another action:

```
const config = {
  actions: {
    myAsyncAction: params => (state, actions) => http.get(params.url)
      .then(() => actions.syncUpdate(2)),

    syncUpdate: val => state => ({ updated: val });
  }
}

const store = createStore(config);

store.actions.myAsyncAction();
console.log(1);

// outputs:
// 1
// 2
```

### Computed Properties
Add computed properties by specifying dependencies up front. Computed functions are memoized so they are exceedingly fast.

```
const config = {
  actions: {...},
  state: {
    one: 1,
    two: 2
  },
  computed: {
    added: {
      deps: state => [state.one, state.two],
      getter: state => state.one + state.two
    }
  }
}

const store = createStore(config);

console.log(store.state.added); // 3
```

### Subscriptions
Subscribe to nested properties by specifying their paths in dot notation. Note you cannot currently subscribe to computed properties, but that will come in a later release.

```
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

console.log(output); // 'alice
```
