import 'jest';

import * as Arrays from './Arrays';
import { pipe } from './pipe';

describe('Arrays', () => {
  describe('flatMap', () => {
    it('should flat map correctly', () => {
      expect(
        pipe(
          ['hello', 'world'],
          Arrays.flatMap(str => str.split(''))
        )
      ).toEqual(['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd']);
    });
  });

  describe('flat/flatten', () => {
    it('should flatten correctly', () => {
      expect(
        pipe(
          [[1, 2], [3, 4]],
          Arrays.flat()
        )
      ).toEqual([1, 2, 3, 4]);
    });

    it('should flatten deep correctly', () => {
      expect(
        pipe(
          [[[1, 2, 3]], [[4, 5, 6]]],
          Arrays.flat(2)
        )
      ).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('reduce', () => {
    describe('when reducing with no initial value', () => {
      it('should reduce correctly', () => {
        expect(
          pipe(
            ['a', 'b', 'c'],
            Arrays.reduce((result, str) => result + str)
          )
        ).toEqual('abc');
      });
    });

    describe('when reducing with an initial value factory', () => {
      it('should reduce correctly', () => {
        expect(
          pipe(
            ['abc', 'def', 'ghi'],
            Arrays.reduce((sum, str) => sum + str.length, () => 0)
          )
        ).toEqual(9);
      });
    });
  });

  describe('reduceRight', () => {
    describe('when reducing with no initial value', () => {
      it('should reduce correctly', () => {
        expect(
          pipe(
            ['a', 'b', 'c'],
            Arrays.reduceRight((result, str) => result + str)
          )
        ).toEqual('cba');
      });
    });

    describe('when reducing with an initial value factory', () => {
      it('should reduce correctly', () => {
        expect(
          pipe(
            ['a', 'bc', 'def'],
            Arrays.reduceRight((result, str) => result - str.length, () => 10)
          )
        ).toEqual(4);
      });
    });
  });

  describe('get', () => {
    describe('when getting a value that exists', () => {
      it('should get a Some', () => {
        const result = pipe(
          [1, 2, 3],
          Arrays.get(1)
        );

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual(2);
      });
    });

    describe('when getting a value at a negative index', () => {
      it('should count from the end of the array', () => {
        const result = pipe(
          [1, 2, 3, 4, 5],
          Arrays.get(-2)
        );

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual(4);
      });
    });

    describe('when getting a value that does not exist', () => {
      it('should get a None', () => {
        const result = pipe(
          [1, 2, 3],
          Arrays.get(3)
        );

        expect(result.isSome()).toBeFalsy();
      });
    });
  });

  describe('getFirst', () => {
    describe('when the array has a first value', () => {
      it('should get a Some', () => {
        const result = pipe(
          [1, 2, 3],
          Arrays.getFirst()
        );

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual(1);
      });
    });

    describe('when the array is empty', () => {
      it('should get a None', () => {
        const result = pipe(
          [],
          Arrays.getFirst()
        );

        expect(result.isSome()).toBeFalsy();
      });
    });
  });

  describe('getLast', () => {
    describe('when the array has a last value', () => {
      it('should get a Some', () => {
        const result = pipe(
          [1, 2, 3],
          Arrays.getLast()
        );

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual(3);
      });
    });

    describe('when the array is empty', () => {
      it('should get a None', () => {
        const result = pipe(
          [],
          Arrays.getLast()
        );

        expect(result.isSome()).toBeFalsy();
      });
    });
  });

  describe('size', () => {
    it('should get the size of the array', () => {
      expect(
        pipe(
          [1, 2, 3, 4, 5],
          Arrays.size()
        )
      ).toEqual(5);
    });
  });

  describe('find', () => {
    describe('and there is an element matching', () => {
      it('should get a Some', () => {
        const result = pipe(
          [1, 3, 4, 5],
          Arrays.find(num => num % 2 === 0)
        );

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual(4);
      });
    });

    describe('and there is not an element matching', () => {
      it('should get a Some', () => {
        const result = pipe(
          [1, 3, 5, 7],
          Arrays.find(num => num % 2 === 0)
        );

        expect(result.isSome()).toBeFalsy();
      });
    });
  });

  describe('reverse', () => {
    it('should immutably reverse the array', () => {
      const arr = [1, 2, 3];

      expect(
        pipe(
          arr,
          Arrays.reverse()
        )
      ).toEqual([3, 2, 1]);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('sort', () => {
    describe('without a sorting function', () => {
      it('should immutably sort the array', () => {
        const arr = [2, 3, 1];

        expect(
          pipe(
            arr,
            Arrays.sort()
          )
        ).toEqual([1, 2, 3]);

        expect(arr).toEqual([2, 3, 1]);
      });
    });

    describe('with a sorting function', () => {
      it('should immutably sort the array', () => {
        const arr = [2, 3, 1];

        expect(
          pipe(
            arr,
            Arrays.sort((a, b) => b - a)
          )
        ).toEqual([3, 2, 1]);

        expect(arr).toEqual([2, 3, 1]);
      });
    });
  });

  describe('map', () => {
    it('should map correctly', () => {
      expect(
        pipe(
          ['a', 'bc', 'def'],
          Arrays.map(str => str.length)
        )
      ).toEqual([1, 2, 3]);
    });
  });

  describe('filter', () => {
    it('should filter correctly', () => {
      expect(
        pipe(
          [1, 2, 3, 4, 5, 6],
          Arrays.filter(num => num % 2 === 0)
        )
      ).toEqual([2, 4, 6]);
    });
  });

  describe('some', () => {
    describe('and some element passes the predicate', () => {
      it('should return true', () => {
        expect(
          pipe(
            [1, 2, 3, 4, 5],
            Arrays.some(num => num % 3 === 0)
          )
        ).toBeTruthy();
      });
    });

    describe('and no element passes the predicate', () => {
      it('should return false', () => {
        expect(
          pipe(
            [1, 2, 4, 5],
            Arrays.some(num => num % 3 === 0)
          )
        ).toBeFalsy();
      });
    });
  });

  describe('every', () => {
    describe('and every element passes the predicate', () => {
      it('should return true', () => {
        expect(
          pipe(
            [1, 2, 3, 4, 5],
            Arrays.every(num => num > 0)
          )
        ).toBeTruthy();
      });
    });

    describe('and some element fails the predicate', () => {
      it('should return false', () => {
        expect(
          pipe(
            [1, 2, 4, 3, 5],
            Arrays.every(num => num < 5)
          )
        ).toBeFalsy();
      });
    });
  });

  describe('forEach', () => {
    it('should call the callback for each element', () => {
      const cb = jest.fn();
      const arr = ['a', 'b', 'c'];

      pipe(
        arr,
        Arrays.forEach(cb)
      );

      expect(cb).toBeCalledTimes(3);
      expect(cb).toBeCalledWith('a', 0, arr);
      expect(cb).toBeCalledWith('b', 1, arr);
      expect(cb).toBeCalledWith('c', 2, arr);
    });
  });

  describe('concat', () => {
    it('should concatenate the arrays', () => {
      expect(
        pipe(
          [1, 2, 3],
          Arrays.concat([4, 5], [6, 7])
        )
      ).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('join', () => {
    it('should join the array', () => {
      expect(
        pipe(
          ['a', 'b', 'c'],
          Arrays.join()
        )
      ).toEqual('a,b,c');

      expect(
        pipe(
          ['a', 'b', 'c'],
          Arrays.join(' ')
        )
      ).toEqual('a b c');
    });
  });

  describe('isArray', () => {
    describe('when is an array', () => {
      it('should return true', () => {
        expect(
          pipe(
            [],
            Arrays.isArray()
          )
        ).toBeTruthy();
      });
    });

    describe('when not an array', () => {
      it('should return false', () => {
        expect(
          pipe(
            'asdf',
            Arrays.isArray()
          )
        ).toBeFalsy();
      });
    });
  });
});
