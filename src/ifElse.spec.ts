import { ifElse, ifThen, switchCase } from './ifElse';

describe('utils.ifElse', () => {
  describe('when the predicate is truthy', () => {
    it('should invoke the true handler', () => {
      const fn = ifElse(() => true, v => v, () => null);

      expect(fn(123)).toBe(123);
    });
  });

  describe('when the predicate is falsey', () => {
    it('should invoke the false handler', () => {
      const fn = ifElse(() => false, v => v, () => null);

      expect(fn(123)).toBeNull;
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

  describe('when using a switch case', () => {
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
  });

  describe('when using an if then', () => {
    describe('when true', () => {
      it('should execute the callback', () => {
        const fn = ifThen(() => true, (v: number) => v + 10);

        expect(fn(90)).toBe(100);
      });
    });

    describe('when false', () => {
      it('should return null', () => {
        const fn = ifThen(() => false, (v: number) => v + 10);

        expect(fn(90)).toBeUndefined;
      });
    });
  });
});
