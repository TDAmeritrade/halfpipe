/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { createInvoker } from './utils/createInvoker';

const _catch = createInvoker<Promise<any>, 'catch', Promise<any>>('catch') as <A, B = A>(
  fn: (err: any) => B | Promise<B>
) => (promise: Promise<A>) => Promise<B>;

export const then = createInvoker<Promise<any>, 'then', Promise<any>>('then') as <A, B = A>(
  fn: (val: A) => B | Promise<B>
) => (promise: Promise<A>) => Promise<B>;

export const all = Promise.all;
export const race = Promise.race;
export const resolve = Promise.resolve;
export const reject = Promise.reject;
export { _catch as catch };
export * from './isPromiseLike';
