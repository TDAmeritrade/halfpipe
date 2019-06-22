/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

export function createInvoker<T, K extends keyof T, R, A1, A2, A3, A4, A5>(
  key: K
): (a: A1, a2: A2, a3: A3, a4: A4, a5: A5) => (obj: T) => R;
export function createInvoker<T, K extends keyof T, R, A1, A2, A3, A4>(
  key: K
): (a: A1, a2: A2, a3: A3, a4: A4) => (obj: T) => R;
export function createInvoker<T, K extends keyof T, R, A1, A2, A3>(key: K): (a: A1, a2: A2, a3: A3) => (obj: T) => R;
export function createInvoker<T, K extends keyof T, R, A1, A2>(key: K): (a: A1, a2: A2) => (obj: T) => R;
export function createInvoker<T, K extends keyof T, R, A1>(key: K): (a: A1) => (obj: T) => R;
export function createInvoker<T, K extends keyof T, R>(key: K): () => (obj: T) => R;
export function createInvoker<T, K extends keyof T, R>(key: K): (...args: any[]) => (obj: T) => R {
  return (...args: any[]) => obj => (obj[key] as any)(...args);
}

export function createNoArgsInvoker<T, K extends keyof T, R>(key: K): (obj: T) => R {
  return createInvoker<T, K, R>(key)();
}
