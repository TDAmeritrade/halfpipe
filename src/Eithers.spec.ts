import 'jest';

import * as Eithers from './Eithers';
import { pipe } from './pipe';

describe('Eithers', () => {
  describe('attempt', () => {
    describe('when the function throws', () => {
      it('should create a Left', () => {
        const err = new Error();
        const result = Eithers.attempt(() => {
          throw err;
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.left()).toBe(err);
      });
    });

    describe('when the function does not throw', () => {
      it('should create a right', () => {
        const result = Eithers.attempt(() => 5);

        expect(result.isRight()).toBeTruthy();
        expect(result.right()).toBe(5);
      });
    });
  });

  describe('fromNull', () => {
    describe('when the value is nil', () => {
      it('should create a Left', () => {
        const result = Eithers.fromNull('test', null);

        expect(result.isLeft()).toBeTruthy();
        expect(result.left()).toBe('test');
      });
    });

    describe('when the value is not nil', () => {
      it('should create a right', () => {
        const result = Eithers.fromNull('test', 123);

        expect(result.isRight()).toBeTruthy();
        expect(result.right()).toBe(123);
      });
    });
  });

  describe('combine', () => {
    it('should combine the Eithers', () => {
      const result1 = pipe(
        [Eithers.Right<string, number>(3), Eithers.Right<string, number>(2), Eithers.Right<string, number>(1)],
        Eithers.combine('left')
      );

      const result2 = pipe(
        [Eithers.Right<string, number>(3), Eithers.Left<string, number>('test'), Eithers.Right<string, number>(1)],
        Eithers.combine('left')
      );

      expect(result1.isRight()).toBeTruthy();
      expect(result1.right()).toEqual([3, 2, 1]);
      expect(result2.isLeft()).toBeTruthy();
      expect(result2.left()).toEqual('left');
    });
  });

  describe('orThrow', () => {
    describe('when a Right value', () => {
      it('should return the value', () => {
        expect(
          pipe(
            Eithers.Right(123),
            Eithers.orThrow()
          )
        ).toEqual(123);
      });
    });

    describe('when a Left value', () => {
      it('should throw it', () => {
        const err = new Error();

        expect(() =>
          pipe(
            Eithers.Left(err),
            Eithers.orThrow()
          )
        ).toThrowError(err);
      });
    });
  });

  describe('toValue', () => {
    it('should get the value of either side', () => {
      expect(
        pipe(
          Eithers.Left('a'),
          Eithers.toValue()
        )
      ).toEqual('a');

      expect(
        pipe(
          Eithers.Right('a'),
          Eithers.toValue()
        )
      ).toEqual('a');
    });
  });

  describe('cata', () => {
    it('should unwrap either side', () => {
      expect(
        pipe(
          Eithers.Left('abc'),
          Eithers.cata(val => val.length, () => 4)
        )
      ).toEqual(3);

      expect(
        pipe(
          Eithers.Right('abc'),
          Eithers.cata(() => 1, val => val.length)
        )
      ).toEqual(3);
    });
  });

  describe('map/rightMap', () => {
    it('should map the right side', () => {
      const result1 = pipe(
        Eithers.Left<number, number>(3),
        Eithers.map(val => val + 4)
      );

      const result2 = pipe(
        Eithers.Right<number, number>(3),
        Eithers.map(val => val + 4)
      );

      expect(result1.isLeft()).toBeTruthy();
      expect(result1.left()).toEqual(3);
      expect(result2.isRight()).toBeTruthy();
      expect(result2.right()).toEqual(7);
    });
  });

  describe('flatMap/rightFlatMap', () => {
    it('should flat map the right side', () => {
      const result1 = pipe(
        Eithers.Left<number, number>(3),
        Eithers.flatMap(val => Eithers.Left(val + 4))
      );

      const result2 = pipe(
        Eithers.Right<number, number>(3),
        Eithers.flatMap(val => Eithers.Left(val + 4))
      );

      expect(result1.isLeft()).toBeTruthy();
      expect(result1.left()).toEqual(3);
      expect(result2.isLeft()).toBeTruthy();
      expect(result2.left()).toEqual(7);
    });
  });

  describe('leftMap', () => {
    it('should map the left side', () => {
      const result1 = pipe(
        Eithers.Left<number, number>(3),
        Eithers.leftMap(val => val + 4)
      );

      const result2 = pipe(
        Eithers.Right<number, number>(3),
        Eithers.leftMap(val => val + 4)
      );

      expect(result1.isLeft()).toBeTruthy();
      expect(result1.left()).toEqual(7);
      expect(result2.isRight()).toBeTruthy();
      expect(result2.right()).toEqual(3);
    });
  });

  describe('leftFlatMap', () => {
    it('should flat map the left side', () => {
      const result1 = pipe(
        Eithers.Left<number, number>(3),
        Eithers.leftFlatMap(val => Eithers.Right(val + 4))
      );

      const result2 = pipe(
        Eithers.Right<number, number>(3),
        Eithers.leftFlatMap(val => Eithers.Right(val + 4))
      );

      expect(result1.isRight()).toBeTruthy();
      expect(result1.right()).toEqual(7);
      expect(result2.isRight()).toBeTruthy();
      expect(result2.right()).toEqual(3);
    });
  });

  describe('bimap/mapBoth', () => {
    it('should map both sides', () => {
      const result1 = pipe(
        Eithers.Left<number, number>(3),
        Eithers.bimap(num => num + 3, num => num - 3)
      );

      const result2 = pipe(
        Eithers.Right<number, number>(3),
        Eithers.bimap(num => num + 3, num => num - 3)
      );

      expect(result1.isLeft()).toBeTruthy();
      expect(result1.left()).toEqual(6);
      expect(result2.isRight()).toBeTruthy();
      expect(result2.right()).toEqual(0);
    });
  });

  describe('isLeft', () => {
    describe('when given a Left', () => {
      it('should return true', () => {
        expect(
          pipe(
            Eithers.Left(1),
            Eithers.isLeft()
          )
        ).toBeTruthy();
      });
    });

    describe('when given a Right', () => {
      it('should return false', () => {
        expect(
          pipe(
            Eithers.Right(1),
            Eithers.isLeft()
          )
        ).toBeFalsy();
      });
    });
  });

  describe('left', () => {
    it('should get the left side', () => {
      expect(
        pipe(
          Eithers.Left(4),
          Eithers.left()
        )
      ).toEqual(4);
    });
  });

  describe('isRight', () => {
    describe('when given a Right', () => {
      it('should return true', () => {
        expect(
          pipe(
            Eithers.Right(1),
            Eithers.isRight()
          )
        ).toBeTruthy();
      });
    });

    describe('when given a Left', () => {
      it('should return false', () => {
        expect(
          pipe(
            Eithers.Left(1),
            Eithers.isRight()
          )
        ).toBeFalsy();
      });
    });
  });

  describe('right', () => {
    it('should get the right side', () => {
      expect(
        pipe(
          Eithers.Right(4),
          Eithers.right()
        )
      ).toEqual(4);
    });
  });

  describe('toMaybe', () => {
    describe('when given a Left', () => {
      it('should return a None', () => {
        const result = pipe(
          Eithers.Left(4),
          Eithers.toMaybe()
        );

        expect(result.isSome()).toBeFalsy();
      });
    });

    describe('when given a Right', () => {
      it('should return a Some', () => {
        const result = pipe(
          Eithers.Right(4),
          Eithers.toMaybe()
        );

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual(4);
      });
    });
  });

  describe('swap/flip', () => {
    it('should swap the sides', () => {
      const result1 = pipe(
        Eithers.Left(4),
        Eithers.swap()
      );

      const result2 = pipe(
        Eithers.Right(2),
        Eithers.swap()
      );

      expect(result1.isRight()).toBeTruthy();
      expect(result1.right()).toEqual(4);
      expect(result2.isLeft()).toBeTruthy();
      expect(result2.left()).toEqual(2);
    });
  });
});
