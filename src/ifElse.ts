/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { isFunction } from 'lodash';

export function ifElse<V, R1, R2 = R1>(
  condition: ((value: V) => boolean) | boolean,
  pass: (value: V) => R1,
  fail: (value: V) => R2
): (value: V) => R1 | R2 {
  const cond = isFunction(condition) ? condition : () => condition;

  return value => (cond(value) ? pass(value) : fail(value));
}

export function ifThen<V, R>(
  condition: ((value: V) => boolean) | boolean,
  pass: (value: V) => R
): (value: V) => R | undefined {
  return ifElse<V, R | undefined>(condition, pass, () => undefined);
}

/**
 * A functional switch statement.
 * @export
 * @template R
 * @param {([ (() => boolean) | boolean, () => R ][])} conditions
 * @returns {(R | null)}
 */
export function switchCase<R>(conditions: [(() => boolean) | boolean, () => R][]): R | null {
  for (const cond of conditions) {
    if (isFunction(cond[0]) ? (cond[0] as () => boolean)() : cond[0]) {
      return cond[1]();
    }
  }

  return null;
}
