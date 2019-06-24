import 'jest';

import { ifElse, ifThen, switchCase } from './ifElse';

describe('ifElse', () => {
  describe('ifElse', () => {
    describe('when the predicate is truthy', () => {
      it('should invoke the true handler', () => {
        const fn = ifElse(() => true, v => v, () => null);

        expect(fn(123)).toBe(123);
      });
    });

    describe('when the predicate is falsey', () => {
      it('should invoke the false handler', () => {
        const fn = ifElse(() => false, v => v, () => null);

        expect(fn(123)).toBeNull();
      });
    });

    describe('when given a truthy value', () => {
      it('should invoke the true handler', () => {
        const fn = ifElse(true, v => 'hello' + v, v => 'world' + v);

        expect(fn('!')).toBe('hello!');
      });
    });

    describe('when given a falsey value', () => {
      it('should invoke the false handler', () => {
        const fn = ifElse(false, v => 'hello' + v, v => 'world' + v);

        expect(fn('!')).toBe('world!');
      });
    });
  });

  describe('switchCase', () => {
    describe('when using a function', () => {
      describe('when returning true', () => {
        it('should execute the callback', () => {
          expect(switchCase([[() => false, () => 123], [() => true, () => 555]])).toBe(555);
        });
      });
    });

    describe('when using primitive', () => {
      describe('when true', () => {
        it('should execute the callback', () => {
          expect(switchCase([[false, () => 123], [true, () => 555]])).toBe(555);
        });
      });
    });

    describe('when no case is valid', () => {
      it('should return undefined', () => {
        expect(switchCase([[false, () => 123], [false, () => 456]])).toBeUndefined();
      });
    });
  });

  describe('ifThen', () => {
    describe('when true', () => {
      it('should execute the callback', () => {
        const fn = ifThen(() => true, (v: number) => v + 10);

        expect(fn(90)).toEqual(100);
      });
    });

    describe('when false', () => {
      it('should return the initial value', () => {
        const fn = ifThen(() => false, (v: number) => v + 10);

        expect(fn(90)).toEqual(90);
      });
    });
  });
});
