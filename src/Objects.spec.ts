import 'jest';

import * as Objects from './Objects';
import { pipe } from './pipe';

describe('Objects', () => {
  describe('get', () => {
    describe('when the key exists', () => {
      it('should return a Some', () => {
        const result = pipe(
          { b: 2 },
          Objects.get('b')
        );

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual(2);
      });
    });

    describe('when the key does not exist', () => {
      it('should return a None', () => {
        const result = pipe(
          { b: 2 } as any,
          Objects.get('c')
        );

        expect(result.isNone()).toBeTruthy();
      });
    });
  });

  describe('keys', () => {
    it('should get the keys of the object', () => {
      expect(
        pipe(
          { a: 1, b: 2, c: 3 },
          Objects.keys()
        )
      ).toEqual(['a', 'b', 'c']);
    });
  });

  describe('values', () => {
    it('should get the values of the object', () => {
      expect(
        pipe(
          { a: 1, b: 2, c: 3 },
          Objects.values()
        )
      ).toEqual([1, 2, 3]);
    });
  });

  describe('entries', () => {
    it('should get the entries of the object', () => {
      expect(
        pipe(
          { a: 1, b: 2, c: 3 },
          Objects.entries()
        )
      ).toEqual([['a', 1], ['b', 2], ['c', 3]]);
    });
  });

  describe('has', () => {
    describe('when the key exists', () => {
      it('should return true', () => {
        expect(
          pipe(
            { a: 1, b: 2 },
            Objects.has('b')
          )
        ).toBeTruthy();
      });
    });

    describe('when the key does not exist', () => {
      it('should return false', () => {
        expect(
          pipe(
            { a: 1, b: 2 },
            Objects.has('c')
          )
        ).toBeFalsy();
      });
    });
  });
});
