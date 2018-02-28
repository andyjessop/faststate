# FastState

FastState is a small and fast reactive programming library for JavaScript apps. It maintains an up-to-date state, so when one bit of state changes, it automatically calculates and updates downstream state.

**Note: this library is currently in alpha and therefore the API is subject to breaking changes.**

Features:
- **miniscule** (~200 lines of code)
- **no dependencies**
- **single atomic state object**
- **modular**: all functionality added in modules to aid separation of concerns and portability
- [**computed functions**](https://github.com/andyjessop/faststate#computed-functions)

FastState is deliberately minimal, but very powerful, allowing you to use it as the core of a reactive JavaScript app. Computed functions are the beating heart of the library. With them, you can:
- create computed properties that are added to the state
- call actions as a result of state changes (subscriptions)
- do anything else you want as a result of state changes, whether that be re-rendering or firing-off async actions.

### Installation
```
$ npm install faststate --save
```

### Minimal example
```js
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

```js
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

### Computed Functions
Add computed functions by specifying dependencies up front. Computed functions are guaranteed to be up-to-date, so you can have other computed properties as dependencies too. FastState will keep make sure that the computed functions are executed in the correct order.

```js
const config = {
  counter: {
    computed: {
      total: {
        deps: ['count', 'initial'], // state dependencies local to this module
        rootDeps: ['user.username'],
        // available params are: actions, state, rootActions, rootState
        getter: ({ rootState, state }) => `${rootState.user.username}: ${state.count + state.initial}`,
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

You don't have to return a value from a computed function, you can call another action, or do anything else async. So computed functions are also **subscriptions**:

```js
const config = {
  counter: {
    computed: {
      total: {
        deps: ['count'], // state dependencies local to this module
        // available params are: actions, state, rootActions, rootState
        getter: ({ actions, state }) => {
          console.log(state.count);
          actions.myOtherAction(state.count);
        },
    }
    state: {
      count: 0,
      initial: 5,
    }
  }
};

const store = createStore(config);
store.actions.counter.up(1); // console logs: 1
```
