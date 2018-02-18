export default (path, value, source) => path.reduce((acc, cur, ndx) => {
  if (ndx === path.length - 1) {
    acc[cur] = { ...value };
  }

  return acc[cur];
}, source);
