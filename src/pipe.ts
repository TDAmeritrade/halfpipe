/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 */

export function pipe<I, O>(
  value: I,
  fn1: (v: I) => any,
  fn2: (v: any) => any,
  fn3: (v: any) => any,
  fn4: (v: any) => any,
  fn5: (v: any) => any,
  fn6: (v: any) => any,
  fn7: (v: any) => any,
  fn8: (v: any) => any,
  fn9: (v: any) => any,
  fn10: (v: any) => any,
  fn11: (v: any) => any,
  fn12: (v: any) => any,
  fn13: (v: any) => any,
  fn14: (v: any) => any,
  fn15: (v: any) => any,
  ...fns: ((v: any) => any)[]
): O;
export function pipe<I, I2, I3, I4, I5, I6, I7, I8, I9, I10, I11, I12, I13, I14, I15, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => I6,
  fn6: (v: I6) => I7,
  fn7: (v: I7) => I8,
  fn8: (v: I8) => I9,
  fn9: (v: I9) => I10,
  fn10: (v: I10) => I11,
  fn11: (v: I11) => I12,
  fn12: (v: I12) => I13,
  fn13: (v: I13) => I14,
  fn14: (v: I14) => I15,
  fn15: (v: I15) => O
): O;
export function pipe<I, I2, I3, I4, I5, I6, I7, I8, I9, I10, I11, I12, I13, I14, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => I6,
  fn6: (v: I6) => I7,
  fn7: (v: I7) => I8,
  fn8: (v: I8) => I9,
  fn9: (v: I9) => I10,
  fn10: (v: I10) => I11,
  fn11: (v: I11) => I12,
  fn12: (v: I12) => I13,
  fn13: (v: I13) => I14,
  fn14: (v: I14) => O
): O;
export function pipe<I, I2, I3, I4, I5, I6, I7, I8, I9, I10, I11, I12, I13, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => I6,
  fn6: (v: I6) => I7,
  fn7: (v: I7) => I8,
  fn8: (v: I8) => I9,
  fn9: (v: I9) => I10,
  fn10: (v: I10) => I11,
  fn11: (v: I11) => I12,
  fn12: (v: I12) => I13,
  fn13: (v: I13) => O
): O;
export function pipe<I, I2, I3, I4, I5, I6, I7, I8, I9, I10, I11, I12, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => I6,
  fn6: (v: I6) => I7,
  fn7: (v: I7) => I8,
  fn8: (v: I8) => I9,
  fn9: (v: I9) => I10,
  fn10: (v: I10) => I11,
  fn11: (v: I11) => I12,
  fn12: (v: I12) => O
): O;
export function pipe<I, I2, I3, I4, I5, I6, I7, I8, I9, I10, I11, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => I6,
  fn6: (v: I6) => I7,
  fn7: (v: I7) => I8,
  fn8: (v: I8) => I9,
  fn9: (v: I9) => I10,
  fn10: (v: I10) => I11,
  fn11: (v: I11) => O
): O;
export function pipe<I, I2, I3, I4, I5, I6, I7, I8, I9, I10, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => I6,
  fn6: (v: I6) => I7,
  fn7: (v: I7) => I8,
  fn8: (v: I8) => I9,
  fn9: (v: I9) => I10,
  fn10: (v: I10) => O
): O;
export function pipe<I, I2, I3, I4, I5, I6, I7, I8, I9, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => I6,
  fn6: (v: I6) => I7,
  fn7: (v: I7) => I8,
  fn8: (v: I8) => I9,
  fn9: (v: I9) => O
): O;
export function pipe<I, I2, I3, I4, I5, I6, I7, I8, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => I6,
  fn6: (v: I6) => I7,
  fn7: (v: I7) => I8,
  fn8: (v: I8) => O
): O;
export function pipe<I, I2, I3, I4, I5, I6, I7, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => I6,
  fn6: (v: I6) => I7,
  fn7: (v: I7) => O
): O;
export function pipe<I, I2, I3, I4, I5, I6, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => I6,
  fn6: (v: I6) => O
): O;
export function pipe<I, I2, I3, I4, I5, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => I5,
  fn5: (v: I5) => O
): O;
export function pipe<I, I2, I3, I4, O>(
  value: I,
  fn1: (v: I) => I2,
  fn2: (v: I2) => I3,
  fn3: (v: I3) => I4,
  fn4: (v: I4) => O
): O;
export function pipe<I, I2, I3, O>(value: I, fn1: (v: I) => I2, fn2: (v: I2) => I3, fn3: (v: I3) => O): O;
export function pipe<I, I2, O>(value: I, fn1: (v: I) => I2, fn2: (v: I2) => O): O;
export function pipe<I, O>(value: I, fn: (v: I) => O): O;
export function pipe<I>(value: I): I;

/**
 * A function for composing functions from the top down. This is a functional placeholder for
 * the pipeline (|>) spec.
 * @param value - the initial value to pipe
 * @param fns - any number of functions to pipe the previous value into
 * @returns the result of piping the initial value through each consecutive function
 * ```typescript
 * pipe(
 *   { strings: [ 'hello', 'world' ] },
 *   Objects.get('strings'),
 *   Maybes.flatMap(Arrays.get(1)),
 *   Maybes.filter(str => str.length > 3),
 *   Maybes.defaultTo('no') // -> 'world'
 * );
 * ```
 */
export function pipe(
  value: any,
  fn1?: Function,
  fn2?: Function,
  fn3?: Function,
  fn4?: Function,
  fn5?: Function,
  fn6?: Function,
  fn7?: Function,
  fn8?: Function,
  fn9?: Function,
  fn10?: Function
): any {
  switch (arguments.length) {
    case 1:
      return value;
    case 2:
      return fn1!(value);
    case 3:
      return fn2!(fn1!(value));
    case 4:
      return fn3!(fn2!(fn1!(value)));
    case 5:
      return fn4!(fn3!(fn2!(fn1!(value))));
    case 6:
      return fn5!(fn4!(fn3!(fn2!(fn1!(value)))));
    case 7:
      return fn6!(fn5!(fn4!(fn3!(fn2!(fn1!(value))))));
    case 8:
      return fn7!(fn6!(fn5!(fn4!(fn3!(fn2!(fn1!(value)))))));
    case 9:
      return fn8!(fn7!(fn6!(fn5!(fn4!(fn3!(fn2!(fn1!(value))))))));
    case 10:
      return fn9!(fn8!(fn7!(fn6!(fn5!(fn4!(fn3!(fn2!(fn1!(value)))))))));
    case 11:
      return fn10!(fn9!(fn8!(fn7!(fn6!(fn5!(fn4!(fn3!(fn2!(fn1!(value))))))))));
    default: {
      let result: any = value;

      for (let i = 1, len = arguments.length; i < len; i++) {
        result = arguments[i](result);
      }

      return result;
    }
  }
}
