/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { Either, Maybe } from 'monet';

import { createInvoker } from './utils/createInvoker';

/**
 * Invokes a function in a try/catch and catches the error. The result is
 * wrapped in an Either where the left side is the caught error.
 * @param fn - the function to execute
 * @returns a Right of the resulting value or a Left of the thrown error
 * ```typescript
 * Eithers.attempt(() => 5); // -> Right(5)
 * Eithers.attempt(() => { throw new Error(); }); // -> Left(Error)
 * ```
 */
export function attempt<T, E = Error>(fn: () => T): Either<E, T> {
  try {
    return Either.Right(fn());
  } catch (e) {
    return Either.Left(e);
  }
}

/**
 * Converts a potentially nullable value into an Either.
 * @param err - the left side to use if the value is null
 * @param value - the right side to use if the value is not null
 * @returns a Left if the value is null, a Right if the value is not null
 * ```typescript
 * Eithers.fromNull(new Error(), null); // -> Left(Error)
 * Eithers.fromNull(new Error(), 5); // -> Right(5)
 * ```
 */
export function fromNull<E, T>(err: E, value: T | null | undefined): Either<E, T> {
  return value == null ? Either.Left(err) : Either.Right(value);
}

/**
 * Reduces a list of Eithers into a Right value of a list if all are Right, or a single
 * Left value with the error if any is Left.
 * @param err - the value of the Left to use if any Either is a Left
 * @returns a Left if any Either is a Left, a Right containing an array of all of the Either values if all are Rights.
 * ```typescript
 * pipe(
 *   [Eithers.Right(10), Eithers.Right(5)],
 *   Eithers.combine(new Error()) // -> Right([10, 5])
 * );
 *
 * pipe(
 *   [Eithers.Right(5), Eithers.Left('no'), Eithers.Right(4)],
 *   Eithers.combine(new Error()) // -> Left(Error)
 * );
 * ```
 */
export function combine<E, T>(err: E): (eithers: Either<E, T>[]) => Either<E, T[]> {
  return eithers => {
    let result: any[] = [];

    for (const either of eithers) {
      if (either.isLeft()) {
        return Either.Left(err);
      }

      result.push(either.right());
    }

    return Either.Right(result);
  };
}

/**
 * Returns the value of the right side of the Either if it exists, or throws the left side.
 * @returns the value if given a Right
 * @throws the value if given a Left
 * ```typescript
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.orThrow() // -> 5
 * );
 *
 * pipe(
 *   Eithers.Left(new Error()),
 *   Eithers.orThrow() // throws: Error
 * );
 * ```
 */
export function orThrow<Error, T>(noArg?: never): (either: Either<Error, T>) => T {
  return cata<Error, T, any>(
    error => {
      throw error;
    },
    v => v
  );
}

/**
 * Gets the value of the Either.
 * @returns the value of whichever side exists
 * ```typescript
 * pipe(
 *   Eithers.Left(5),
 *   Eithers.toValue() // -> 5
 * );
 *
 * pipe(
 *   Eithers.Right(2),
 *   Eithers.toValue() // -> 2
 * );
 * ```
 */
export function toValue<L, R>(noArg?: never): (either: Either<L, R>) => L | R {
  return either => (either.isLeft() ? either.left() : either.right());
}

/**
 * Performs a catamorphism on the Either.
 * @param leftFn - the function to unwrap the left side
 * @param rightFn - the function to unwrap the right side
 * @returns the result of unwrapping the Either
 * ```typescript
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.cata(
 *     leftVal => leftVal - 2,
 *     rightVal => rightVal + 2  // -> 7
 *   )
 * );
 * ```
 */
export const cata = createInvoker<Either<any, any>, 'cata', any>('cata') as <L, R, V1, V2 = V1>(
  leftFn: (val: L) => V1,
  rightFn: (val: R) => V2
) => (either: Either<L, R>) => V1 | V2;

/**
 * Performs a map on the right side of the Either with the given mapper function.
 * @alias rightMap
 * @param fn - the mapper function
 * @returns an unchanged Left or a mapped Right
 * ```typescript
 * pipe(
 *   Eithers.Right('test'),
 *   Eithers.map(str => str.length) // -> Right(4)
 * );
 * ```
 */
export const map = createInvoker<Either<any, any>, 'map', Either<any, any>>('map') as <L, RA, RB>(
  fn: (val: RA) => RB
) => (either: Either<L, RA>) => Either<L, RB>;

/**
 * Performs a flatMap on the right side of the Either with the given mapper function that returns a new Either.
 * @alias rightFlatMap
 * @param fn - the mapper function
 * @returns an unchanged Left or a flatMapped Right
 * ```typescript
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.flatMap(val => Either.Left(val)) // -> Left(5)
 * );
 * ```
 */
export const flatMap = createInvoker<Either<any, any>, 'flatMap', Either<any, any>>('flatMap') as <L, RA, RB>(
  fn: (val: RA) => Either<L, RB>
) => (either: Either<L, RA>) => Either<L, RB>;

/**
 * Performs a map on the left side of the Either with the given mapper function.
 * @param fn - the mapper function
 * @returns an unchanged Right or a mapped Left
 * ```typescript
 * pipe(
 *   Eithers.Left('test'),
 *   Eithers.leftMap(str => str.length) // -> Left(4)
 * );
 * ```
 */
export const leftMap = createInvoker<Either<any, any>, 'leftMap', Either<any, any>>('leftMap') as <LA, R, LB>(
  fn: (val: LA) => LB
) => (either: Either<LA, R>) => Either<LB, R>;

/**
 * Performs a flatMap on the left side of the Either with the given mapper function that returns a new Either.
 * @param fn - the mapper function
 * @returns an unchanged Right or a flatMapped Left
 * ```typescript
 * pipe(
 *   Eithers.Left(5),
 *   Eithers.flatMap(val => Either.Right(val)) // -> Right(5)
 * );
 * ```
 */
export function leftFlatMap<LA, R, LB>(fn: (val: LA) => Either<LB, R>): (either: Either<LA, R>) => Either<LB, R> {
  return either => (either.isLeft() ? fn(either.left()) : ((either as unknown) as Either<LB, R>));
}

/**
 * Performs a map on both sides of an Either with the given mapper functions.
 * @alias mapBoth
 * @param leftFn - the mapper function for the left side
 * @param rightFn - the mapper function for the right side
 * @returns a Left mapped with the left mapper or a Right mapped with the right mapper
 * ```typescript
 * pipe(
 *   Eithers.Left('test'),
 *   Eithers.bimap(
 *     str => str.length, // -> Left(4)
 *     num => num + 2
 *   )
 * );
 *
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.bimap(
 *     str => str.length,
 *     num => num + 2 // -> Right(7)
 *   )
 * );
 * ```
 */
export const bimap = createInvoker<Either<any, any>, 'bimap', Either<any, any>>('bimap') as <LA, RA, LB, RB>(
  leftFn: (val: LA) => LB,
  rightFn: (val: RA) => RB
) => (either: Either<LA, RA>) => Either<LB, RB>;

/**
 * Checks whether or not the given Either is a Left.
 * @returns true if Either is a Left, false if a Right
 * ```typescript
 * pipe(
 *   Eithers.Left(new Error()),
 *   Eithers.isLeft() // -> true
 * );
 * ```
 */
export const isLeft = createInvoker<Either<any, any>, 'isLeft', boolean>('isLeft') as <L, R>(
  noArg?: never
) => (either: Either<L, R>) => boolean;

/**
 * Unwraps the left value if it exists.
 * @returns the left value
 * ```typescript
 * pipe(
 *   Eithers.Left(5),
 *   Eithers.left() // -> 5
 * );
 * ```
 */
export const left = createInvoker<Either<any, any>, 'left', any>('left') as <L, R>(
  noArg?: never
) => (either: Either<L, R>) => L;

/**
 * Checks whether or not the given Either is a Right.
 * @returns true if Either is a Right, false if a Left
 * ```typescript
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.isRight() // -> true
 * );
 * ```
 */
export const isRight = createInvoker<Either<any, any>, 'isRight', boolean>('isRight') as <L, R>(
  noArg?: never
) => (either: Either<L, R>) => boolean;

/**
 * Unwraps the right value if it exists.
 * @returns the right value
 * ```typescript
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.right() // -> 5
 * );
 * ```
 */
export const right = createInvoker<Either<any, any>, 'right', any>('right') as <L, R>(
  noArg?: never
) => (either: Either<L, R>) => R;

/**
 * Converts an Either into a Maybe by dropping the Left side and converting into a None.
 * @returns a Some if the Either was a Right, or a None if the Either was a Left
 * ```typescript
 * pipe(
 *   Eithers.Left(new Error()),
 *   Eithers.toMaybe() // -> None
 * );
 *
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.toMaybe() // -> Some(5)
 * );
 * ```
 */
export const toMaybe = createInvoker<Either<any, any>, 'toMaybe', Maybe<any>>('toMaybe') as <L, R>(
  noArg?: never
) => (either: Either<L, R>) => Maybe<R>;

/**
 * Swaps the sides of an Either.
 * @alias flip
 * @returns a Right if the Either was a Left and a Left if the Either was a Right
 * ```typescript
 * pipe(
 *   Eithers.Left(new Error()),
 *   Eithers.swap() // -> Right(Error)
 * );
 *
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.swap() // -> Left(5)
 * );
 * ```
 */
export const swap = createInvoker<Either<any, any>, 'swap', Either<any, any>>('swap') as <L, R>(
  noArg?: never
) => (either: Either<L, R>) => Either<R, L>;

/**
 * Performs a flatMap on both sides of an Either.
 * @returns the flatMapped Either
 * ```typescript
 * pipe(
 *   Eithers.Left(new Error('test')),
 *   Eithers.flatMapBoth(
 *     err => Eithers.Right(err.message), // -> Right(test)
 *     num => Eithers.Right(num.toString())
 *   )
 * );
 *
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.flatMapBoth(
 *     err => Eithers.Right(err.message),
 *     num => Eithers.Right(num.toString()) // -> Right('5')
 *   )
 * );
 * ```
 */
export const flatMapBoth = cata as <L, R, L1 = L, R1 = R, L2 = L1, R2 = R1>(
  leftFn: (val: L) => Either<L1, R1>,
  rightFn: (val: R) => Either<L2, R2>
) => (either: Either<L, R>) => Either<L1, R1> | Either<L2, R2>;

/**
 * Performs a map on the right side of the Either with the given mapper function.
 * @alias map
 * @param fn - the mapper function
 * @returns an unchanged Left or a mapped Right
 * ```typescript
 * pipe(
 *   Eithers.Right('test'),
 *   Eithers.rightMap(str => str.length) // -> Right(4)
 * );
 * ```
 */
export const rightMap = map;

/**
 * Performs a flatMap on the right side of the Either with the given mapper function that returns a new Either.
 * @alias flatMap
 * @param fn - the mapper function
 * @returns an unchanged Left or a flatMapped Right
 * ```typescript
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.rightFlatMap(val => Either.Left(val)) // -> Left(5)
 * );
 * ```
 */
export const rightFlatMap = flatMap;

/**
 * Performs a map on both sides of an Either with the given mapper functions.
 * @alias bimap
 * @param leftFn - the mapper function for the left side
 * @param rightFn - the mapper function for the right side
 * @returns a Left mapped with the left mapper or a Right mapped with the right mapper
 * ```typescript
 * pipe(
 *   Eithers.Left('test'),
 *   Eithers.mapBoth(
 *     str => str.length, // -> Left(4)
 *     num => num + 2
 *   )
 * );
 *
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.mapBoth(
 *     str => str.length,
 *     num => num + 2 // -> Right(7)
 *   )
 * );
 * ```
 */
export const mapBoth = bimap;

/**
 * Flips the sides of an Either.
 * @alias swap
 * @returns a Right if the Either was a Left and a Left if the Either was a Right
 * ```typescript
 * pipe(
 *   Eithers.Left(new Error()),
 *   Eithers.flip() // -> Right(Error)
 * );
 *
 * pipe(
 *   Eithers.Right(5),
 *   Eithers.flip() // -> Left(5)
 * );
 * ```
 */
export const flip = swap;

/**
 * Creates a Left with the given value.
 * @param val - the value to use as the Left side
 * @returns a Left of the given value
 */
export const Left = Either.Left as <L, R>(val: L) => Either<L, R>;

/**
 * Creates a Right with the given value.
 * @param val - the value to use as the Right side
 * @returns a Right of the given value
 */
export const Right = Either.Right as <L, R>(val: R) => Either<L, R>;
