import { isFunction } from "lodash";

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
