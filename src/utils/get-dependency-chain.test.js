import getDependencyChain from './get-dependency-chain';

describe('getDependencyChain', () => {
  test('should get dependency chain', () => {
    const isDependencyOf = {
      a: ['b'],
      b: ['c', 'd'],
      c: ['d', 'e', 'f'],
    };

    // The last 'd' here is because after 'c', it gets the dependencies 'd', 'e', 'f',
    // then goes onto the next element in b: ['c', 'd']
    expect(getDependencyChain(isDependencyOf, 'a')).toEqual(['b', 'c', 'd', 'e', 'f', 'd']);
  });
});
