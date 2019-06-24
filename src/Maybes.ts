/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { Maybe, Either } from 'monet';
import { isFunction, partial, eq, negate, isEqual as _isEqual } from 'lodash';

import { createInvoker } from './utils/createInvoker';

export function combine<A>(a: Maybe<A>): Maybe<[A]>;
export function combine<A, B>(a: Maybe<A>, b: Maybe<B>): Maybe<[A, B]>;
export function combine<A, B, C>(a: Maybe<A>, b: Maybe<B>, c: Maybe<C>): Maybe<[A, B, C]>;
export function combine<A, B, C, D>(a: Maybe<A>, b: Maybe<B>, c: Maybe<C>, d: Maybe<D>): Maybe<[A, B, C, D]>;
export function combine<A, B, C, D, E>(
  a: Maybe<A>,
  b: Maybe<B>,
  c: Maybe<C>,
  d: Maybe<D>,
  e: Maybe<E>
): Maybe<[A, B, C, D, E]>;
export function combine<A, B, C, D, E, F>(
  a: Maybe<A>,
  b: Maybe<B>,
  c: Maybe<C>,
  d: Maybe<D>,
  e: Maybe<E>,
  f: Maybe<F>
): Maybe<[A, B, C, D, E, F]>;
export function combine<A, B, C, D, E, F, G>(
  a: Maybe<A>,
  b: Maybe<B>,
  c: Maybe<C>,
  d: Maybe<D>,
  e: Maybe<E>,
  f: Maybe<F>,
  g: Maybe<G>
): Maybe<[A, B, C, D, E, F, G]>;
export function combine<A, B, C, D, E, F, G, H>(
  a: Maybe<A>,
  b: Maybe<B>,
  c: Maybe<C>,
  d: Maybe<D>,
  e: Maybe<E>,
  f: Maybe<F>,
  g: Maybe<G>,
  h: Maybe<H>
): Maybe<[A, B, C, D, E, F, G, H]>;
export function combine<A, B, C, D, E, F, G, H, I>(
  a: Maybe<A>,
  b: Maybe<B>,
  c: Maybe<C>,
  d: Maybe<D>,
  e: Maybe<E>,
  f: Maybe<F>,
  g: Maybe<G>,
  h: Maybe<H>,
  i: Maybe<I>
): Maybe<[A, B, C, D, E, F, G, H, I]>;
export function combine(...maybes: Maybe<any>[]): Maybe<any[]>;
/**
 * Combines any number of Maybes into a single Maybe.
 * @param ...maybes - any number of Maybes to combine
 * @returns a Some containing an array of all Some values, or a None if any Maybe was a None
 * ```typescript
 * Maybes.combine(Maybes.Some(4), Maybes.Some('a'), Maybes.Some(false)); // -> Some([4, 'a', false])
 * Maybes.combine(Maybes.Some(true), Maybes.None(), Maybes.Some('a')); // -> None
 * ```
 */
export function combine(...maybes: Maybe<any>[]): Maybe<any[]> {
  let result: any[] = [];

  for (const maybe of maybes) {
    if (maybe.isNone()) {
      return Maybe.None();
    }

    result.push(maybe.some());
  }

  return Maybe.Some(result);
}

export function combineFrom<T1, T2, T3, T4, T5>(
  value1: T1,
  value2: T2,
  value3: T3,
  value4: T4,
  value5: T5
): Maybe<[T1, T2, T3, T4, T5]>;
export function combineFrom<T1, T2, T3, T4>(value1: T1, value2: T2, value3: T3, value4: T4): Maybe<[T1, T2, T3, T4]>;
export function combineFrom<T1, T2, T3>(value1: T1, value2: T2, value3: T3): Maybe<[T1, T2, T3]>;
export function combineFrom<T1, T2>(value1: T1, value2: T2): Maybe<[T1, T2]>;
export function combineFrom<T>(value: T): Maybe<[T]>;
export function combineFrom(): Maybe<any>;
export function combineFrom(...values: any[]): Maybe<any[]>;
/**
 * Combines any number of nullable values into a single Maybe.
 * @alias fromNulls
 * @param ...values - any number of nullable values
 * @returns a Some of an array of all the values, or a None if any value was null
 * ```typescript
 * Maybes.combineFrom('a', 2, []); // -> Some(['a', 2, []])
 * Maybes.combineFrom('a', null, 2); // -> None
 * ```
 */
export function combineFrom(...values: any[]): Maybe<any[]> {
  return combine(...values.map(Maybe.fromNull));
}

/**
 * Executes a function if the given Maybe is a Some.
 * @alias ifPresent
 * @param fn - the function to execute
 * @returns the original Maybe
 * ```typescript
 * pipe(
 *   Maybes.Some(5),
 *   Maybes.tap(num => console.log(num)) // logs: 5
 * );
 * ```
 */
export function tap<T>(fn: (val: T) => void): (maybe: Maybe<T>) => Maybe<T> {
  return maybe => {
    if (maybe.isSome()) {
      fn(maybe.some());
    }

    return maybe;
  };
}

/**
 * Throws an error if the Maybe is a None
 * @param error - the error (or a function resolving to an error) to throw
 * @returns the value of the Some, else throws the error provided
 * ```typescript
 * pipe(
 *   Maybes.Some(5),
 *   Maybes.orThrow(new Error()) // -> 5
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.orThrow(new Error()) // throws: Error
 * );
 * ```
 */
export function orThrow<T, E extends Error>(error: E | (() => E)): (maybe: Maybe<T>) => T {
  const err = isFunction(error) ? error : () => error;

  return maybe => {
    if (maybe.isNone()) {
      throw err();
    }

    return maybe.some();
  };
}

/**
 * Converts a Maybe into a boolean with an optional mapper function.
 * @param fn - an optional mapper function
 * @returns true if the Maybe is a Some and the optional mapper function returns true, otherwise false
 * ```typescript
 * pipe(
 *   Maybes.Some('a'),
 *   Maybes.toBoolean(str => str === 'a') // -> true
 * );
 *
 * pipe(
 *   Maybes.Some('b'),
 *   Maybes.toBoolean(str => str === 'a') // -> false
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.toBoolean() // -> false
 * );
 * ```
 */
export function toBoolean<T>(fn?: (val: T) => boolean): (maybe: Maybe<T>) => boolean {
  return maybe => (fn ? maybe.filter(fn).isSome() : maybe.isSome());
}

/**
 * Gets the value of a Maybe with a function that resolves the default value.
 * @alias defaultWith
 * @param elseFn - the function to resolve a default value
 * @returns the value of a Some, or the result of the elseFn if given a None
 * ```typescript
 * pipe(
 *   Maybes.Some(5),
 *   Maybes.orSomeWith(() => 3) // -> 5
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.orSomeWith(() => 3) // -> 3
 * );
 * ```
 */
export function orSomeWith<T, R = T>(elseFn: () => R): (maybe: Maybe<T>) => T | R {
  return maybe => (maybe.isNone() ? elseFn() : maybe.some());
}

/**
 * Gets a new Maybe from a function that resolves to a default Maybe.
 * @param elseFn - the function to resolve a default Maybe
 * @returns the original Maybe if it was a Some, or the default Maybe if it was a None
 * ```typescript
 * pipe(
 *   Maybes.Some(4),
 *   Maybes.orElseWith(() => Maybes.Some(3)) // -> Some(4)
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.orElseWith(() => Maybes.Some(3)) // -> Some(3)
 * );
 * ```
 */
export function orElseWith<T, R = T>(elseFn: () => Maybe<R>): (maybe: Maybe<T>) => Maybe<T | R> {
  return maybe => (maybe.isNone() ? elseFn() : maybe);
}

/**
 * Gets a new Maybe from a function that resolves to a nullable value.
 * @param elseFn - the function to resolve a nullable value
 * @returns the original Maybe if it was a Some, otherwise a new Maybe generated from the value of function provided
 * ```typescript
 * pipe(
 *   Maybes.Some(4),
 *   Maybes.orElseFrom(() => 3) // -> Some(4)
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.orElseFrom(() => 5) // -> Some(5)
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.orElseFrom(() => null) // -> None
 * );
 * ```
 */
export function orElseFrom<T>(elseFn: () => T): (maybe: Maybe<T>) => Maybe<T> {
  return orElseWith(() => Maybe.fromNull(elseFn()));
}

/**
 * Maps a Some to a new Maybe using a mapper function.
 * @alias flatMapFrom
 * @param mapper - a function to map a Some value into a new nullable value
 * @returns a Some if the result of the mapper is not null and the original Maybe was a Some, otherwise a None
 * ```typescript
 * pipe(
 *   Maybes.Some(4),
 *   Maybes.map(num => num + 2) // -> Some(6)
 * );
 * ```
 */
export function map<T, U>(mapper: (value: T) => U | null | undefined): (maybe: Maybe<T>) => Maybe<NonNullable<U>> {
  return flatMap(value => fromNull(mapper(value)));
}

/**
 * Performs a catamorphism on a Maybe.
 * @param noneFn - the function to unwrap a None
 * @param someFn - the function to unwrap a Some
 * @returns the result of unwrapping the Maybe
 * ```typescript
 * pipe(
 *   Maybes.Some(3),
 *   Maybes.cata(
 *     () => 2,
 *     num => num * 2 // -> 6
 *   )
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.cata(
 *     () => 2, // -> 2
 *     num => num * 2
 *   )
 * );
 * ```
 */
export const cata = createInvoker<Maybe<any>, 'cata', any>('cata') as <T, R1, R2 = R1>(
  noneFn: () => R1,
  someFn: (val: T) => R2
) => (maybe: Maybe<T>) => R1 | R2;

/**
 * Filters a Some value with a predicate function.
 * @param predicate - the predicate function
 * @returns a Some if the predicate returns true and the original Maybe was a Some, otherwise a None
 * ```typescript
 * pipe(
 *   Maybes.Some('test'),
 *   Maybes.filter(str => str.length < 4) // -> None
 * );
 * ```
 */
export const filter = createInvoker<Maybe<any>, 'filter', Maybe<any>>('filter') as <T>(
  predicate: (val: T) => boolean
) => (maybe: Maybe<T>) => Maybe<T>;

/**
 * Filters a Some value when the given predicate function returns false.
 * @param predicate - the negated predicate to use to filter
 * @returns a Some if the predicate returns true and the original Maybe was a Some, otherwise a None
 * ```typescript
 * pipe(
 *   Maybes.Some('abc'),
 *   Maybes.unless(str => str.length < 3) // -> Some('abc')
 * );
 *
 * pipe(
 *   Maybes.Some('ab'),
 *   Maybes.unless(str => str.length < 3) // -> None
 * );
 * ```
 */
export function unless<T>(predicate: (value: T) => boolean): (maybe: Maybe<T>) => Maybe<T> {
  return (maybe: Maybe<T>) => maybe.filter(negate(predicate));
}

/**
 * Flat maps a Some value into a new Maybe with a mapper function.
 * @param mapper - the mapper function
 * @returns the result of the mapper function if the original Maybe was a Some, otherwise a None
 * ```typescript
 * pipe(
 *   Maybes.Some({ x: 'test' }),
 *   Maybes.flatMap(obj => Maybes.fromNull(obj.x)) // -> Some('test')
 * );
 * ```
 */
export const flatMap = createInvoker<Maybe<any>, 'flatMap', Maybe<any>>('flatMap') as <A, B>(
  mapper: (val: A) => Maybe<B>
) => (maybe: Maybe<A>) => Maybe<B>;

/**
 * Gets the value of the Maybe or null.
 * @alias toValue
 * @returns the value of a Some, otherwise null
 * ```typescript
 * pipe(
 *   Maybes.Some(3),
 *   Maybes.orNull() // -> 3
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.orNull() // -> null
 * );
 * ```
 */
export const orNull = createInvoker<Maybe<any>, 'orNull', any | null>('orNull') as <T>() => (
  maybe: Maybe<T>
) => T | null;

/**
 * Gets the value of the Maybe or undefined.
 * @returns the value of a Some, otherwise undefined
 * ```typescript
 * pipe(
 *   Maybes.Some(3),
 *   Maybes.orUndefined() // -> 3
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.orUndefined() // -> undefined
 * );
 * ```
 */
export const orUndefined = createInvoker<Maybe<any>, 'orUndefined', any | undefined>('orUndefined') as <T>() => (
  maybe: Maybe<T>
) => T | undefined;

/**
 * Converts a Some into a Right, or a None into a Left of the provided left value.
 * @param leftVal - the value of the left side if given a None
 * @returns a Right of a Some value, or a Left of the given value
 * ```typescript
 * pipe(
 *   Maybes.Some('a'),
 *   Maybes.toEither(new Error()) // -> Right('a')
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.toEither(new Error()) // -> Left(Error)
 * );
 * ```
 */
export const toEither = createInvoker<Maybe<any>, 'toEither', Either<any, any>>('toEither') as <L, R>(
  leftVal: L
) => (maybe: Maybe<R>) => Either<L, R>;

/**
 * Gets the value of a Some, or the value provided.
 * @alias defaultTo
 * @param val - the default value
 * @returns the value of the Some given, else if given a None then the default value provided
 * ```typescript
 * pipe(
 *   Maybes.Some(3),
 *   Maybes.orSome(4) // -> 3
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.orSome(4) // -> 4
 * );
 * ```
 */
export const orSome = createInvoker<Maybe<any>, 'orSome', any>('orSome') as <T, R = T>(
  val: R
) => (maybe: Maybe<T>) => T | R;

/**
 * Gets a default Maybe value.
 * @param val - the default Maybe value
 * @returns the original Maybe if given a Some, otherwise the default Maybe value
 * ```typescript
 * pipe(
 *   Maybes.Some('a'),
 *   Maybes.orElse(Maybes.Some('b')) // -> Some('a')
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.orElse(Maybes.Some('b')) // -> Some('b')
 * );
 * ```
 */
export const orElse = createInvoker<Maybe<any>, 'orElse', Maybe<any>>('orElse') as <T, R = T>(
  val: Maybe<R>
) => (maybe: Maybe<T>) => Maybe<T | R>;

/**
 * Checks whether or not the given Maybe is a Some.
 * @alias isPresent
 * @returns true if given a Some, otherwise false
 * ```typescript
 * pipe(
 *   Maybes.Some('a'),
 *   Maybes.isSome() // -> true
 * );
 * ```
 */
export const isSome = createInvoker<Maybe<any>, 'isSome', boolean>('isSome') as <T>() => (maybe: Maybe<T>) => boolean;

/**
 * Checks whether or not the given Maybe is a None.
 * @returns true if given a None, otherwise false
 * ```typescript
 * pipe(
 *   Maybes.Some('a'),
 *   Maybes.isNone() // -> false
 * );
 * ```
 */
export const isNone = createInvoker<Maybe<any>, 'isNone', boolean>('isNone') as <T>() => (maybe: Maybe<T>) => boolean;

/**
 * Gets the value of a Some.
 * @returns the value of a Some
 * ```typescript
 * pipe(
 *   Maybes.Some(4),
 *   Maybes.some() // -> 4
 * );
 * ```
 */
export const some = createInvoker<Maybe<any>, 'some', any>('some') as <T>() => (maybe: Maybe<T>) => T;

/**
 * Creates a Maybe from a potentially nullable source.
 * @alias of
 * @param value - the value to convert into a Maybe
 * @returns a Some if the value is non-null, otherwise a None
 * ```typescript
 * Maybes.fromNull(4); // -> Some(4)
 * Maybes.fromNull(undefined); // -> None
 * ```
 */
export const fromNull = Maybe.fromNull as <T>(value: T) => Maybe<NonNullable<T>>;

function isEqualToUsing<T>(comparer: (v1: T, v2: T) => boolean, value: T): (a: Maybe<T>) => boolean {
  return isEqualToUsingWith(comparer, () => value);
}

function isEqualToUsingWith<T>(comparer: (v1: T, v2: T) => boolean, value: () => T): (a: Maybe<T>) => boolean {
  return toBoolean(v => comparer(v, value()));
}

/**
 * Performs a strict equality on the value of a Maybe and the given value.
 * @param val - the value to check the value of the Maybe against
 * @returns true if the value of a Some is the same as the provided value, otherwise false
 * ```typescript
 * pipe(
 *   Maybes.Some('abc'),
 *   Maybes.isEqualTo('abc') // -> true
 * );
 * ```
 */
export const isEqualTo = partial(isEqualToUsing, eq) as <T>(val: T) => (maybe: Maybe<T>) => boolean;

/**
 * Performs a strict equality on the value of a Maybe and the result of the given function.
 * @param val - the function that generates the value to check the Maybe against
 * @returns true if the value of a Some is the same as the result of the provided function, otherwise false
 * ```typescript
 * pipe(
 *   Maybes.Some('abc'),
 *   Maybes.isEqualToWith(() => 'abc') // -> true
 * );
 * ```
 */
export const isEqualToWith = partial(isEqualToUsingWith, eq) as <T>(val: () => T) => (maybe: Maybe<T>) => boolean;

/**
 * Performs a deep equality on the value of a Maybe and the given value.
 * @param val - the value to check the value of the Maybe against
 * @returns true if the value of a Some is the same as the provided value, otherwise false
 * ```typescript
 * pipe(
 *   Maybes.Some({ x: 1 }),
 *   Maybes.matches({ x: 1 }) // -> true
 * );
 * ```
 */
export const matches = partial(isEqualToUsing, _isEqual) as <T>(val: T) => (maybe: Maybe<T>) => boolean;

/**
 * Performs a deep equality on the value of a Maybe and the result of the given function.
 * @param val - the function that generates the value to check the Maybe against
 * @returns true if the value of a Some is the same as the result of the provided function, otherwise false
 * ```typescript
 * pipe(
 *   Maybes.Some({ x: 1 }),
 *   Maybes.matchesWith(() => ({ x: 1 })) // -> true
 * );
 * ```
 */
export const matchesWith = partial(isEqualToUsingWith, _isEqual) as <T>(val: () => T) => (maybe: Maybe<T>) => boolean;

/**
 * Checks if two Maybes are equal using a comparer function.
 * @param comparer - a function to use to compare the values of two Somes
 * @param a - a Maybe to compare
 * @param b - a Maybe to compare
 * @returns true if both Maybes are Nones, or both Maybes are Somes and contain the same value as determined by the comparer
 * ```typescript
 * Maybes.isEqualWith((a, b) => a.length === b.length, Maybes.Some('abc'), Maybes.Some('def')); // -> true
 * Maybes.isEqualWith((a, b) => a.length === b.length, Maybes.Some('abc'), Maybes.Some('test')); // -> false
 * Maybes.isEqualWith((a, b) => a.length === b.length, Maybes.Some('abc'), Maybes.None()); // -> false
 * Maybes.isEqualWith((a, b) => a.length === b.length, Maybes.None(), Maybes.None()); // -> true
 * ```
 */
export function isEqualWith<T>(comparer: (v1: T, v2: T) => boolean, a: Maybe<T>, b: Maybe<T>): boolean {
  return a === b || (a.isNone() && b.isNone()) || (a.isSome() && b.isSome() && comparer(a.some(), b.some()));
}

/**
 * Checks if the value of two Maybes are strictly equal.
 * @param a - a Maybe to compare
 * @param b - a Maybe to compare
 * @returns true if both Maybes contain the same value, or both Maybes are a None
 * ```typescript
 * Maybes.isEqual(Maybes.Some(123), Maybes.Some(123)); // -> true
 * Maybes.isEqual(Maybes.Some({ x: 'a' }), Maybes.Some({ x: 'a' })); // -> false
 * Maybes.isEqual(Maybes.Some(123), Maybes.None()); // -> false
 * Maybes.isEqual(Maybes.None(), Maybes.None()); // -> true
 * ```
 */
export const isEqual = partial(isEqualWith, eq) as <T>(a: Maybe<T>, b: Maybe<T>) => boolean;

/**
 * Creates a Maybe if the value successfully passes the predicate.
 * @param predicate - the predicate to create Some values from
 * @param value - the value to use to create the Maybe
 * @returns a Some if the value is non-null and passes the predicate, otherwise a None
 * ```typescript
 * Maybes.fromPredicate(Arrays.isArray, [1]); // -> Some([1])
 * Maybes.fromPredicate(Arrays.isArray, 1); // -> None
 * Maybes.fromPredicate(Arrays.isArray, null); // -> None
 * ```
 */
export function fromPredicate<T>(predicate: (value: T) => boolean, value: T): Maybe<T> {
  return predicate(value) ? fromNull(value) : None();
}

/**
 * Creates a Maybe from a numeric value.
 * @param value - the value to create a Maybe from
 * @returns a Some if the value is a finite number, otherwise a None
 * ```typescript
 * Maybes.fromNaN(123); // -> Some(123)
 * Maybes.fromNaN(Infinity); // -> None
 * Maybes.fromNaN('123'); // -> None
 * Maybes.fromNaN(NaN); // -> None
 * Maybes.fromNaN(null); // -> None
 * ```
 */
export function fromNaN(value: any): Maybe<number> {
  return fromPredicate(isFinite, value);
}

/**
 * Creates a Some value.
 * @param value - the value to construct a Some from
 * @returns a Some containing the given value
 */
export const Some = Maybe.Some as <T>(value: T) => Maybe<T>;

/**
 * Creates a None value.
 * @returns a None
 */
export const None = Maybe.None as <T>() => Maybe<T>;

/**
 * Combines any number of nullable values into a single Maybe.
 * @alias combineFrom
 * @param ...values - any number of nullable values
 * @returns a Some of an array of all the values, or a None if any value was null
 * ```typescript
 * Maybes.fromNulls('a', 2, []); // -> Some(['a', 2, []])
 * Maybes.fromNulls('a', null, 2); // -> None
 * ```
 */
export const fromNulls = combineFrom;

/**
 * Creates a Maybe from a potentially nullable source.
 * @alias fromNull
 * @param value - the value to convert into a Maybe
 * @returns a Some if the value is non-null, otherwise a None
 * ```typescript
 * Maybes.of(4); // -> Some(4)
 * Maybes.of(undefined); // -> None
 * ```
 */
export const of = fromNull;

/**
 * Gets the value of a Some, or the value provided.
 * @alias orSome
 * @param val - the default value
 * @returns the value of the Some given, else if given a None then the default value provided
 * ```typescript
 * pipe(
 *   Maybes.Some(3),
 *   Maybes.defaultTo(4) // -> 3
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.defaultTo(4) // -> 4
 * );
 * ```
 */
export const defaultTo = orSome;

/**
 * Gets the value of a Maybe with a function that resolves the default value.
 * @alias orSomeWith
 * @param elseFn - the function to resolve a default value
 * @returns the value of a Some, or the result of the elseFn if given a None
 * ```typescript
 * pipe(
 *   Maybes.Some(5),
 *   Maybes.defaultWith(() => 3) // -> 5
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.defaultWith(() => 3) // -> 3
 * );
 * ```
 */
export const defaultWith = orSomeWith;

/**
 * Gets the value of the Maybe or null.
 * @alias orNull
 * @returns the value of a Some, otherwise null
 * ```typescript
 * pipe(
 *   Maybes.Some(3),
 *   Maybes.toValue() // -> 3
 * );
 *
 * pipe(
 *   Maybes.None(),
 *   Maybes.toValue() // -> null
 * );
 * ```
 */
export const toValue = orNull;

/**
 * Checks whether or not the given Maybe is a Some.
 * @alias isSome
 * @returns true if given a Some, otherwise false
 * ```typescript
 * pipe(
 *   Maybes.Some('a'),
 *   Maybes.isPresent() // -> true
 * );
 * ```
 */
export const isPresent = isSome;

/**
 * Executes a function if the given Maybe is a Some.
 * @alias tap
 * @param fn - the function to execute
 * @returns the original Maybe
 * ```typescript
 * pipe(
 *   Maybes.Some(5),
 *   Maybes.ifPresent(num => console.log(num)) // logs: 5
 * );
 * ```
 */
export const ifPresent = tap;

/**
 * Maps a Some to a new Maybe using a mapper function.
 * @alias map
 * @param mapper - a function to map a Some value into a new nullable value
 * @returns a Some if the result of the mapper is not null and the original Maybe was a Some, otherwise a None
 * ```typescript
 * pipe(
 *   Maybes.Some(4),
 *   Maybes.flatMapFrom(num => num + 2) // -> Some(6)
 * );
 * ```
 */
export const flatMapFrom = map;
