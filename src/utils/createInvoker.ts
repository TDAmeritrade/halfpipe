export function createInvoker<T>(key: keyof T): Function {
  return (...args) => val => val[key](...args);
}
