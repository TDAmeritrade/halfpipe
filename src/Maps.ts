/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { createInvoker } from './utils/createInvoker';
import { Maybe } from 'monet';

export function get<K, V>(key: K): (map: Map<K, V>) => Maybe<V> {
  return map => Maybe.fromNull(map.get(key));
}

export function set<K, V>(key: K, val: V): (map: Map<K, V>) => Map<K, V> {
  return map => new Map([...map.entries(), [key, val]]);
}

function _delete<K, V>(key: K): (map: Map<K, V>) => Map<K, V> {
  return map => {
    const clone = new Map(map.entries());

    clone.delete(key);

    return clone;
  };
}

export function size<K, V>(): (set: Map<K, V>) => number {
  return map => map.size;
}

export const keys = createInvoker<Map<any, any>, 'keys', any[]>('keys') as <K, V>() => (map: Map<K, V>) => K[];

export const values = createInvoker<Map<any, any>, 'values', any[]>('values') as <K, V>() => (map: Map<K, V>) => V[];

export const entries = createInvoker<Map<any, any>, 'entries', [any, any][]>('entries') as <K, V>() => (
  map: Map<K, V>
) => [K, V][];

export const has = createInvoker<Map<any, any>, 'has', boolean>('has') as <K, V>(key: K) => (map: Map<K, V>) => boolean;

export { _delete as delete };
