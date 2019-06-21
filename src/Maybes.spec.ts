import * as _ from 'lodash';
import { Maybe } from 'monet';

import * as Maybes from './Maybes';

describe('Maybes', () => {
  describe('when getting a default value', () => {
    describe('and when there is a value', () => {
      it('should return the value', () => {
        expect(Maybes.defaultTo(15)(Maybe.Some(20))).toBe(20);
      });
    });

    describe('and when there is not a value', () => {
      it('should return the default value', () => {
        expect(Maybes.defaultTo(15)(Maybe.None())).toBe(15);
      });
    });
  });

  describe('when filtering', () => {
    describe('when the value matches', () => {
      it('should return the value', () => {
        const result = Maybes.filter(() => true)(Maybe.Some(15));

        expect(result.isSome()).toBeTruthy;
        expect(result.some()).toBe(15);
      });
    });

    describe('and when the value does not match', () => {
      it('should return none', () => {
        const result = Maybes.filter(() => false)(Maybe.Some(15));

        expect(result.isNone()).toBeTruthy;
      });
    });
  });

  describe('when getting a value of null', () => {
    describe('and when there is a value', () => {
      it('should return the value', () => {
        expect(Maybes.orNull()(Maybe.Some(20))).toBe(20);
      });
    });

    describe('and when there is not a value', () => {
      it('should return the default value', () => {
        expect(Maybes.orNull()(Maybe.None())).toBeNull;
      });
    });
  });

  describe('when determining if a maybe is a some', () => {
    describe('when some', () => {
      it('should return true', () => {
        expect(Maybes.isSome()(Maybe.Some(123))).toBeTruthy;
      });
    });

    describe('when none', () => {
      it('should return false', () => {
        expect(Maybes.isSome()(Maybe.None())).toBe(false);
      });
    });
  });

  describe('when determining if a maybe is a none', () => {
    describe('when some', () => {
      it('should return false', () => {
        expect(Maybes.isNone()(Maybe.Some(123))).toBe(false);
      });
    });

    describe('when none', () => {
      it('should return true', () => {
        expect(Maybes.isNone()(Maybe.None())).toBeTruthy;
      });
    });
  });

  describe('when flat mapping from a value', () => {
    describe('and when the value is null', () => {
      it('should return none', () => {
        const result = Maybes.flatMapFrom(value => null)(Maybe.Some(1));

        expect(result.isNone()).toBeTruthy;
      });
    });

    describe('and when the value is not null', () => {
      it('should return some', () => {
        const result = Maybes.flatMapFrom(value => 2)(Maybe.Some(1));

        expect(result.isSome()).toBeTruthy;
        expect(result.some()).toBe(2);
      });
    });
  });

  describe('when defaulting a value', () => {
    describe('when none', () => {
      it('should return the default', () => {
        expect(Maybes.defaultTo(123)(Maybe.None())).toBe(123);
      });
    });

    describe('when some', () => {
      it('should return the default', () => {
        expect(Maybes.defaultTo(123)(Maybe.Some(555))).toBe(555);
      });
    });
  });

  describe('when defaulting with a factory', () => {
    describe('when none', () => {
      it('should return the default', () => {
        expect(Maybes.defaultWith(() => 123)(Maybe.None())).toBe(123);
      });
    });

    describe('when some', () => {
      it('should return the default', () => {
        expect(Maybes.defaultWith(() => 123)(Maybe.Some(555))).toBe(555);
      });
    });
  });

  describe('when using an else path from a value', () => {
    describe('when none', () => {
      it('should return the else maybe', () => {
        const result = Maybes.orElseFrom(() => 123)(Maybe.None());

        expect(result.isSome()).toBeTruthy;
        expect(result.some()).toBe(123);
      });
    });

    describe('when some', () => {
      it('should return the original maybe', () => {
        const result = Maybes.orElseFrom(() => 123)(Maybe.Some(555));

        expect(result.isSome()).toBeTruthy;
        expect(result.some()).toBe(555);
      });
    });
  });

  describe('when using an else path', () => {
    describe('when none', () => {
      it('should return the else maybe', () => {
        const result = Maybes.orElseWith(() => Maybe.Some(123))(Maybe.None());

        expect(result.isSome()).toBeTruthy;
        expect(result.some()).toBe(123);
      });
    });

    describe('when some', () => {
      it('should return the original maybe', () => {
        const result = Maybes.orElseWith(() => Maybe.Some(123))(Maybe.Some(555));

        expect(result.isSome()).toBeTruthy;
        expect(result.some()).toBe(555);
      });
    });
  });

  describe('when using catamorphism', () => {
    describe('when none', () => {
      it('should return the none predicate result', () => {
        const result = Maybes.cata(() => 123, () => 555)(Maybe.None());

        expect(result).toBe(123);
      });
    });

    describe('when some', () => {
      it('should return the original maybe', () => {
        const result = Maybes.cata(() => 123, () => 555)(Maybe.Some(true));

        expect(result).toBe(555);
      });
    });
  });

  describe('when using an or throw', () => {
    let error;

    beforeEach(() => {
      error = new Error('test');
    });

    describe('when none', () => {
      it('should throw a constant error', () => {
        expect(() => Maybes.orThrow(error)(Maybe.None())).toThrow(error);
      });

      it('should throw an error returned by a function', () => {
        expect(() => Maybes.orThrow(() => error)(Maybe.None())).toThrow(error);
      });
    });

    describe('when some', () => {
      it('should return the value', () => {
        const fn = () => Maybes.orThrow(error)(Maybe.Some(true));

        expect(fn).not.toThrow();

        const result = fn();

        expect(result).toBeTruthy;
      });
    });
  });

  describe('when casting to boolean', () => {
    describe('and given a maybe', () => {
      describe('when none', () => {
        it('should return false', () => {
          expect(Maybes.toBoolean()(Maybe.None())).toBe(false);
        });
      });

      describe('when some', () => {
        it('should return true', () => {
          expect(Maybes.toBoolean()(Maybe.Some('test'))).toBeTruthy;
        });
      });
    });

    describe('and given a predicate', () => {
      describe('and the resulting function is called with a maybe', () => {
        let func;

        beforeEach(() => {
          func = Maybes.toBoolean(value => value === 'test');
        });

        describe('when some', () => {
          describe('and predicate is true', () => {
            it('should return true', () => {
              expect(func(Maybe.Some('test'))).toBeTruthy;
            });
          });

          describe('and predicate is false', () => {
            it('should return false', () => {
              expect(func(Maybe.Some('nope'))).toBe(false);
            });
          });
        });

        describe('when none', () => {
          it('should return false', () => {
            expect(func(Maybe.None())).toBe(false);
          });
        });
      });
    });
  });

  describe('when combining multiple values into a maybe', () => {
    describe('and all values exist', () => {
      it('should result in a some of an array', () => {
        const result = Maybes.combineFrom('hello', true, 2);

        expect(result.isSome()).toBeTruthy;
        expect(result.some()).toEqual(['hello', true, 2]);
      });
    });

    describe('and one value does not exist', () => {
      it('should result in a none', () => {
        expect(Maybes.combineFrom('a', null, false).isNone()).toBeTruthy;
      });
    });
  });

  describe('when determining if 2 maybes are equal', () => {
    describe('and when they are both nones', () => {
      it('should return true', () => {
        expect(Maybes.isEqual(Maybes.None(), Maybes.None())).toBeTruthy;
      });
    });

    describe('and when they are the same instance', () => {
      it('should return true', () => {
        const maybe = Maybes.Some(123);

        expect(Maybes.isEqual(maybe, maybe)).toBeTruthy;
      });
    });

    describe('and when their values are equal', () => {
      it('should return true', () => {
        expect(Maybes.isEqual(Maybes.Some(123), Maybes.Some(123))).toBeTruthy;
      });
    });

    describe('and when their values are not equal', () => {
      it('should return false', () => {
        expect(Maybes.isEqual(Maybes.Some(555), Maybes.Some(123))).toBe(false);
      });
    });

    describe('and when one is none and the other is some', () => {
      it('should return false', () => {
        expect(Maybes.isEqual(Maybes.Some(555), Maybes.None())).toBe(false);
      });
    });
  });

  describe('when using unless', () => {
    it('should filter out when the predicate is true', () => {
      expect(Maybes.unless(x => x === 'hello')(Maybes.Some('hello')).isNone()).toBeTruthy;
    });

    it('should not filter out when predicate is false', () => {
      const result = Maybes.unless(x => x === 'hello')(Maybes.Some('world'));

      expect(result.isSome()).toBeTruthy;
      expect(result.some()).toBe('world');
    });
  });

  describe('when creating a maybe from a predicate', () => {
    describe('when the condition is true', () => {
      it('should return a some', () => {
        const result = Maybes.fromPredicate(_.isString, 'test');

        expect(result.isSome()).toBeTruthy;
        expect(result.some()).toBe('test');
      });
    });

    describe('when the condition is false', () => {
      it('should return a none', () => {
        const result = Maybes.fromPredicate(_.isString, 123);

        expect(result.isNone()).toBeTruthy;
      });
    });
  });

  describe('when creating a maybe from a number', () => {
    describe('when the condition is true', () => {
      it('should return a some', () => {
        const result = Maybes.fromNumber(123);

        expect(result.isSome()).toBeTruthy;
        expect(result.some()).toBe(123);
      });
    });

    describe('when the condition is false', () => {
      it('should return a none', () => {
        expect(Maybes.fromNumber(NaN).isNone()).toBeTruthy;
        expect(Maybes.fromNumber('test').isNone()).toBeTruthy;
      });
    });
  });

  describe('when combining maybes with other maybes', () => {
    describe('when all maybes are somes', () => {
      it('should return the correct values', () => {
        const result = Maybes.combineWith(Maybes.Some(123), Maybes.Some(555))(Maybes.Some('abc'));

        expect(result.isSome()).toBeTruthy;
        expect(result.some()).toEqual(['abc', 123, 555]);
      });
    });

    describe('when all maybes are not somes', () => {
      it('should return the none', () => {
        const result = Maybes.combineWith(Maybes.Some(123), Maybes.None())(Maybes.Some('abc'));

        expect(result.isSome()).toBe(false);
      });
    });
  });
});
