import 'jest';

import * as Promises from './Promises';
import { pipe } from './pipe';

describe('Promises', () => {
  describe('catch', () => {
    describe('when promise rejects', () => {
      it('should call the callback', async () => {
        const fn = jest.fn(() => Promise.resolve('done'));

        const result = await pipe(
          Promises.reject('test'),
          Promises.catch(fn)
        );

        expect(fn).toBeCalledWith('test');
        expect(result).toEqual('done');
      });
    });

    describe('when promise resolves', () => {
      it('should not call the callback', async () => {
        const fn = jest.fn(() => Promise.resolve('done'));

        const result = await pipe(
          Promises.resolve('test'),
          Promises.catch(fn)
        );

        expect(fn).toBeCalledTimes(0);
        expect(result).toEqual('test');
      });
    });
  });

  describe('then', () => {
    describe('when promise rejects', () => {
      it('should call the catch callback', async () => {
        const fn = jest.fn(() => Promise.resolve('done'));
        const catchFn = jest.fn(() => Promise.resolve('caught'));

        const result = await pipe(
          Promises.reject('test'),
          Promises.then(fn, catchFn)
        );

        expect(catchFn).toBeCalledWith('test');
        expect(result).toEqual('caught');
      });
    });

    describe('when promise resolves', () => {
      it('should call the callback', async () => {
        const fn = jest.fn(() => Promise.resolve('done'));

        const result = await pipe(
          Promises.resolve('test'),
          Promises.then(fn)
        );

        expect(fn).toBeCalledWith('test');
        expect(result).toEqual('done');
      });
    });
  });

  describe('isPromiseLike', () => {
    describe('when given a promise', () => {
      it('should return true', () => {
        expect(
          pipe(
            Promises.resolve(1),
            Promises.isPromiseLike()
          )
        ).toBeTruthy();
      });
    });

    describe('when not given a promise', () => {
      it('should return false', () => {
        expect(
          pipe(
            {},
            Promises.isPromiseLike()
          )
        ).toBeFalsy();
      });
    });
  });
});
