/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { Maybe, Either } from 'monet';
import { isFunction, partial, eq, negate, isEqual as _isEqual, first, last } from 'lodash';

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

export function tap<T>(fn: (val: T) => void): (maybe: Maybe<T>) => Maybe<T> {
  return maybe => {
    if (maybe.isSome()) {
      fn(maybe.some());
    }

    return maybe;
  };
}

export function orThrow<T, E extends Error>(error: E | (() => E)): (maybe: Maybe<T>) => T {
  const err = isFunction(error) ? error : () => error;

  return maybe => {
    if (maybe.isNone()) {
      throw err();
    }

    return maybe.some();
  };
}

export function toBoolean<T>(fn?: (val: T) => boolean): (maybe: Maybe<T>) => boolean {
  return maybe => (fn ? maybe.filter(fn).isSome() : maybe.isSome());
}

export function orSomeWith<T, R = T>(elseFn: () => R): (maybe: Maybe<T>) => T | R {
  return maybe => (maybe.isNone() ? elseFn() : maybe.some());
}

export function orElseWith<T, R = T>(elseFn: () => Maybe<R>): (maybe: Maybe<T>) => Maybe<T | R> {
  return maybe => (maybe.isNone() ? elseFn() : maybe);
}

/**
 * Gets all values as a single maybe. If any one is null, a None is returned.
 * @param {...any[]} values
 * @returns {Maybe<any[]>}
 */
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
export function combineFrom(...values: any[]): Maybe<any[]> {
  return combine(...values.map(Maybe.fromNull));
}

/**
 * Creates a function that lazily creates a maybe if the the given maybe is none.
 * The resulting value is wrapped in a Maybe.
 * @export
 * @template T
 * @param {() => T} factory
 * @returns {(maybe: Maybe<T>) => Maybe<T>}
 */
export function orElseFrom<T>(factory: () => T): (maybe: Maybe<T>) => Maybe<T> {
  return orElseWith(() => Maybe.fromNull(factory()));
}

/**
 * Flat maps a maybe except the predicate returns a value instead of a wrapped Maybe.
 * @export
 * @template T
 * @template U
 * @param {(value: T) => U} predicate
 * @returns {(maybe: Maybe<T>) => Maybe<U>}
 */
export function flatMapFrom<T, U>(
  predicate: (value: T) => U | null | undefined
): (maybe: Maybe<T>) => Maybe<NonNullable<U>> {
  return flatMap(value => fromNull(predicate(value)));
}

export const cata = createInvoker<Maybe<any>, 'cata', any>('cata') as <T, R1, R2 = R1>(
  noneFn: () => R1,
  someFn: (val: T) => R2
) => (maybe: Maybe<T>) => R1 | R2;

export const filter = createInvoker<Maybe<any>, 'filter', Maybe<any>>('filter') as <T>(
  fn: (val: T) => boolean
) => (maybe: Maybe<T>) => Maybe<T>;

export const flatMap = createInvoker<Maybe<any>, 'flatMap', Maybe<any>>('flatMap') as <A, B>(
  fn: (val: A) => Maybe<B>
) => (maybe: Maybe<A>) => Maybe<B>;

export const orNull = createInvoker<Maybe<any>, 'orNull', any | null>('orNull') as <T>() => (
  maybe: Maybe<T>
) => T | null;

export const orUndefined = createInvoker<Maybe<any>, 'orUndefined', any | undefined>('orUndefined') as <T>() => (
  maybe: Maybe<T>
) => T | undefined;

export const toEither = createInvoker<Maybe<any>, 'toEither', Either<any, any>>('toEither') as <L, R>(
  leftVal: L
) => (maybe: Maybe<R>) => Either<L, R>;

export const orSome = createInvoker<Maybe<any>, 'orSome', any>('orSome') as <T, R = T>(
  val: R
) => (maybe: Maybe<T>) => T | R;

export const orElse = createInvoker<Maybe<any>, 'orElse', Maybe<any>>('orElse') as <T, R = T>(
  val: Maybe<R>
) => (maybe: Maybe<T>) => Maybe<T | R>;

export const isSome = createInvoker<Maybe<any>, 'isSome', boolean>('isSome') as <T>() => (maybe: Maybe<T>) => boolean;

export const isNone = createInvoker<Maybe<any>, 'isNone', boolean>('isNone') as <T>() => (maybe: Maybe<T>) => boolean;

export const some = createInvoker<Maybe<any>, 'some', any>('some') as <T>() => (maybe: Maybe<T>) => T;

export const fromNull = Maybe.fromNull as <T>(value: T) => Maybe<NonNullable<T>>;

function isEqualToUsing<T>(comparer: (v1: T, v2: T) => boolean, value: T): (a: Maybe<T>) => boolean {
  return isEqualToUsingWith(comparer, () => value);
}

function isEqualToUsingWith<T>(comparer: (v1: T, v2: T) => boolean, value: () => T): (a: Maybe<T>) => boolean {
  return toBoolean(v => comparer(v, value()));
}

/**
 * Creates a function that filters a maybe when the given predicate is false
 * @export
 * @template T
 * @param {(value: T) => boolean} predicate
 * @returns {(maybe: Maybe<T>) => Maybe<T>}
 */
export function unless<T>(predicate: (value: T) => boolean): (maybe: Maybe<T>) => Maybe<T> {
  return (maybe: Maybe<T>) => maybe.filter(negate(predicate));
}

export const isEqualTo = partial(isEqualToUsing, eq) as <T>(val: T) => (maybe: Maybe<T>) => boolean;
export const isEqualToWith = partial(isEqualToUsingWith, eq) as <T>(val: () => T) => (maybe: Maybe<T>) => boolean;
export const matches = partial(isEqualToUsing, _isEqual) as <T>(val: T) => (maybe: Maybe<T>) => boolean;
export const matchesWith = partial(isEqualToUsingWith, _isEqual) as <T>(val: () => T) => (maybe: Maybe<T>) => boolean;

/**
 * Determines if two maybes are equal to each other.
 * @export
 * @template T
 * @param {(v1: T, v2: T) => boolean} comparer
 * @returns {(a: Maybe<T>, b: Maybe<T>) => boolean}
 */
export function isEqualWith<T>(comparer: (v1: T, v2: T) => boolean, a: Maybe<T>, b: Maybe<T>): boolean {
  return a === b || (a.isNone() && b.isNone()) || (a.isSome() && b.isSome() && comparer(a.some(), b.some()));
}

export const isEqual = partial(isEqualWith, eq) as <T>(a: Maybe<T>, b: Maybe<T>) => boolean;

/**
 * Returns a Maybe with the given value based on the predicate.
 * @export
 * @template T
 * @param {(value: T) => boolean} predicate
 * @param {T} value
 * @returns {Maybe<T>}
 */
export function fromPredicate<T>(predicate: (value: T) => boolean, value: T): Maybe<T> {
  return predicate(value) ? fromNull(value) : None();
}

/**
 * Creates a maybe from a finite number.
 * @export
 * @param {*} value
 * @returns {Maybe<number>}
 */
export function fromNumber(value: any): Maybe<number> {
  return fromPredicate(isFinite, value);
}

export function combineWith<T2, T3, T4, T5, T6>(
  m1: Maybe<T2>,
  m2: Maybe<T3>,
  m3: Maybe<T4>,
  m4: Maybe<T5>,
  m5: Maybe<T6>
): <T1>(source: Maybe<T1>) => Maybe<[T1, T2, T3, T4, T5, T6]>;
export function combineWith<T2, T3, T4, T5>(
  m1: Maybe<T2>,
  m2: Maybe<T3>,
  m3: Maybe<T4>,
  m4: Maybe<T5>
): <T1>(source: Maybe<T1>) => Maybe<[T1, T2, T3, T4, T5]>;
export function combineWith<T2, T3, T4>(
  m1: Maybe<T2>,
  m2: Maybe<T3>,
  m3: Maybe<T4>
): <T1>(source: Maybe<T1>) => Maybe<[T1, T2, T3, T4]>;
export function combineWith<T2, T3>(m1: Maybe<T2>, m2: Maybe<T3>): <T1>(source: Maybe<T1>) => Maybe<[T1, T2, T3]>;
export function combineWith<T2>(m1: Maybe<T2>): <T1>(source: Maybe<T1>) => Maybe<[T1, T2]>;
/**
 * Creates a function that returns a maybe with all given maybes if they are all a some.
 * @param maybes A list of maybes to combine with this one.
 */
export function combineWith(...maybes: Maybe<any>[]): <T>(source: Maybe<T>) => Maybe<any[]> {
  return <T>(source: Maybe<T>) => combine(source, ...maybes);
}

export const of = fromNull;
export const defaultTo = orSome;
export const defaultWith = orSomeWith;
export const toValue = orNull;
export const isPresent = isSome;
export const ifPresent = tap;
export const Some = Maybe.Some;
export const None = Maybe.None;
export const map = flatMapFrom;
