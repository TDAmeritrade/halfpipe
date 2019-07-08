/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 */

import { Maybe } from 'monet';
import { values as _values, entries as _entries } from 'lodash';
import { createInvoker } from './utils/createInvoker';

/**
 * Gets the value of an object at the specified key.
 * @param key - the key to get
 * @returns a Some of the value at the key, or a None otherwise
 * ```typescript
 * pipe(
 *   { x: 3 },
 *   Objects.get('x') // -> Some(3)
 * );
 * ```
 */
export function get<T extends object>(key: keyof T): (obj: T) => Maybe<T[typeof key]> {
  return obj => Maybe.fromNull(obj[key]);
}

/**
 * Gets the keys of an object.
 * @returns an array of all the keys the object contains
 * ```typescript
 * pipe(
 *   { x: 2, y: 3 },
 *   Objects.keys() // -> ['x','y']
 * );
 * ```
 */
export function keys<T extends object>(noArg?: never): (obj: T) => (keyof T)[] {
  return obj => Object.keys(obj) as (keyof T)[];
}

/**
 * Gets the values of an object.
 * @returns an array of all the values the object contains
 * ```typescript
 * pipe(
 *   { x: 2, y: 3 },
 *   Objects.values() // -> [2,3]
 * );
 * ```
 */
export function values<T extends object>(noArg?: never): (obj: T) => T[keyof T][] {
  return obj => _values(obj);
}

/**
 * Gets the entries of an object.
 * @returns an array of all the key/value pairs the object contains
 * ```typescript
 * pipe(
 *   { x: 2, y: 3 },
 *   Objects.entries() // -> [['x', 2], ['y', 3]]
 * );
 * ```
 */
export function entries<T extends object>(noArg?: never): (obj: T) => [keyof T, T[keyof T]][] {
  return obj => _entries(obj) as any;
}

/**
 * Checks whether the object has a property.
 * @param key - the key to check
 * @returns true if the object has own property for the given key
 * ```typescript
 * pipe(
 *   { x: number },
 *   Objects.has('x') // -> true
 * );
 * ```
 */
export const has = createInvoker<Object, 'hasOwnProperty', any>('hasOwnProperty') as <T>(
  key: any
) => (obj: T) => boolean;
