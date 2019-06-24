import 'jest';

import * as Maps from './Maps';
import { pipe } from './pipe';

describe('Maps', () => {
  describe('get', () => {
    describe('when the key exists', () => {
      it('should return a Some', () => {
        const result = pipe(
          new Map([['a', 1], ['b', 2]]),
          Maps.get('b')
        );

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual(2);
      });
    });

    describe('when the key does not exist', () => {
      it('should return a None', () => {
        const result = pipe(
          new Map([['a', 1], ['b', 2]]),
          Maps.get('c')
        );

        expect(result.isNone()).toBeTruthy();
      });
    });
  });

  describe('size', () => {
    it('should get the size of the map', () => {
      expect(
        pipe(
          new Map([['a', 1], ['b', 2], ['c', 3]]),
          Maps.size()
        )
      ).toEqual(3);
    });
  });

  describe('keys', () => {
    it('should get the keys of the map', () => {
      expect(
        pipe(
          new Map([['a', 1], ['b', 2], ['c', 3]]),
          Maps.keys()
        )
      ).toEqual(['a', 'b', 'c']);
    });
  });

  describe('values', () => {
    it('should get the values of the map', () => {
      expect(
        pipe(
          new Map([['a', 1], ['b', 2], ['c', 3]]),
          Maps.values()
        )
      ).toEqual([1, 2, 3]);
    });
  });

  describe('entries', () => {
    it('should get the entries of the map', () => {
      expect(
        pipe(
          new Map([['a', 1], ['b', 2], ['c', 3]]),
          Maps.entries()
        )
      ).toEqual([['a', 1], ['b', 2], ['c', 3]]);
    });
  });

  describe('has', () => {
    describe('when the key exists', () => {
      it('should return true', () => {
        expect(
          pipe(
            new Map([['a', 1], ['b', 2]]),
            Maps.has('b')
          )
        ).toBeTruthy();
      });
    });

    describe('when the key does not exist', () => {
      it('should return false', () => {
        expect(
          pipe(
            new Map([['a', 1], ['b', 2]]),
            Maps.has('c')
          )
        ).toBeFalsy();
      });
    });
  });

  describe('forEach', () => {
    it('should call the callback for each element', () => {
      const cb = jest.fn();
      const map = new Map([['a', 1], ['b', 2], ['c', 3]]);

      pipe(
        map,
        Maps.forEach(cb)
      );

      expect(cb).toBeCalledTimes(3);
      expect(cb).toBeCalledWith(1, 'a', map);
      expect(cb).toBeCalledWith(2, 'b', map);
      expect(cb).toBeCalledWith(3, 'c', map);
    });
  });
});
