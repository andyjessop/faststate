# PicoStore

PicoStore is a tiny and fast state management container for JavaScript apps.

Features:
- **tiny** (<1KB minified)
- **no dependencies**
- **single atomic state object**
- **immutable but fast and low memory**: only updates small segments of the state
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

### Modules

Modules can also be added dynamically:
```
const module = {
  actions: {
    setTrue: () => state => ({ state.isTrue: true })
  },
  state: { ... }
}

const store = createStore();
store.registerModule('myModule', module);

store.actions.myModule.setTrue();

console.log(store.state.myModule.isTrue); // true

```

### Async
Actions don't have to return a segment of the state, they can be used to fire asynchronous actions, or do anything else you want. If you later want to update the state synchronously, you must call another action:

```
const config = {
  counter: {
    actions: {
      getCount: params => ({ state, actions }) => http.get(params.getCountUrl)
        .then((res) => {
          console.log(res); // e.g. res = 2
          actions.set(res));
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
      total: ('count', 'initial') => state => state.count + state.initial,
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
Subscribe to nested properties by specifying their paths in dot notation. Note you cannot currently subscribe to computed properties, but that will come in a later release.

```
let count, total;

const config = {
  counter: {
    actions: {
      up: value => state => ({ count: state.count + value }),
    },
    computed: {
      total: ('count', 'initial') => state => state.count + state.initial,
    }
    state: {
      count: 0,
      initial: 5,
    },
    subscriptions: {
      count: (oldVal, newVal) => ({ state, actions }) => { count = newVal; }
      total: (oldVal, newVal) => ({ state, actions }) => { total = newVal; } // subscribe to computed properties too
    }
  }
};

const store = createStore(config);

store.actions.counter.up(1);

console.log(count, total); // 1, 6
```

Add subscriptions dynamically:
```
let count;

const config = {
  counter: {
    actions: {
      up: value => state => ({ count: state.count + value }),
    },
    state: {
      count: 0,
    }
  }
};

const store = createStore(config);

store.subscribe({
 'count' => (oldVal, newVal) => { count = newVal; }
});

store.actions.counter.up(1);

console.log(count); // 1
```
