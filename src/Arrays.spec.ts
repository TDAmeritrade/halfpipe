import * as Arrays from './Arrays';
import { pipe } from './pipe';

describe('Arrays', () => {
  describe('when flat mapping', () => {
    it('should flat map the array', () => {
      expect(
        pipe(
          ['this is a test', 'hello world'],
          Arrays.flatMap((val, index, arr) => [...val.split(' '), index, arr.length])
        )
      ).toEqual(['this', 'is', 'a', 'test', 0, 2, 'hello', 'world', 1, 2]);
    });
  });

  describe('when reducing', () => {
    it('should reduce', () => {
      expect(
        pipe(
          [1, 2, 3, 4],
          Arrays.reduce((result, val, index, arr) => result + val * index * arr.length, () => 0)
        )
      ).toBe(80);
    });
  });

  describe('when reducing right', () => {
    it('should reduce right', () => {
      expect(
        pipe(
          ['o', 'l', 'l', 'e', 'h'],
          Arrays.reduceRight((result, current) => result + current, () => '')
        )
      ).toBe('hello');
    });
  });
});
