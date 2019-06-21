/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { Either, Maybe, Validation, IValidationAcc, ISuccessStatic, IFailStatic } from 'monet';

import { createInvoker, createNoArgsInvoker } from './utils/createInvoker';

/**
 * Creates a validation from a whether a value is truthy or not.
 * @export
 * @template E
 * @template T
 * @param {E} err
 * @param {T} [value]
 * @returns {(((value: T) => Validation<E, T>) | Validation<E, T>)}
 */
export function fromTruthy<E, T = any>(err: E, value: T): Validation<E, T>;
export function fromTruthy<E, T = any>(err: E): (value: T) => Validation<E, T>;
export function fromTruthy<E, T = any>(err: E, value?: T): ((value: T) => Validation<E, T>) | Validation<E, T> {
  const fn = value => (value ? Validation.Success<E, T>(value) : Validation.Fail<E, T>(err));

  return arguments.length > 1 ? fn(value) : fn;
}

export const flatMap = createInvoker('flatMap') as <E, T, V>(
  fn: (a: T) => Validation<E, V>
) => (val: Validation<E, T>) => Validation<E, V>;
export const map = createInvoker('map') as <E, T, V>(fn: (a: T) => V) => (val: Validation<E, T>) => Validation<E, V>;
export const takeLeft = createNoArgsInvoker('takeLeft') as <E, T>(val: Validation<E, T>) => Validation<E, T>;
export const takeRight = createNoArgsInvoker('takeRight') as <E, T>(val: Validation<E, T>) => Validation<E, T>;
export const ap = createInvoker('ap') as <E, T, V>(
  eitherFn: Validation<E, (a: T) => V>
) => (val: Validation<E, T>) => Validation<E, V>;
export const cata = createInvoker('cata') as <E, T, V>(
  fail: (a: E) => V,
  success: (b: T) => V
) => (val: Validation<E, T>) => V;
export const bimap = createInvoker('bimap') as <E, T, A, B>(
  fail: (a: E) => A,
  success: (b: T) => B
) => (val: Validation<E, T>) => Validation<A, B>;
export const failMap = createInvoker('failMap') as <E, T, V>(
  fail: (a: E) => V
) => (val: Validation<E, T>) => Validation<V, T>;
export const acc = createNoArgsInvoker('acc') as <E, T>(val: Validation<E, T>) => Validation<E, IValidationAcc>;
export const isSuccess = createNoArgsInvoker('isSuccess') as <E, T>(val: Validation<E, T>) => boolean;
export const isFail = createNoArgsInvoker('isFail') as <E, T>(val: Validation<E, T>) => boolean;
export const fail = createNoArgsInvoker('fail') as <E, T>(val: Validation<E, T>) => E;
export const success = createNoArgsInvoker('success') as <E, T>(val: Validation<E, T>) => T;
export const toEither = createNoArgsInvoker('toEither') as <E, T>(val: Validation<E, T>) => Either<E, T>;
export const toMaybe = createNoArgsInvoker('toMaybe') as <E, T>(val: Validation<E, T>) => Maybe<T>;
export const bind = flatMap;
export const chain = flatMap;
export const Success = Validation.Success as ISuccessStatic;
export const Fail = Validation.Fail as IFailStatic;
