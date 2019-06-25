/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { Either, Maybe, Validation, IValidationAcc, ISuccessStatic, IFailStatic } from 'monet';

import { createInvoker } from './utils/createInvoker';

/**
 * Creates a Validation from a possibly falsy value.
 * @param err - the default value of the Fail
 * @param value - the potentially falsy value of the Success
 * @returns a Success if the value was truthy, a Fail otherwise
 * ```typescript
 * Validations.fromTruthy(new Error(), null); // -> Fail(Error)
 * Validations.fromTruthy(new Error(), 'test'); // -> Success('test')
 * ```
 */
export function fromTruthy<E, T = any>(err: E, value: T | null | undefined): Validation<E, NonNullable<T>> {
  return value ? Validation.Success<E, NonNullable<T>>(value!) : Validation.Fail<E, NonNullable<T>>(err);
}

/**
 * Flat maps a Success to a new Validation.
 * @alias successFlatMap
 * @alias bind
 * @alias chain
 * @param fn - the mapper function
 * @returns the flat mapped Validation
 * ```typescript
 * pipe(
 *   Validations.Success('test'),
 *   Validations.flatMap(str => Validations.Fail(new Error(str))) // -> Fail(Error)
 * );
 * ```
 */
export const flatMap = createInvoker('flatMap') as <E, T, V>(
  fn: (a: T) => Validation<E, V>
) => (val: Validation<E, T>) => Validation<E, V>;

/**
 * Maps a Success using a mapper function.
 * @alias successMap
 * @param fn - the mapper function
 * @returns the mapped Success, or an unchanged Fail
 * ```typescript
 * pipe(
 *   Validations.Success(2),
 *   Validations.map(num => num * 3) // -> Success(6)
 * );
 * ```
 */
export const map = createInvoker('map') as <E, T, V>(fn: (a: T) => V) => (val: Validation<E, T>) => Validation<E, V>;

/**
 * Performs a catamorphism on a Validation.
 * @param fail - the function to unwrap a Fail
 * @param success - the function to unwrap a Success
 * @returns the result of the catamorphism
 * ```typescript
 * pipe(
 *   Validations.Fail('fail'),
 *   Validations.cata(
 *     str => str + '!', // -> 'fail!'
 *     num => num.toString()
 *   )
 * );
 *
 * pipe(
 *   Validations.Success(5),
 *   Validations.cata(
 *     str => str + '!',
 *     num => num.toString() // -> '5'
 *   )
 * );
 * ```
 */
export const cata = createInvoker('cata') as <E, T, V>(
  fail: (a: E) => V,
  success: (b: T) => V
) => (val: Validation<E, T>) => V;

/**
 * Maps both sides of a Validation.
 * @alias mapBoth
 * @param fail - the mapper for a Fail
 * @param success - the mapper for a Success
 * @returns a mapped Validation
 * ```typescript
 * pipe(
 *   Validations.Fail('fail'),
 *   Validations.bimap(
 *     str => str + '!', // -> Fail('fail!')
 *     num => num.toString()
 *   )
 * );
 *
 * pipe(
 *   Validations.Success(5),
 *   Validations.bimap(
 *     str => str + '!',
 *     num => num.toString() // -> Success('5')
 *   )
 * );
 * ```
 */
export const bimap = createInvoker('bimap') as <E, T, A, B>(
  fail: (a: E) => A,
  success: (b: T) => B
) => (val: Validation<E, T>) => Validation<A, B>;

/**
 * Maps a Fail using a mapper function.
 * @param fn - the mapper function
 * @returns a mapped Fail or an unchanged Success
 * ```typescript
 * pipe(
 *   Validations.Fail(2),
 *   Validations.failMap(num => num * 3) // -> Fail(6)
 * );
 * ```
 */
export const failMap = createInvoker('failMap') as <E, T, V>(
  fn: (a: E) => V
) => (val: Validation<E, T>) => Validation<V, T>;

/**
 * Checks whether a Validation is a Success.
 * @returns true if the Validation is a Success
 * ```typescript
 * pipe(
 *   Validations.Success(2),
 *   Validations.isSuccess() // -> true
 * );
 * ```
 */
export const isSuccess = createInvoker<Validation<any, any>, 'isSuccess', any>('isSuccess') as <E, T>(
  noArg?: never
) => (val: Validation<E, T>) => boolean;

/**
 * Checks whether a Validation is a Fail.
 * @returns true if the Validation is a Fail
 * ```typescript
 * pipe(
 *   Validations.Success(2),
 *   Validations.isSuccess() // -> true
 * );
 * ```
 */
export const isFail = createInvoker<Validation<any, any>, 'isFail', any>('isFail') as <E, T>(
  noArg?: never
) => (val: Validation<E, T>) => boolean;

/**
 * Gets the Fail value.
 * @returns the value of a Fail.
 * ```typescript
 * pipe(
 *   Validations.Fail('test'),
 *   Validations.fail() // -> 'test'
 * );
 * ```
 */
export const fail = createInvoker<Validation<any, any>, 'fail', any>('fail') as <E, T>(
  noArg?: never
) => (val: Validation<E, T>) => E;

/**
 * Gets the Success value.
 * @returns the value of a Success.
 * ```typescript
 * pipe(
 *   Validations.Success('test'),
 *   Validations.success() // -> 'test'
 * );
 * ```
 */
export const success = createInvoker<Validation<any, any>, 'success', any>('success') as <E, T>(
  noArg?: never
) => (val: Validation<E, T>) => T;

/**
 * Converts a Validation into an Either.
 * @returns a Left is given a Fail, a Right if given a Success
 * ```typescript
 * pipe(
 *   Validations.Success('test'),
 *   Validations.toEither() // -> Right('test')
 * );
 * ```
 */
export const toEither = createInvoker<Validation<any, any>, 'toEither', any>('toEither') as <E, T>(
  noArg?: never
) => (val: Validation<E, T>) => Either<E, T>;

/**
 * Converts a Validation into a Maybe.
 * @returns a Some if given a Success, a None otherwise
 * ```typescript
 * pipe(
 *   Validations.Success('test'),
 *   Validations.toMaybe() // -> Some('test')
 * );
 * ```
 */
export const toMaybe = createInvoker<Validation<any, any>, 'toMaybe', any>('toMaybe') as <E, T>(
  noArg?: never
) => (val: Validation<E, T>) => Maybe<T>;

/**
 * Performs an acc on a Validation see {@link https://github.com/monet/monet.js/blob/master/docs/VALIDATION.md}
 */
export const acc = createInvoker<Validation<any, any>, 'acc', any>('acc') as <E, T>(
  noArg?: never
) => (val: Validation<E, T>) => Validation<E, IValidationAcc>;

/**
 * Performs an ap on a Validation see {@link https://github.com/monet/monet.js/blob/master/docs/VALIDATION.md}
 */
export const ap = createInvoker<Validation<any, any>, 'ap', any>('ap') as <E, T, V>(
  eitherFn: Validation<E, (val: T) => V>
) => (validation: Validation<E, T>) => Validation<E, V>;

/**
 * Flat maps a Success to a new Validation.
 * @alias successFlatMap
 * @alias flatMap
 * @alias chain
 * @param fn - the mapper function
 * @returns the flat mapped Validation
 * ```typescript
 * pipe(
 *   Validations.Success('test'),
 *   Validations.bind(str => Validations.Fail(new Error(str))) // -> Fail(Error)
 * );
 * ```
 */
export const bind = flatMap;

/**
 * Flat maps a Success to a new Validation.
 * @alias successFlatMap
 * @alias bind
 * @alias flatMap
 * @param fn - the mapper function
 * @returns the flat mapped Validation
 * ```typescript
 * pipe(
 *   Validations.Success('test'),
 *   Validations.chain(str => Validations.Fail(new Error(str))) // -> Fail(Error)
 * );
 * ```
 */
export const chain = flatMap;

/**
 * Flat maps a Success to a new Validation.
 * @alias flatMap
 * @alias bind
 * @alias chain
 * @param fn - the mapper function
 * @returns the flat mapped Validation
 * ```typescript
 * pipe(
 *   Validations.Success('test'),
 *   Validations.successFlatMap(str => Validations.Fail(new Error(str))) // -> Fail(Error)
 * );
 * ```
 */
export const successFlatMap = flatMap;

/**
 * Creates a Success Validation.
 */
export const Success = Validation.Success as ISuccessStatic;

/**
 * Creates a Fail Validation.
 */
export const Fail = Validation.Fail as IFailStatic;

/**
 * Maps a Success using a mapper function.
 * @alias map
 * @param fn - the mapper function
 * @returns the mapped Success, or an unchanged Fail
 * ```typescript
 * pipe(
 *   Validations.Success(2),
 *   Validations.successMap(num => num * 3) // -> Success(6)
 * );
 * ```
 */
export const successMap = map;

/**
 * Maps both sides of a Validation.
 * @alias bimap
 * @param fail - the mapper for a Fail
 * @param success - the mapper for a Success
 * @returns a mapped Validation
 * ```typescript
 * pipe(
 *   Validations.Fail('fail'),
 *   Validations.mapBoth(
 *     str => str + '!', // -> Fail('fail!')
 *     num => num.toString()
 *   )
 * );
 *
 * pipe(
 *   Validations.Success(5),
 *   Validations.mapBoth(
 *     str => str + '!',
 *     num => num.toString() // -> Success('5')
 *   )
 * );
 * ```
 */
export const mapBoth = bimap;
