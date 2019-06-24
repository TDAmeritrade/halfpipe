import 'jest';

import * as Sets from './Sets';
import { pipe } from './pipe';

describe('Sets', () => {
  describe('size', () => {
    it('should get the size of the map', () => {
      expect(
        pipe(
          new Set([1, 2, 3]),
          Sets.size()
        )
      ).toEqual(3);
    });
  });

  describe('has', () => {
    describe('when the key exists', () => {
      it('should return true', () => {
        expect(
          pipe(
            new Set(['a', 'b']),
            Sets.has('b')
          )
        ).toBeTruthy();
      });
    });

    describe('when the key does not exist', () => {
      it('should return false', () => {
        expect(
          pipe(
            new Set(['a', 'b']),
            Sets.has('c')
          )
        ).toBeFalsy();
      });
    });
  });

  describe('forEach', () => {
    it('should call the callback for each element', () => {
      const cb = jest.fn();
      const set = new Set(['a', 'b', 'c']);

      pipe(
        set,
        Sets.forEach(cb)
      );

      expect(cb).toBeCalledTimes(3);
      expect(cb).toBeCalledWith('a', 'a', set);
      expect(cb).toBeCalledWith('b', 'b', set);
      expect(cb).toBeCalledWith('c', 'c', set);
    });
  });
});
