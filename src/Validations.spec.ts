import 'jest';

import * as Validations from './Validations';
import { pipe } from './pipe';

describe('Validations', () => {
  describe('fromTruthy', () => {
    it('should correctly construct a Validation', () => {
      const result1 = Validations.fromTruthy('error', undefined);
      const result2 = Validations.fromTruthy('error', null);
      const result3 = Validations.fromTruthy('error', 0);
      const result4 = Validations.fromTruthy('error', 123);

      expect(result1.isFail()).toBeTruthy();
      expect(result1.fail()).toEqual('error');
      expect(result2.isFail()).toBeTruthy();
      expect(result2.fail()).toEqual('error');
      expect(result3.isFail()).toBeTruthy();
      expect(result3.fail()).toEqual('error');
      expect(result4.isSuccess()).toBeTruthy();
      expect(result4.success()).toEqual(123);
    });
  });

  describe('flatMap/successFlatMap/bind/chain', () => {
    it('should flatMap correctly', () => {
      const result1 = pipe(
        Validations.Fail('test'),
        Validations.flatMap(val => Validations.Fail(val))
      );

      const result2 = pipe(
        Validations.Success<string, string>('test'),
        Validations.flatMap(val => Validations.Fail(val))
      );

      expect(result1.isFail()).toBeTruthy();
      expect(result1.fail()).toEqual('test');
      expect(result2.isFail()).toBeTruthy();
      expect(result2.fail()).toEqual('test');
    });
  });

  describe('map/successMap', () => {
    it('should map correctly', () => {
      const result1 = pipe(
        Validations.Fail('test'),
        Validations.map(val => val + '!')
      );

      const result2 = pipe(
        Validations.Success<string, string>('test'),
        Validations.map(val => val + '!')
      );

      expect(result1.isFail()).toBeTruthy();
      expect(result1.fail()).toEqual('test');
      expect(result2.isSuccess()).toBeTruthy();
      expect(result2.success()).toEqual('test!');
    });
  });

  describe('cata', () => {
    it('should unwrap correctly', () => {
      expect(
        pipe(
          Validations.Fail('test'),
          Validations.cata(str => str.toUpperCase(), str => str + '!')
        )
      ).toEqual('TEST');

      expect(
        pipe(
          Validations.Success<string, string>('test'),
          Validations.cata(str => str.toUpperCase(), str => str + '!')
        )
      ).toEqual('test!');
    });
  });

  describe('bimap/mapBoth', () => {
    it('should map correctly', () => {
      const result1 = pipe(
        Validations.Fail('test'),
        Validations.bimap(str => str.toUpperCase(), str => str + '!')
      );

      const result2 = pipe(
        Validations.Success<string, string>('test'),
        Validations.bimap(str => str.toUpperCase(), str => str + '!')
      );

      expect(result1.isFail()).toBeTruthy();
      expect(result1.fail()).toEqual('TEST');
      expect(result2.isSuccess()).toBeTruthy();
      expect(result2.success()).toEqual('test!');
    });
  });

  describe('failMap', () => {
    it('should map correctly', () => {
      const result1 = pipe(
        Validations.Fail('test'),
        Validations.failMap(val => val + '!')
      );

      const result2 = pipe(
        Validations.Success<string, string>('test'),
        Validations.failMap(val => val + '!')
      );

      expect(result1.isFail()).toBeTruthy();
      expect(result1.fail()).toEqual('test!');
      expect(result2.isSuccess()).toBeTruthy();
      expect(result2.success()).toEqual('test');
    });
  });

  describe('isSuccess', () => {
    describe('when given a Success', () => {
      it('should return true', () => {
        expect(
          pipe(
            Validations.Success(123),
            Validations.isSuccess()
          )
        ).toBeTruthy();
      });
    });

    describe('when given a Fail', () => {
      it('should return false', () => {
        expect(
          pipe(
            Validations.Fail(123),
            Validations.isSuccess()
          )
        ).toBeFalsy();
      });
    });
  });

  describe('isFail', () => {
    describe('when given a Success', () => {
      it('should return false', () => {
        expect(
          pipe(
            Validations.Success(123),
            Validations.isFail()
          )
        ).toBeFalsy();
      });
    });

    describe('when given a Fail', () => {
      it('should return true', () => {
        expect(
          pipe(
            Validations.Fail(123),
            Validations.isFail()
          )
        ).toBeTruthy();
      });
    });
  });

  describe('success', () => {
    it('should correctly get value', () => {
      expect(
        pipe(
          Validations.Success(123),
          Validations.success()
        )
      ).toEqual(123);
    });
  });

  describe('fail', () => {
    it('should correctly get value', () => {
      expect(
        pipe(
          Validations.Fail(123),
          Validations.fail()
        )
      ).toEqual(123);
    });
  });

  describe('toEither', () => {
    describe('when given a Fail', () => {
      it('should return a Left', () => {
        const result = pipe(
          Validations.Fail(123),
          Validations.toEither()
        );

        expect(result.isLeft()).toBeTruthy();
        expect(result.left()).toEqual(123);
      });
    });

    describe('when given a Success', () => {
      it('should return a Right', () => {
        const result = pipe(
          Validations.Success(123),
          Validations.toEither()
        );

        expect(result.isRight()).toBeTruthy();
        expect(result.right()).toEqual(123);
      });
    });
  });

  describe('toMaybe', () => {
    describe('when given a Fail', () => {
      it('should return a None', () => {
        const result = pipe(
          Validations.Fail(123),
          Validations.toMaybe()
        );

        expect(result.isNone()).toBeTruthy();
      });
    });

    describe('when given a Success', () => {
      it('should return a Some', () => {
        const result = pipe(
          Validations.Success(123),
          Validations.toMaybe()
        );

        expect(result.isSome()).toBeTruthy();
        expect(result.some()).toEqual(123);
      });
    });
  });
});
