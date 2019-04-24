const { arraySame, removeIntersection } = require('./array-utils');

describe('arraySame', () => {
  describe('true', () => {
    test('for empty arrays', () => {
      const array1 = [];
      const array2 = [];

      const result = arraySame(array1, array2);

      expect(result).toBe(true);
    });

    test('for identical arrays', () => {
      const array1 = [1, 2, 3];
      const array2 = [1, 2, 3];

      const result = arraySame(array1, array2);

      expect(result).toBe(true);
    });
  });

  describe('false', () => {
    test('arrays of different lengths', () => {
      const array1 = [1, 2, 3];
      const array2 = [1, 2, 3, 4];

      const result = arraySame(array1, array2);

      expect(result).toBe(false);
    });

    test('different values', () => {
      const array1 = [1, 2, 3];
      const array2 = [1, 4, 3];

      const result = arraySame(array1, array2);

      expect(result).toBe(false);
    });
  });
});

describe('removeIntersection', () => {
  it('should remove the intersecting array from the input array', () => {
    const array = [1, 2, 3, 4, 5, 6];
    const intersect = [3, 4, 5];

    const result = removeIntersection(array, intersect);

    expect(result).toEqual([1, 2, 6]);
  });

  it('should return same array if no intersection', () => {
    const array = [1, 2, 3, 4, 5, 6];
    const intersect = [7, 8, 9];

    const result = removeIntersection(array, intersect);

    expect(result).toBe(array);
  });

  it('should remove intersection at start', () => {
    const array = [1, 2, 3, 4, 5, 6];
    const intersect = [1, 2, 3];

    const result = removeIntersection(array, intersect);

    expect(result).toEqual([4, 5, 6]);
  });

  it('should remove intersection at end', () => {
    const array = [1, 2, 3, 4, 5, 6];
    const intersect = [5, 6];

    const result = removeIntersection(array, intersect);

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should remove intersection overflow', () => {
    const array = [1, 2, 3, 4, 5, 6];
    const intersect = [5, 6, 7];

    const result = removeIntersection(array, intersect);

    expect(result).toBe(array);
  });

  it('should return existing array if empty intersection', () => {
    const array = [1, 2, 3, 4, 5, 6];
    const intersect = [];

    const result = removeIntersection(array, intersect);

    expect(result).toBe(array);
  });
});
