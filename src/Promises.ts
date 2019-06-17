import { createInvoker } from "./utils/createInvoker";

const _catch = createInvoker<Promise<any>>("catch") as <A, B = A>(
  fn: (err: any) => B | Promise<B>
) => (promise: Promise<A>) => Promise<B>;

export const then = createInvoker<Promise<any>>("then") as <A, B = A>(
  fn: (val: A) => B | Promise<B>
) => (promise: Promise<A>) => Promise<B>;

export const all = Promise.all;
export const race = Promise.race;
export const resolve = Promise.resolve;
export const reject = Promise.reject;
export { _catch as catch };
