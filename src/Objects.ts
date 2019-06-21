/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { Maybe } from 'monet';
import { values as _values, entries as _entries } from 'lodash';

export function get<T extends object>(key: keyof T): (obj: T) => Maybe<T[typeof key]> {
  return obj => Maybe.fromNull(obj[key]);
}

export function keys<T extends object>(): (obj: T) => (keyof T)[] {
  return obj => Object.keys(obj) as (keyof T)[];
}

export function values<T extends object>(): (obj: T) => T[keyof T][] {
  return obj => _values(obj);
}

export function entries<T extends object>(): (obj: T) => [keyof T, T[keyof T]][] {
  return obj => _entries(obj) as any;
}
