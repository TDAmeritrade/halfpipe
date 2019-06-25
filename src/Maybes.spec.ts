import 'jest';

import * as Maybes from './Maybes';
import { pipe } from './pipe';

describe('Maybes', () => {
  describe('combine', () => {
    describe('when all are Somes', () => {
      it('should return a Some', () => {
        const result = Maybes.combine(Maybes.Some(1), Maybes.Some('a'), Maybes.Some(true));

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual([1, 'a', true]);
      });
    });

    describe('when one is None', () => {
      it('should return a None', () => {
        const result = Maybes.combine(Maybes.Some(1), Maybes.None(), Maybes.Some(true));

        expect(result.isNone()).toBeTruthy();
      });
    });
  });

  describe('combineFrom/fromNulls', () => {
    describe('when all are non-null', () => {
      it('should return a Some', () => {
        const result = Maybes.fromNulls(1, 'a', true);

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual([1, 'a', true]);
      });
    });

    describe('when one is null', () => {
      it('should return a None', () => {
        const result = Maybes.fromNulls(1, null, true);

        expect(result.isNone()).toBeTruthy();
      });
    });
  });

  describe('tap/ifPresent', () => {
    describe('when given a Some', () => {
      it('should execute callback', () => {
        const fn = jest.fn();
        const result = pipe(
          Maybes.Some(5),
          Maybes.tap(fn)
        );

        expect(fn).toBeCalledWith(5);
        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual(5);
      });
    });

    describe('when given a None', () => {
      it('should do nothing', () => {
        const fn = jest.fn();
        const result = pipe(
          Maybes.None(),
          Maybes.tap(fn)
        );

        expect(fn).toBeCalledTimes(0);
        expect(result.isNone()).toBeTruthy();
      });
    });
  });

  describe('orThrow', () => {
    describe('when given a Some', () => {
      it('should return the value', () => {
        expect(
          pipe(
            Maybes.Some(4),
            Maybes.orThrow(new Error())
          )
        ).toEqual(4);
      });
    });

    describe('when given a None', () => {
      it('should throw the error', () => {
        const err = new Error();

        expect(() =>
          pipe(
            Maybes.None(),
            Maybes.orThrow(() => err)
          )
        ).toThrowError(err);
      });
    });
  });

  describe('toBoolean', () => {
    describe('when given a Some', () => {
      describe('and not given a mapper function', () => {
        it('should return true', () => {
          expect(
            pipe(
              Maybes.Some(123),
              Maybes.toBoolean()
            )
          ).toBeTruthy();
        });
      });

      describe('and the mapper function exists', () => {
        it('should correctly map to a boolean', () => {
          expect(
            pipe(
              Maybes.Some(3),
              Maybes.toBoolean(num => num > 2)
            )
          ).toBeTruthy();

          expect(
            pipe(
              Maybes.Some(3),
              Maybes.toBoolean(num => num > 4)
            )
          ).toBeFalsy();
        });
      });
    });

    describe('when given a None', () => {
      it('should return false', () => {
        expect(
          pipe(
            Maybes.None(),
            Maybes.toBoolean()
          )
        ).toBeFalsy();
      });
    });
  });

  describe('orSomeWith/defaultWith', () => {
    it('should correctly default', () => {
      expect(
        pipe(
          Maybes.None(),
          Maybes.defaultWith(() => 5)
        )
      ).toEqual(5);

      expect(
        pipe(
          Maybes.Some(3),
          Maybes.defaultWith(() => 5)
        )
      ).toEqual(3);
    });
  });

  describe('orElseWith', () => {
    it('should correctly default', () => {
      const result1 = pipe(
        Maybes.None<number>(),
        Maybes.orElseWith(() => Maybes.Some(3))
      );

      const result2 = pipe(
        Maybes.Some(2),
        Maybes.orElseWith(() => Maybes.Some(3))
      );

      expect(result1.isSome()).toBeTruthy();
      expect(result1.some()).toEqual(3);
      expect(result2.isSome()).toBeTruthy();
      expect(result2.some()).toEqual(2);
    });
  });

  describe('orElseFrom', () => {
    it('should correctly default', () => {
      const result1 = pipe(
        Maybes.None<number>(),
        Maybes.orElseFrom(() => 3)
      );

      const result2 = pipe(
        Maybes.None<number>(),
        Maybes.orElseFrom(() => null as any)
      );

      const result3 = pipe(
        Maybes.Some(2),
        Maybes.orElseFrom(() => 4)
      );

      expect(result1.isSome()).toBeTruthy();
      expect(result1.some()).toEqual(3);
      expect(result2.isNone()).toBeTruthy();
      expect(result3.isSome()).toBeTruthy();
      expect(result3.some()).toEqual(2);
    });
  });

  describe('map/flatMapFrom', () => {
    it('should map correctly', () => {
      const result1 = pipe(
        Maybes.Some(3),
        Maybes.map(num => num * 2)
      );

      const result2 = pipe(
        Maybes.None<number>(),
        Maybes.map(val => val + 2)
      );

      const result3 = pipe(
        Maybes.Some({ a: 2 } as any),
        Maybes.map(obj => obj.b)
      );

      expect(result1.isSome()).toBeTruthy();
      expect(result1.some()).toEqual(6);
      expect(result2.isNone()).toBeTruthy();
      expect(result3.isNone()).toBeTruthy();
    });
  });

  describe('cata', () => {
    let someFn: (str: string) => string;
    let noneFn: () => string;

    beforeEach(() => {
      someFn = jest.fn(() => 'some');
      noneFn = jest.fn(() => 'none');
    });

    describe('when given a Some', () => {
      it('should unwrap with the correct function', () => {
        const result = pipe(
          Maybes.Some('test'),
          Maybes.cata(noneFn, someFn)
        );

        expect(result).toEqual('some');
        expect(someFn).toBeCalledWith('test');
      });
    });

    describe('when given a None', () => {
      it('should unwrap with the correct function', () => {
        const result = pipe(
          Maybes.None<any>(),
          Maybes.cata(noneFn, someFn)
        );

        expect(result).toEqual('none');
        expect(noneFn).toBeCalledTimes(1);
      });
    });
  });

  describe('filter', () => {
    it('should filter correctly', () => {
      const result1 = pipe(
        Maybes.None<number>(),
        Maybes.filter(num => num > 4)
      );

      const result2 = pipe(
        Maybes.Some(3),
        Maybes.filter(num => num > 4)
      );

      const result3 = pipe(
        Maybes.Some(5),
        Maybes.filter(num => num > 4)
      );

      expect(result1.isNone()).toBeTruthy();
      expect(result2.isNone()).toBeTruthy();
      expect(result3.isSome()).toBeTruthy();
      expect(result3.some()).toEqual(5);
    });
  });

  describe('unless', () => {
    it('should filter correctly', () => {
      const result1 = pipe(
        Maybes.None<number>(),
        Maybes.unless(num => num > 4)
      );

      const result2 = pipe(
        Maybes.Some(3),
        Maybes.unless(num => num > 4)
      );

      const result3 = pipe(
        Maybes.Some(5),
        Maybes.unless(num => num > 4)
      );

      expect(result1.isNone()).toBeTruthy();
      expect(result2.isSome()).toBeTruthy();
      expect(result2.some()).toEqual(3);
      expect(result3.isNone()).toBeTruthy();
    });
  });

  describe('flatMap', () => {
    it('should flatMap correctly', () => {
      const result1 = pipe(
        Maybes.None<number>(),
        Maybes.flatMap(num => (num === 2 ? Maybes.None() : Maybes.Some(num * 2)))
      );

      const result2 = pipe(
        Maybes.Some(3),
        Maybes.flatMap(num => (num === 2 ? Maybes.None() : Maybes.Some(num * 2)))
      );

      const result3 = pipe(
        Maybes.Some(2),
        Maybes.flatMap(num => (num === 2 ? Maybes.None() : Maybes.Some(num * 2)))
      );

      expect(result1.isNone()).toBeTruthy();
      expect(result2.isSome()).toBeTruthy();
      expect(result2.some()).toEqual(6);
      expect(result3.isNone()).toBeTruthy();
    });
  });

  describe('orNull', () => {
    it('should get or default correctly', () => {
      const result1 = pipe(
        Maybes.None<number>(),
        Maybes.orNull()
      );

      const result2 = pipe(
        Maybes.Some(3),
        Maybes.orNull()
      );

      expect(result1).toBeNull();
      expect(result2).toEqual(3);
    });
  });

  describe('orUndefined', () => {
    it('should get or default correctly', () => {
      const result1 = pipe(
        Maybes.None<number>(),
        Maybes.orUndefined()
      );

      const result2 = pipe(
        Maybes.Some(3),
        Maybes.orUndefined()
      );

      expect(result1).toBeUndefined();
      expect(result2).toEqual(3);
    });
  });

  describe('toEither', () => {
    it('should convert to an Either correctly', () => {
      const result1 = pipe(
        Maybes.None<number>(),
        Maybes.toEither('left side')
      );

      const result2 = pipe(
        Maybes.Some(4),
        Maybes.toEither('left side')
      );

      expect(result1.isLeft()).toBeTruthy();
      expect(result1.left()).toEqual('left side');
      expect(result2.isRight()).toBeTruthy();
      expect(result2.right()).toEqual(4);
    });
  });

  describe('orSome/defaultTo', () => {
    it('should get or default correctly', () => {
      const result1 = pipe(
        Maybes.None<number>(),
        Maybes.defaultTo(4)
      );

      const result2 = pipe(
        Maybes.Some(3),
        Maybes.defaultTo(4)
      );

      expect(result1).toEqual(4);
      expect(result2).toEqual(3);
    });
  });

  describe('orElse', () => {
    it('should correctly default', () => {
      const result1 = pipe(
        Maybes.None<number>(),
        Maybes.orElse(Maybes.Some(3))
      );

      const result2 = pipe(
        Maybes.Some(2),
        Maybes.orElse(Maybes.Some(3))
      );

      expect(result1.isSome()).toBeTruthy();
      expect(result1.some()).toEqual(3);
      expect(result2.isSome()).toBeTruthy();
      expect(result2.some()).toEqual(2);
    });
  });

  describe('isSome', () => {
    describe('when given a Some', () => {
      it('should return true', () => {
        expect(
          pipe(
            Maybes.Some(4),
            Maybes.isSome()
          )
        ).toBeTruthy();
      });
    });

    describe('when given a None', () => {
      it('should return false', () => {
        expect(
          pipe(
            Maybes.None<number>(),
            Maybes.isSome()
          )
        ).toBeFalsy();
      });
    });
  });

  describe('isNone', () => {
    describe('when given a Some', () => {
      it('should return false', () => {
        expect(
          pipe(
            Maybes.Some(4),
            Maybes.isNone()
          )
        ).toBeFalsy();
      });
    });

    describe('when given a None', () => {
      it('should return true', () => {
        expect(
          pipe(
            Maybes.None<number>(),
            Maybes.isNone()
          )
        ).toBeTruthy();
      });
    });
  });

  describe('some', () => {
    it('should get the value', () => {
      expect(
        pipe(
          Maybes.Some(123),
          Maybes.some()
        )
      ).toEqual(123);
    });
  });

  describe('fromNull/of', () => {
    it('should create a Maybe', () => {
      const maybe1 = Maybes.fromNull('hello');
      const maybe2 = Maybes.fromNull('');
      const maybe3 = Maybes.fromNull(123);
      const maybe4 = Maybes.fromNull(0);
      const maybe5 = Maybes.fromNull(null);
      const maybe6 = Maybes.fromNull(undefined);

      expect(maybe1.isSome()).toBeTruthy();
      expect(maybe1.some()).toEqual('hello');
      expect(maybe2.isSome()).toBeTruthy();
      expect(maybe2.some()).toEqual('');
      expect(maybe3.isSome()).toBeTruthy();
      expect(maybe3.some()).toEqual(123);
      expect(maybe4.isSome()).toBeTruthy();
      expect(maybe4.some()).toEqual(0);
      expect(maybe5.isNone()).toBeTruthy();
      expect(maybe6.isNone()).toBeTruthy();
    });
  });

  describe('isEqualTo', () => {
    it('should correctly compare values', () => {
      const obj = { x: 4 };

      expect(
        pipe(
          Maybes.None<typeof obj>(),
          Maybes.isEqualTo(obj)
        )
      ).toBeFalsy();

      expect(
        pipe(
          Maybes.Some({ x: 4 }),
          Maybes.isEqualTo(obj)
        )
      ).toBeFalsy();

      expect(
        pipe(
          Maybes.Some(obj),
          Maybes.isEqualTo(obj)
        )
      ).toBeTruthy();
    });
  });

  describe('isEqualWith', () => {
    it('should correctly compare values', () => {
      const obj = { x: 4 };

      expect(
        pipe(
          Maybes.None<typeof obj>(),
          Maybes.isEqualWith(() => obj)
        )
      ).toBeFalsy();

      expect(
        pipe(
          Maybes.Some({ x: 4 }),
          Maybes.isEqualWith(() => obj)
        )
      ).toBeFalsy();

      expect(
        pipe(
          Maybes.Some(obj),
          Maybes.isEqualWith(() => obj)
        )
      ).toBeTruthy();
    });
  });

  describe('matchesTo', () => {
    it('should correctly compare values', () => {
      const obj = { x: 4 };

      expect(
        pipe(
          Maybes.None<typeof obj>(),
          Maybes.matchesTo(obj)
        )
      ).toBeFalsy();

      expect(
        pipe(
          Maybes.Some({ x: 3 }),
          Maybes.matchesTo(obj)
        )
      ).toBeFalsy();

      expect(
        pipe(
          Maybes.Some({ x: 4 }),
          Maybes.matchesTo(obj)
        )
      ).toBeTruthy();

      expect(
        pipe(
          Maybes.Some(obj),
          Maybes.matchesTo(obj)
        )
      ).toBeTruthy();
    });
  });

  describe('matchesWith', () => {
    it('should correctly compare values', () => {
      const obj = { x: 4 };

      expect(
        pipe(
          Maybes.None<typeof obj>(),
          Maybes.matchesWith(() => obj)
        )
      ).toBeFalsy();

      expect(
        pipe(
          Maybes.Some({ x: 3 }),
          Maybes.matchesWith(() => obj)
        )
      ).toBeFalsy();

      expect(
        pipe(
          Maybes.Some({ x: 4 }),
          Maybes.matchesWith(() => obj)
        )
      ).toBeTruthy();

      expect(
        pipe(
          Maybes.Some(obj),
          Maybes.matchesWith(() => obj)
        )
      ).toBeTruthy();
    });
  });

  describe('same', () => {
    it('should correctly compare Maybes', () => {
      const comparer = jest.fn((a, b) => a.length === b.length);

      const result1 = Maybes.same(comparer, Maybes.None(), Maybes.None());
      expect(comparer).toBeCalledTimes(0);
      expect(result1).toBeTruthy();

      const result2 = Maybes.same(comparer, Maybes.Some('abc'), Maybes.None());
      expect(comparer).toBeCalledTimes(0);
      expect(result2).toBeFalsy();

      const result3 = Maybes.same(comparer, Maybes.Some('abc'), Maybes.Some('defg'));
      expect(comparer).toBeCalledWith('abc', 'defg');
      expect(result3).toBeFalsy();

      const result4 = Maybes.same(comparer, Maybes.Some('abc'), Maybes.Some('def'));
      expect(comparer).toBeCalledWith('abc', 'def');
      expect(result4).toBeTruthy();
    });
  });

  describe('equals', () => {
    it('should correctly compare Maybes', () => {
      const obj = { x: 4 };

      expect(Maybes.equals(Maybes.None(), Maybes.None())).toBeTruthy();
      expect(Maybes.equals(Maybes.Some(obj), Maybes.None())).toBeFalsy();
      expect(Maybes.equals(Maybes.Some(obj), Maybes.Some({ x: 4 }))).toBeFalsy();
      expect(Maybes.equals(Maybes.Some(obj), Maybes.Some(obj))).toBeTruthy();
    });
  });

  describe('fromPredicate', () => {
    it('should create a Maybe', () => {
      const result1 = Maybes.fromPredicate(Array.isArray, undefined);
      const result2 = Maybes.fromPredicate(Array.isArray, null);
      const result3 = Maybes.fromPredicate(Array.isArray, 'test');
      const result4 = Maybes.fromPredicate(Array.isArray, ['test']);

      expect(result1.isNone()).toBeTruthy();
      expect(result2.isNone()).toBeTruthy();
      expect(result3.isNone()).toBeTruthy();
      expect(result4.isSome()).toBeTruthy();
      expect(result4.some()).toEqual(['test']);
    });
  });

  describe('fromNaN', () => {
    it('should create a numeric Maybe', () => {
      const result1 = Maybes.fromNaN(undefined);
      const result2 = Maybes.fromNaN(null);
      const result3 = Maybes.fromNaN(NaN);
      const result4 = Maybes.fromNaN(Infinity);
      const result5 = Maybes.fromNaN(Number.NEGATIVE_INFINITY);
      const result6 = Maybes.fromNaN(Number.POSITIVE_INFINITY);
      const result7 = Maybes.fromNaN('test');
      const result8 = Maybes.fromNaN(123);

      expect(result1.isNone()).toBeTruthy();
      expect(result2.isNone()).toBeTruthy();
      expect(result3.isNone()).toBeTruthy();
      expect(result4.isNone()).toBeTruthy();
      expect(result5.isNone()).toBeTruthy();
      expect(result6.isNone()).toBeTruthy();
      expect(result7.isNone()).toBeTruthy();
      expect(result8.isSome()).toBeTruthy();
      expect(result8.some()).toEqual(123);
    });
  });
});
