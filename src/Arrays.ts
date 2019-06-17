import {
  isNumber,
  first,
  last,
  flatMap as _flatMap,
  flatten as _flatten
} from "lodash";
import { Maybe } from "monet";

import { createInvoker } from "./utils/createInvoker";

export function flatMap<T, R>(
  fn: (val: T, index: number, arr: T[]) => R[]
): (array: T[]) => R[] {
  return array => _flatMap(array, fn);
}

export function flatten<T>(): (array: T[][]) => T[] {
  return array => _flatten(array);
}

export function reduce<T>(
  fn: (accumulator: T, current: T, index: number, arr: T[]) => T
): (array: T[]) => T;
export function reduce<I, O>(
  fn: (accumulator: O, current: I, index: number, arr: I[]) => O,
  initialValueFactory?: () => O
): (array: I[]) => O;
export function reduce(fn: Function, initialValueFactory?: Function): Function {
  return array =>
    initialValueFactory
      ? array.reduce(fn, initialValueFactory())
      : array.reduce(fn);
}

export function reduceRight<T>(
  fn: (accumulator: T, current: T, index: number, arr: T[]) => T
): (array: T[]) => T;
export function reduceRight<I, O>(
  fn: (accumulator: O, current: I, index: number, arr: I[]) => O,
  initialValueFactory?: () => O
): (array: I[]) => O;
export function reduceRight(
  fn: Function,
  initialValueFactory?: Function
): Function {
  return array =>
    initialValueFactory
      ? array.reduceRight(fn, initialValueFactory())
      : array.reduceRight(fn);
}

export function get<T>(
  index: number | ((arr: T[]) => number)
): (array: T[]) => Maybe<T> {
  return array => {
    const idx = isNumber(index) ? index : index(array);

    return Maybe.fromNull(index < 0 ? array[array.length + idx] : array[idx]);
  };
}

export function getFirst<T>(): (array: T[]) => Maybe<T> {
  return array => Maybe.fromNull(first(array));
}

export function getLast<T>(): (array: T[]) => Maybe<T> {
  return array => Maybe.fromNull(last(array));
}

export function size<T>(): (array: T[]) => number {
  return array => array.length;
}

export function find<T>(
  fn: (val: T, index: number, arr: T[]) => boolean
): (array: T[]) => Maybe<T> {
  return array => Maybe.fromNull(array.find(fn));
}

export function reverse<T>(): (array: T[]) => T[] {
  return array => [...array].reverse();
}

export const map = createInvoker<any[]>("map") as <T, R>(
  fn: (val: T, index: number, arr: T[]) => R
) => (array: T[]) => R[];

export const filter = createInvoker<any[]>("filter") as <T>(
  fn: (val: T, index: number, arr: T[]) => boolean
) => (array: T[]) => T[];

export const some = createInvoker<any[]>("some") as <T>(
  fn: (val: T, index: number, arr: T[]) => boolean
) => (array: T[]) => boolean;

export const every = createInvoker<any[]>("every") as <T>(
  fn: (val: T, index: number, arr: T[]) => boolean
) => (array: T[]) => boolean;

export const forEach = createInvoker<any[]>("forEach") as <T>(
  fn: (val: T, index: number, arr: T[]) => any
) => (array: T[]) => void;

export const sort = createInvoker<any[]>("sort") as <T>(
  fn: (val: T, index: number, arr: T[]) => number
) => (array: T[]) => T[];

export const concat = createInvoker<any[]>("concat") as <T>(
  arr: T[]
) => (array: T[]) => T[];

export const join = createInvoker<any[]>("join") as <T>(
  separator?: string
) => (array: T[]) => string;

export const fill = createInvoker<any[]>("fill") as <T>(
  val: T
) => (array: T[]) => T[];

export const from = Array.from;
