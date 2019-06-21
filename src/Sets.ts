/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { property } from 'lodash';

import { createInvoker } from './utils/createInvoker';

export function add<T>(val: T): (set: Set<T>) => Set<T> {
  return set => new Set([...set, val]);
}

function _delete<T>(val: T): (set: Set<T>) => Set<T> {
  return set => {
    const clone = new Set([...set]);

    clone.delete(val);

    return clone;
  };
}

export const size = property<Set<any>, number>('size');

export const has = createInvoker<Set<any>, 'has', boolean>('has') as <T>(val: T) => (set: Set<T>) => boolean;

export const forEach = createInvoker<Set<any>, 'forEach', void>('forEach') as <T>(
  fn: (val1: T, val2: T, set: Set<T>) => void
) => (set: Set<T>) => void;

export { _delete as delete };
