**Warning: This is very much WIP and not production ready**

# PicoStore

PicoStore is a tiny and agnostic state management container for JavaScript apps.

Features:
- tiny (< 1.5KB minified, < 1KB gZipped)
- global atomic state object
- namespaced actions: only update small segments of the global state in any single operation
- stores are modular by nature and can be infinitely nested to provide encapsulation yet still reflect the structure of your data
- store updates are subscribable by path, only responding to changes in those specific paths in the state

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

### Subscriptions
Subscriptions can either be included in the config:
```
const config = {
  actions: { // actions from counter example above },
  state: { // state from counter example above },
  subscriptions: [
    'counter.count': val => console.log(val)
  ]
};

const store = createStore(config);

store.actions.counter.up(1);
// console output (synchronous): 1

```

...or they can be added dynamically using `subscribe()`:
```
const config = {
  actions: { // actions from counter example above },
  state: { // state from counter example above }
};

const store = createStore(config);
store.subscribe('counter.count', val => console.log(val);

store.actions.counter.up(1);
// console output: 1
```

Cleaning up when you're finished:
```
const store = createStore(// config from above);
const handler = val => console.log(val);
store.subscribe('counter.count', handler);

store.unsubscribe('counter.count', handler);
```
### Async
Actions don't have to return a segment of the state, they can be used to fire asynchronous actions, or do anything else you want. If you late want to update the state asynchronously, you must call another action:

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
