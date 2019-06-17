import { Maybe, Either } from "monet";
import { isFunction } from "lodash";

import { createInvoker } from "./utils/createInvoker";

export function combine<A>(a: Maybe<A>): Maybe<[A]>;
export function combine<A, B>(a: Maybe<A>, b: Maybe<B>): Maybe<[A, B]>;
export function combine<A, B, C>(
  a: Maybe<A>,
  b: Maybe<B>,
  c: Maybe<C>
): Maybe<[A, B, C]>;
export function combine<A, B, C, D>(
  a: Maybe<A>,
  b: Maybe<B>,
  c: Maybe<C>,
  d: Maybe<D>
): Maybe<[A, B, C, D]>;
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
export function combine(...maybes: Maybe<any>[]): Maybe<any[]> {
  let result = [];

  for (const maybe of maybes) {
    if (maybe.isNone()) {
      return Maybe.None();
    }

    result.push(maybe.some());
  }

  return Maybe.Some(result);
}

export function map<A, B>(fn: (val: A) => B): (maybe: Maybe<A>) => Maybe<B> {
  return maybe => (maybe.isNone() ? Maybe.None<B>() : maybe.map(fn));
}

export function tap<T>(fn: (val: T) => void): (maybe: Maybe<T>) => Maybe<T> {
  return maybe => {
    if (maybe.isSome()) {
      fn(maybe.some());
    }

    return maybe;
  };
}

export function orThrow<T, E extends Error>(
  error: E | (() => E)
): (maybe: Maybe<T>) => T {
  const err = isFunction(error) ? error : () => error;

  return maybe => {
    if (maybe.isNone()) {
      throw err();
    }

    return maybe.some();
  };
}

export function toBoolean<T>(
  fn?: (val: T) => boolean
): (maybe: Maybe<T>) => boolean {
  return maybe => (fn ? maybe.filter(fn).isSome() : maybe.isSome());
}

export function orSomeWith<T, R = T>(
  elseFn: () => R
): (maybe: Maybe<T>) => T | R {
  return maybe => (maybe.isNone() ? elseFn() : maybe.some());
}

export function orElseWith<T, R = T>(
  elseFn: () => Maybe<R>
): (maybe: Maybe<T>) => Maybe<T | R> {
  return maybe => (maybe.isNone() ? elseFn() : maybe);
}

export const cata = createInvoker<Maybe<any>>("cata") as <T, R1, R2 = R1>(
  noneFn: () => R1,
  someFn: (val: T) => R2
) => (maybe: Maybe<T>) => R1 | R2;

export const filter = createInvoker<Maybe<any>>("filter") as <T>(
  fn: (val: T) => boolean
) => (maybe: Maybe<T>) => Maybe<T>;

export const flatMap = createInvoker<Maybe<any>>("flatMap") as <A, B>(
  fn: (val: A) => Maybe<B>
) => (maybe: Maybe<A>) => Maybe<B>;

export const orNull = createInvoker<Maybe<any>>("orNull") as <T>() => (
  maybe: Maybe<T>
) => T | null;

export const orUndefined = createInvoker<Maybe<any>>("orUndefined") as <
  T
>() => (maybe: Maybe<T>) => T | undefined;

export const toEither = createInvoker<Maybe<any>>("toEither") as <L, R>(
  leftVal: L
) => (maybe: Maybe<R>) => Either<L, R>;

export const orSome = createInvoker<Maybe<any>>("orSome") as <T, R = T>(
  val: R
) => (maybe: Maybe<T>) => T | R;

export const orElse = createInvoker<Maybe<any>>("orElse") as <T, R = T>(
  val: Maybe<R>
) => (maybe: Maybe<T>) => Maybe<T | R>;

export const isSome = createInvoker<Maybe<any>>("isSome") as <T>() => (
  maybe: Maybe<T>
) => boolean;

export const isNone = createInvoker<Maybe<any>>("isNone") as <T>() => (
  maybe: Maybe<T>
) => boolean;

export const some = createInvoker<Maybe<any>>("some") as <T>() => (
  maybe: Maybe<T>
) => T;

export const fromNull = Maybe.fromNull as <T>(
  value: T
) => Maybe<NonNullable<T>>;

export const of = fromNull;
export const defaultTo = orSome;
export const defaultWith = orSomeWith;
export const toValue = orNull;
export const isPresent = isSome;
export const ifPresent = tap;
