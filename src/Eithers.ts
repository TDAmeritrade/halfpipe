/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { Either, Maybe } from 'monet';

import { createInvoker } from './utils/createInvoker';

export function leftFlatMap<LA, R, LB>(fn: (val: LA) => Either<LB, R>): (either: Either<LA, R>) => Either<LB, R> {
  return either => (either.isLeft() ? fn(either.left()) : ((either as unknown) as Either<LB, R>));
}

/**
 * Invokes a function in a try/catch and catches the error. The result is
 * wrapped in an Either where the left side is the caught error.
 * This is similar to `_.attempt`.
 * @export
 * @template T
 * @template E
 * @param {() => T} fn
 * @returns {Either<E, T>}
 * @example
 * const result = Eithers.attempt(() => {
 *   throw new Error('AHHHHHH!');
 * });
 *
 * result.isLeft(); // => true
 * result.left(); // => Error
 */
export function attempt<T, E = Error>(fn: () => T): Either<E, T> {
  try {
    return Either.Right(fn());
  } catch (e) {
    return Either.Left(e);
  }
}

/**
 * Converts a nullable value to a maybe. Accepts an error factory that lazily creates the error
 * if the value is nil. If a value is provided an Either will be returned. If no value is provided
 * then a function accepting a value will be returned.
 * @export
 * @template E
 * @template T
 * @param {() => E} err
 * @param {(T | null)} value
 * @returns {Either<E, T>}
 */
export function fromNullWith<E, T>(err: () => E, value: T | null): Either<E, T>;
export function fromNullWith<E, T>(err: () => E): (value: T | null | undefined) => Either<E, T>;
export function fromNullWith<E, T>(
  err: () => E,
  value?: T | null
): ((value: T | null | undefined) => Either<E, T>) | Either<E, T> {
  const resolve = value => (value != null ? Either.Right<E, T>(value) : Either.Left<E, T>(err()));

  return arguments.length > 1 ? resolve(value) : resolve;
}

/**
 * Converts a nullable value to a maybe. If a value is provided an Either will be returned.
 * If no value is provided then a function accepting a value will be returned.
 * @export
 * @template E
 * @template T
 * @param {E} err
 * @param {(T | null)} value
 * @returns {Either<E, T>}
 */
export function fromNull<E, T>(err: E, value: T | null): Either<E, T>;
export function fromNull<E, T>(err: E): (value: T | null | undefined) => Either<E, T>;
export function fromNull<E, T>(
  err: E,
  value?: T | null
): ((value: T | null | undefined) => Either<E, T>) | Either<E, T> {
  return arguments.length > 1 ? fromNullWith(() => err, value as T) : fromNullWith(() => err);
}

/**
 * Creates a function that combines an array of Eithers into a single left value supplied by a function,
 * or an array of right values if no left value exists
 * @export
 * @template E
 * @template T
 * @param {() => E} err
 * @returns {(eithers: Either<E, T>[]) => Either<E, T[]>}
 */
export function combineWith<E, T>(err: () => E): (eithers: Either<E, T>[]) => Either<E, T[]> {
  return (eithers: Either<E, T>[]) =>
    eithers.reduce(
      (result, either) =>
        result.flatMap(list => either.cata(() => Either.Left(err()), value => Either.Right([...list, value]))),
      Either.Right<E, T[]>([])
    );
}

/**
 * Creates a function that combines an array of Eithers into a constant single left value,
 * or an array of right values if no left value exists
 * @export
 * @template E
 * @template T
 * @param {() => E} err
 * @returns {(eithers: Either<E, T>[]) => Either<E, T[]>}
 */
export function combine<E, T>(err: E): (eithers: Either<E, T>[]) => Either<E, T[]> {
  return combineWith(() => err);
}

/**
 * Creates a function that either returns the right value of a Either if it exists, or throws
 * the left value
 * @export
 * @template T
 * @param {Error|(() => Error)} valueOrFn a static error object or a function that returns the error to throw
 * @returns {(either: Either<Error, T>) => T}
 */
export function orThrow<Error, T>(): (either: Either<Error, T>) => T {
  return cata<Error, T, any>(
    error => {
      throw error;
    },
    v => v
  );
}

export function toValue<L, R>(): (either: Either<L, R>) => L | R {
  return either => (either.isLeft() ? either.left() : either.right());
}

export const cata = createInvoker<Either<any, any>, 'cata', any>('cata') as <L, R, V1, V2 = V1>(
  leftFn: (val: L) => V1,
  rightFn: (val: R) => V2
) => (either: Either<L, R>) => V1 | V2;

export const map = createInvoker<Either<any, any>, 'map', Either<any, any>>('map') as <L, RA, RB>(
  fn: (val: RA) => RB
) => (either: Either<L, RA>) => Either<L, RB>;

export const flatMap = createInvoker<Either<any, any>, 'flatMap', Either<any, any>>('flatMap') as <L, RA, RB>(
  fn: (val: RA) => Either<L, RB>
) => (either: Either<L, RA>) => Either<L, RB>;

export const leftMap = createInvoker<Either<any, any>, 'leftMap', Either<any, any>>('leftMap') as <LA, R, LB>(
  fn: (val: LA) => LB
) => (either: Either<LA, R>) => Either<LB, R>;

export const bimap = createInvoker<Either<any, any>, 'bimap', Either<any, any>>('bimap') as <LA, RA, LB, RB>(
  leftFn: (val: LA) => LB,
  rightFn: (val: RA) => RB
) => (either: Either<LA, RA>) => Either<LB, RB>;

export const isLeft = createInvoker<Either<any, any>, 'isLeft', boolean>('isLeft') as <L, R>() => (
  either: Either<L, R>
) => boolean;

export const left = createInvoker<Either<any, any>, 'left', any>('left') as <L, R>() => (either: Either<L, R>) => L;

export const isRight = createInvoker<Either<any, any>, 'isRight', boolean>('isRight') as <L, R>() => (
  either: Either<L, R>
) => boolean;

export const right = createInvoker<Either<any, any>, 'right', any>('right') as <L, R>() => (either: Either<L, R>) => R;

export const toMaybe = createInvoker<Either<any, any>, 'toMaybe', Maybe<any>>('toMaybe') as <L, R>() => (
  either: Either<L, R>
) => Maybe<R>;

export const swap = createInvoker<Either<any, any>, 'swap', Either<any, any>>('swap') as <L, R>() => (
  either: Either<L, R>
) => Either<R, L>;

export const rightMap = map;
export const rightFlatMap = flatMap;
export const flatMapBoth = cata as <L, R, L1 = L, R1 = R, L2 = L1, R2 = R1>(
  leftFn: (val: L) => Either<L1, R1>,
  rightFn: (val: R) => Either<L2, R2>
) => (either: Either<L, R>) => Either<L1, R1> | Either<L2, R2>;
export const mapBoth = bimap;
export const flip = swap;
export const Left = Either.Left;
export const Right = Either.Right;
