/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { property } from 'lodash';

import { createInvoker } from './utils/createInvoker';

/**
 * Gets the size of the set.
 * @returns the size of the set
 * ```typescript
 * pipe(
 *   new Set([ 1, 2, 3]),
 *   Sets.size() // -> 3
 * );
 * ```
 */
export const size = property<Set<any>, number>('size');

/**
 * Checks whether the set contains a given element.
 * @returns true if the set contains the element
 * ```typescript
 * pipe(
 *   new Set([ 1, 2, 3]),
 *   Sets.has(2) // -> true
 * );
 * ```
 */
export const has = createInvoker<Set<any>, 'has', boolean>('has') as <T>(val: T) => (set: Set<T>) => boolean;

/**
 * Executes a function for each element in the set.
 * @param fn - the function to execute for each element
 * ```typescript
 * pipe(
 *   new Set([ 1, 2, 3 ]),
 *   Sets.forEach(val => console.log(val)) // logs: 1, 2, 3
 * );
 * ```
 */
export const forEach = createInvoker<Set<any>, 'forEach', void>('forEach') as <T>(
  fn: (val1: T, val2: T, set: Set<T>) => void
) => (set: Set<T>) => void;
