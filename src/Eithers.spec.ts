import * as Eithers from './Eithers';

describe('Eithers', () => {
  describe('when attempting a function call', () => {
    describe('and there is an error thrown', () => {
      it('should return an Either with the error', () => {
        const result = Eithers.attempt(() => {
          throw new Error('test');
        });

        expect(result.isLeft()).toBeTruthy;
        expect(result.left()).toBeInstanceOf(Error);
      });
    });

    describe('and when there is not an error', () => {
      it('should return an Either with the value', () => {
        const result = Eithers.attempt(() => 123);

        expect(result.isRight()).toBeTruthy;
        expect(result.right()).toBe(123);
      });
    });
  });

  describe('when creating an either from null', () => {
    describe('and when the value is null', () => {
      it('should return a Left', () => {
        const result = Eithers.fromNull('blorg', null);

        expect(result.isLeft()).toBeTruthy;
        expect(result.left()).toBe('blorg');
      });
    });

    describe('and when the value is not null', () => {
      it('should return a Right', () => {
        const result = Eithers.fromNull('blorg', 123);

        expect(result.isRight()).toBeTruthy;
        expect(result.right()).toBe(123);
      });
    });
  });

  describe('when combining eithers', () => {
    describe('and one of the eithers has a left value', () => {
      it('should return a Left', () => {
        const result = Eithers.combineWith(() => 'nope')([Eithers.Right(1), Eithers.Left('no'), Eithers.Right(3)]);

        expect(result.isLeft()).toBeTruthy;
        expect(result.left()).toBe('nope');
      });
    });

    describe('and all of the eithers have a right value', () => {
      it('should return a Right of all the values', () => {
        const result = Eithers.combineWith(() => 'nope')([Eithers.Right(1), Eithers.Right(2), Eithers.Right(3)]);

        expect(result.isRight()).toBeTruthy;
        expect(result.right()).toEqual([1, 2, 3]);
      });
    });
  });

  describe('when flipping an either', () => {
    it('should flip the left side to a right side', () => {
      const result = Eithers.flip()(Eithers.Right('hello'));

      expect(result.isLeft()).toBeTruthy;
      expect(result.left()).toBe('hello');
    });

    it('should flip the right side to a left side', () => {
      const result = Eithers.flip()(Eithers.Left('world'));

      expect(result.isRight()).toBeTruthy;
      expect(result.right()).toBe('world');
    });
  });

  describe('when throwing from an either', () => {
    it('should throw the left side', () => {
      expect(() => Eithers.orThrow()(Eithers.Left('test'))).toThrow('test');
    });

    it('should return the right side', () => {
      expect(Eithers.orThrow()(Eithers.Right('test'))).toBe('test');
    });
  });
});
