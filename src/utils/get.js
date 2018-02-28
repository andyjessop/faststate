export default (path, source) => path.reduce((acc, cur) => acc[cur], source);
