/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { isNumber, first, last, flatMap as _flatMap, flattenDepth, partial } from 'lodash';
import { Maybe } from 'monet';

import { createInvoker } from './utils/createInvoker';

/**
 * Flattens an array using a mapping function.
 * @param fn - the mapper function
 * @returns the mapped and flattened array
 * ```typescript
 * pipe(
 *   ['ab','cd'],
 *   Arrays.flatMap(string => string.split('')) // -> ['a','b','c','d']
 * );
 * ```
 */
export function flatMap<T, R>(fn: (val: T, index: number, arr: T[]) => R[]): (array: T[]) => R[] {
  return partial(_flatMap, partial.placeholder, fn) as any;
}

/**
 * Flattens an array to a specified depth, defaulting to 1.
 * @param depth [1] - the depth to flatten the array
 * @returns the flattened array
 * ```typescript
 * pipe(
 *   [[1,2,3],[4,5,6]],
 *   Arrays.flat() // -> [1,2,3,4,5,6]
 * );
 * ```
 */
export function flat<T>(depth?: 1): (array: T[][]) => T[];
export function flat<T>(depth: 2): (array: T[][][]) => T[];
export function flat<T>(depth: 3): (array: T[][][][]) => T[];
export function flat<T>(depth: 4): (array: T[][][][][]) => T[];
export function flat<T>(depth: 5): (array: T[][][][][][]) => T[];
export function flat<T, R>(depth: number): (array: T[]) => R[];
export function flat<T>(depth: number = 1): (array: T[]) => unknown[] {
  return array => flattenDepth(array, depth) as any;
}

/**
 * Reduces the array into a value using an accumulator function starting with the first value in the array.
 * @param fn - the accumulator function accepting the accumulated value, the current value, the index and the array
 * @returns the accumulated value
 * ```typescript
 * pipe(
 *   [1,2,3],
 *   Arrays.reduce((sum, value) => sum + value) // -> 6
 * );
 * ```
 */
export function reduce<T>(fn: (accumulator: T, current: T, index: number, arr: T[]) => T): (array: T[]) => T;
/**
 * Reduces the array into a value using an accumulator function starting with the result of an initial value function.
 * @param fn - the accumulator function accepting the accumulated value, the current value, the index and the array
 * @param initialValueFactory - a function to generate the initial value
 * @returns the accumulated value
 * ```typescript
 * pipe(
 *   [1,2,3],
 *   Arrays.reduce((sum, value) => sum + value, () => 4) // -> 10
 * );
 * ```
 */
export function reduce<I, O>(
  fn: (accumulator: O, current: I, index: number, arr: I[]) => O,
  initialValueFactory?: () => O
): (array: I[]) => O;
export function reduce(fn: Function, initialValueFactory?: Function): Function {
  return array => (initialValueFactory ? array.reduce(fn, initialValueFactory()) : array.reduce(fn));
}

/**
 * Reduces the array into a value using an accumulator function starting with the last value in the array.
 * @param fn - the accumulator function accepting the accumulated value, the current value, the index and the array
 * @returns the accumulated value
 * ```typescript
 * pipe(
 *   [1,2,3],
 *   Arrays.reduce((sum, value) => sum + value) // -> 6
 * );
 * ```
 */
export function reduceRight<T>(fn: (accumulator: T, current: T, index: number, arr: T[]) => T): (array: T[]) => T;
/**
 * Reduces the array (from last to first) into a value using an accumulator function starting with the result of an initial value function.
 * @param fn - the accumulator function accepting the accumulated value, the current value, the index and the array
 * @param initialValueFactory - a function to generate the initial value
 * @returns the accumulated value
 * ```typescript
 * pipe(
 *   [1,2,3],
 *   Arrays.reduce((sum, value) => sum + value, () => 4) // -> 10
 * );
 * ```
 */
export function reduceRight<I, O>(
  fn: (accumulator: O, current: I, index: number, arr: I[]) => O,
  initialValueFactory?: () => O
): (array: I[]) => O;
export function reduceRight(fn: Function, initialValueFactory?: Function): Function {
  return array => (initialValueFactory ? array.reduceRight(fn, initialValueFactory()) : array.reduceRight(fn));
}

/**
 * Gets the element of an array at the specified index. For negative indices, it will index from the end of the array.
 * @param index - the index of the element to get, or a function that returns an index
 * @returns a Some of the element if it exists or a None if it does not
 * ```typescript
 * pipe(
 *   ['a','b'],
 *   Arrays.get(2) // -> None
 * );
 *
 * pipe(
 *   [1,2,3],
 *   Arrays.get(-1) // -> Some(3)
 * );
 * ```
 */
export function get<T>(index: number | ((arr: T[]) => number)): (array: T[]) => Maybe<T> {
  return array => {
    const idx = isNumber(index) ? index : index(array);

    return Maybe.fromNull(index < 0 ? array[array.length + idx] : array[idx]);
  };
}

/**
 * Gets the first element of an array.
 * @returns a Some of the first element of the array if it exists or a None if it does not
 * ```typescript
 * pipe(
 *   [1,2,3],
 *   Arrays.getFirst() // -> Some(1)
 * );
 * ```
 */
export function getFirst<T>(): (array: T[]) => Maybe<T> {
  return array => Maybe.fromNull(first(array));
}

/**
 * Gets the last element of an array.
 * @returns a Some of the last element of the array if it exists or a None if it does not
 * ```typescript
 * pipe(
 *   ['a','b','c'],
 *   Arrays.getLast() // -> Some('c')
 * );
 * ```
 */
export function getLast<T>(): (array: T[]) => Maybe<T> {
  return array => Maybe.fromNull(last(array));
}

/**
 * Gets the length of the array.
 * @returns the length of the array
 * ```typescript
 * pipe(
 *   [1,2,3],
 *   Arrays.size() // -> 3
 * );
 * ```
 */
export function size<T>(): (array: T[]) => number {
  return array => array.length;
}

/**
 * Finds the first element matching the given predicate.
 * @returns a Some if such an element exists or a None if it does not
 * ```typescript
 * pipe(
 *   [4,5,6,7],
 *   Arrays.find(num => num % 3 === 0) // -> Some(6)
 * );
 * ```
 */
export function find<T>(fn: (val: T, index: number, arr: T[]) => boolean): (array: T[]) => Maybe<T> {
  return array => Maybe.fromNull(array.find(fn));
}

/**
 * Immutably reverese an array.
 * @returns the reversed array
 * ```typescript
 * pipe(
 *   [1,2,3]
 * );
 * ```
 */
export function reverse<T>(): (array: T[]) => T[] {
  return array => [...array].reverse();
}

export const map = createInvoker<any[], 'map', any[]>('map') as <T, R>(
  fn: (val: T, index: number, arr: T[]) => R
) => (array: T[]) => R[];

export const filter = createInvoker<any[], 'filter', any[]>('filter') as <T>(
  fn: (val: T, index: number, arr: T[]) => boolean
) => (array: T[]) => T[];

export const some = createInvoker<any[], 'some', boolean>('some') as <T>(
  fn: (val: T, index: number, arr: T[]) => boolean
) => (array: T[]) => boolean;

export const every = createInvoker<any[], 'every', boolean>('every') as <T>(
  fn: (val: T, index: number, arr: T[]) => boolean
) => (array: T[]) => boolean;

export const forEach = createInvoker<any[], 'forEach', void>('forEach') as <T>(
  fn: (val: T, index: number, arr: T[]) => any
) => (array: T[]) => void;

export const sort = createInvoker<any[], 'sort', any[]>('sort') as <T>(
  fn: (val: T, index: number, arr: T[]) => number
) => (array: T[]) => T[];

export const concat = createInvoker<any[], 'concat', any[]>('concat') as <T>(arr: T[]) => (array: T[]) => T[];

export const join = createInvoker<any[], 'join', string>('join') as <T>(separator?: string) => (array: T[]) => string;

export const fill = createInvoker<any[], 'fill', any[]>('fill') as <T>(val: T) => (array: T[]) => T[];

export const from = Array.from;
export const isArray = Array.isArray;
export const of = Array.of;
export { flat as flatten };
