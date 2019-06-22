/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { createInvoker } from './utils/createInvoker';
import { isPromiseLike as _isPromiseLike } from './isPromiseLike';

/**
 * Registers a catch handler for the Promise.
 * @param fn - the catch handler
 * @returns a Promise for the completion of the callback
 * ```typescript
 * pipe(
 *   Promises.reject('failed'),
 *   Promises.catch(err => console.log(err)) // logs: failed
 * );
 * ```
 */
const _catch = createInvoker<Promise<any>, 'catch', Promise<any>>('catch') as <A, B = A>(
  fn: (err: any) => B | Promise<B>
) => (promise: Promise<A>) => Promise<B>;

/**
 * Registers a handler for the Promise.
 * @param fn - the handler
 * @returns a Promise for the completion of the callback
 * ```typescript
 * pipe(
 *   Promises.resolve(5),
 *   Promises.then(num => num + 2) // -> Promise(5)
 * );
 * ```
 */
export const then = createInvoker<Promise<any>, 'then', Promise<any>>('then') as <A, B = A>(
  fn: (val: A) => B | Promise<B>
) => (promise: Promise<A>) => Promise<B>;

/**
 * Creates a Promise that is resolved with an array of results when all of the provided Promises resolve, or rejected when any Promise is rejected.
 * @param values - An array of Promises
 * @returns a new Promise
 */
export const all = Promise.all;

/**
 * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved or rejected.
 * @param values - An array of Promises
 * @returns a new Promise
 */
export const race = Promise.race;

/**
 * Creates a new resolved promise for the provided value.
 * @param value - A promise
 * @returns a promise whose internal state matches the provided promise
 */
export const resolve = Promise.resolve;

/**
 * Creates a new rejected promise for the provided reason.
 * @param reason - The reason the promise was rejected.
 * @returns a new rejected Promise.
 */
export const reject = Promise.reject;

/**
 * Determines whether or not an object is promise-like (i.e. "thenable").
 * @param obj - the object to check
 * @returns true if the object is promise-like
 * ```typescript
 * pipe(
 *   Promises.resolve(5),
 *   Promises.isPromiseLike() // -> true
 * );
 * ```
 */
export const isPromiseLike = () => _isPromiseLike;
export { _catch as catch };
