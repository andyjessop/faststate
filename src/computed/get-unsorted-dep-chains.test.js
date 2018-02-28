import getUnsortedDepChains from './get-unsorted-dep-chains';

describe('getUnsortedDepChain', () => {
  test('should get unsorted dep chains', () => {
    const depsObj = {
      b: ['a'],
      c: ['a', 'b'],
      d: ['c'],
      e: ['d'],
    };

    const depChains = getUnsortedDepChains(depsObj);

    expect(depChains).toEqual({
      a: ['b', 'c', 'd', 'e'],
      b: ['c', 'd', 'e'],
      c: ['d', 'e'],
      d: ['e'],
    });
  });
});
