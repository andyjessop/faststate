import getResolvedDepGraph from './get-resolved-dep-graph';

describe('sortDepChain', () => {
  test('should sort dep chain', () => {
    const depsObj = {
      b: ['a'],
      c: ['a', 'b'],
      d: ['c'],
      e: ['d'],
    };

    const sorted = getResolvedDepGraph(depsObj);

    expect(sorted).toEqual(['b', 'c', 'd', 'e']);
  });
});
