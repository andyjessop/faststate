const getDependencyChain = (isDependencyOf, prop) => isDependencyOf[prop]
  .reduce((acc, cur) => {
    if (acc[cur]) return acc;

    if (!acc[cur]) {
      acc.push(cur);
    }

    if (isDependencyOf[cur]) {
      acc.push(...getDependencyChain(isDependencyOf, cur));
    }

    return acc;
  }, []);

export default getDependencyChain;
