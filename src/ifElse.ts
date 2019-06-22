/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { isFunction } from 'lodash';

/**
 * An if-else branch using function composition.
 * @param condition - a constant boolean value or a function that resolves to a boolean
 * @param pass - a function to execute if the condition passes
 * @param fail - a function to execute if the condition fails
 * @returns the result of calling pass if the condition is true, or the result of calling fail if not
 * ```typescript
 * pipe(
 *   5,
 *   ifElse(
 *     num => num > 3,
 *     num => num / 2, // -> 2.5
 *     num => num * 2
 *   )
 * );
 *
 * pipe(
 *   2,
 *   ifElse(
 *     num => num > 3,
 *     num => num / 2,
 *     num => num * 2 // -> 4
 *   )
 * );
 * ```
 */
export function ifElse<V, R1, R2 = R1>(
  condition: ((value: V) => boolean) | boolean,
  pass: (value: V) => R1,
  fail: (value: V) => R2
): (value: V) => R1 | R2 {
  const cond = isFunction(condition) ? condition : () => condition;

  return value => (cond(value) ? pass(value) : fail(value));
}

/**
 * An if-then branch using function composition
 * @param condition - a constant boolean value or a function that resolves to a boolean
 * @param pass - a function to execute if the condition passes
 * @returns the result of calling pass if the condition is true, or the initial value if not
 * ```typescript
 * pipe(
 *   5,
 *   ifThen(
 *     num => num > 3,
 *     num => num / 2 // -> 2.5
 *   )
 * );
 *
 * pipe(
 *   2,
 *   ifElse(
 *     num => num > 3,
 *     num => num / 2
 *   ) // -> 2
 * );
 * ``
 */
export function ifThen<V, R>(condition: ((value: V) => boolean) | boolean, pass: (value: V) => R): (value: V) => R | V {
  return ifElse<V, R | V>(condition, pass, val => val);
}

/**
 * A switch-case expression using function composition.
 * @param conditions - an array of pairs matching a boolean value or a function returning a boolean, to a function to execute if true
 * @returns the result of the function matching the first true condition
 * ```typescript
 * switchCase([
 *   [ () => false, () => 4 ],
 *   [ () => true, () => 3], // -> 3
 *   [ true, () => 2 ]
 * ]);
 * ```
 */
export function switchCase<R>(conditions: [(() => boolean) | boolean, () => R][]): R | undefined {
  for (const cond of conditions) {
    if (isFunction(cond[0]) ? (cond[0] as () => boolean)() : cond[0]) {
      return cond[1]();
    }
  }

  return undefined;
}
