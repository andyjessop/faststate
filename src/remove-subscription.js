export default (subscribed, name, handler) => subscribed
  .filter(sub => sub.name === name && sub.handler === handler);
