/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { createInvoker } from './utils/createInvoker';
import { Maybe } from 'monet';

/**
 * Gets the value of the map at the specified key.
 * @param key - the key to get
 * @returns a Some of the value if it exists, a None otherwise
 * ```typescript
 * pipe(
 *   new Map([
 *     ['a', 1],
 *     ['b', 2]
 *   ]),
 *   Maps.get('b') // -> Some(2)
 * );
 *
 * pipe(
 *   new Map([
 *     ['a', 1],
 *     ['b', 2]
 *   ]),
 *   Maps.get('c') // -> None
 * );
 * ```
 */
export function get<K, V>(key: K): (map: Map<K, V>) => Maybe<V> {
  return map => Maybe.fromNull(map.get(key));
}

/**
 * Gets the size of the map.
 * @returns the size of the map
 * ```typescript
 * pipe(
 *   new Map([
 *     ['a', 1],
 *     ['b', 2]
 *   ]),
 *   Maps.size() // -> 2
 * );
 * ```
 */
export function size<K, V>(): (set: Map<K, V>) => number {
  return map => map.size;
}

/**
 * Gets the keys of the map.
 * @returns the an array of the keys of the map
 * ```typescript
 * pipe(
 *   new Map([
 *     ['a', 1],
 *     ['b', 2]
 *   ]),
 *   Maps.keys() // -> ['a','b']
 * );
 * ```
 */
export const keys = createInvoker<Map<any, any>, 'keys', any[]>('keys') as <K, V>() => (map: Map<K, V>) => K[];

/**
 * Gets the values of the map.
 * @returns the an array of the values of the map
 * ```typescript
 * pipe(
 *   new Map([
 *     ['a', 1],
 *     ['b', 2]
 *   ]),
 *   Maps.values() // -> [1,2]
 * );
 * ```
 */
export const values = createInvoker<Map<any, any>, 'values', any[]>('values') as <K, V>() => (map: Map<K, V>) => V[];

/**
 * Gets the entries of the map.
 * @returns the an array of the entries of the map
 * ```typescript
 * pipe(
 *   new Map([
 *     ['a', 1],
 *     ['b', 2]
 *   ]),
 *   Maps.entries() // -> [['a',1],['b',2]]
 * );
 * ```
 */
export const entries = createInvoker<Map<any, any>, 'entries', [any, any][]>('entries') as <K, V>() => (
  map: Map<K, V>
) => [K, V][];

/**
 * Checks whether the map contains a given key.
 * @returns true if the map contains the key
 * ```typescript
 * pipe(
 *   new Map([ [ 'a', 1 ] ]),
 *   Maps.has('b') // -> false
 * );
 * ```
 */
export const has = createInvoker<Map<any, any>, 'has', boolean>('has') as <K, V>(key: K) => (map: Map<K, V>) => boolean;

/**
 * Executes a function for each key/value pair in a map.
 * @param fn - the function to execute for each pair
 * ```typescript
 * pipe(
 *   new Map([
 *     ['a', 1],
 *     ['b', 2]
 *   ]),
 *   Maps.forEach((val, key) => console.log(key + val)) // logs: a1, b2
 * );
 * ```
 */
export const forEach = createInvoker<Map<any, any>, 'forEach', void>('forEach') as <K, V>(
  fn: (val: V, key: K, map: Map<K, V>) => void
) => (set: Map<K, V>) => void;
