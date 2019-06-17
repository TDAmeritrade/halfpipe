import { createInvoker } from "./utils/createInvoker";

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

export function size<T>(): (set: Set<T>) => number {
  return set => set.size;
}

export const has = createInvoker<Set<any>>("has") as <T>(
  val: T
) => (set: Set<T>) => boolean;

export const forEach = createInvoker<Set<any>>("forEach") as <T>(
  fn: (val1: T, val2: T, set: Set<T>) => void
) => (set: Set<T>) => void;

export { _delete as delete };
