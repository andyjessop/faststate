# PicoStore

PicoStore is a small and fast state management container for JavaScript apps.

Features:
- **tiny** (<1KB minified)
- **no dependencies**
- **single atomic state object**
- **modular**: all functionality added in modules to aid separation of concerns and portability
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
  counter: {
    actions: {
      up: value => state => ({ count: state.count + value }),
      down: value => state => ({ count: state.count - value })
    },
    state: {
      count: 0
    }
  }
};

const store = createStore(config);

store.actions.counter.up(1);
console.log(store.state.count); // 1

```

### Async
Actions don't have to return a segment of the state, they can be used to fire asynchronous actions, or do anything else you want. If you later want to update the state synchronously, you must call another action:

```
const config = {
  counter: {
    actions: {
      get: () => ({ actions }) => new Promise((resolve) => {
        actions.set(1);
        resolve();
      }),

      set: value => state => ({ count: value });
    },
    state: {
      count: 0;
    }
  }
}

const store = createStore(config);

store.actions.getCount();
console.log(1);

// outputs:
// 1
// 2
```

### Computed Properties
Add computed properties by specifying dependencies up front. Computed functions are memoized so they are exceedingly fast.

```
const config = {
  counter: {
    actions: {
      up: value => state => ({ count: state.count + value }),
      down: value => state => ({ count: state.count - value }),
    },
    computed: {
      total: ['count', 'initial', (state) => state.count + state.initial],
    }
    state: {
      count: 0,
      initial: 5,
    }
  }
};

const store = createStore(config);
store.actions.counter.up(1)

console.log(store.state.counter.total); // 6
```

### Subscriptions
Subscribe to nested properties by specifying their paths in dot notation. You can also subscribe to computed properties.

```
let count, total;

const config = {
  counter: {
    actions: {
      up: value => state => ({ count: state.count + value }),
    },
    computed: {
      total: ['count', 'initial', (state) => state.count + state.initial],
    }
    state: {
      count: 0,
      initial: 5,
    },
    subscriptions: {
      count: (newVal) => { count = newVal; }
      total: (newVal) => { total = newVal; } // subscribe to computed properties too
    }
  }
};

const store = createStore(config);

store.actions.counter.up(1);

console.log(count, total); // 1, 6
```
