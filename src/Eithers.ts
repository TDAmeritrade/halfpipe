import { Either, Maybe } from "monet";

import { createInvoker } from "./utils/createInvoker";

export function leftFlatMap<LA, R, LB>(
  fn: (val: LA) => Either<LB, R>
): (either: Either<LA, R>) => Either<LB, R> {
  return either =>
    either.isLeft()
      ? fn(either.left())
      : ((either as unknown) as Either<LB, R>);
}

export function toValue<L, R>(): (either: Either<L, R>) => L | R {
  return either => (either.isLeft() ? either.left() : either.right());
}

export const cata = createInvoker<Either<any, any>>("cata") as <
  L,
  R,
  V1,
  V2 = V1
>(
  leftFn: (val: L) => V1,
  rightFn: (val: R) => V2
) => (either: Either<L, R>) => V1 | V2;

export const map = createInvoker<Either<any, any>>("map") as <L, RA, RB>(
  fn: (val: RA) => RB
) => (either: Either<L, RA>) => Either<L, RB>;

export const flatMap = createInvoker<Either<any, any>>("flatMap") as <
  L,
  RA,
  RB
>(
  fn: (val: RA) => Either<L, RB>
) => (either: Either<L, RA>) => Either<L, RB>;

export const leftMap = createInvoker<Either<any, any>>("leftMap") as <
  LA,
  R,
  LB
>(
  fn: (val: LA) => LB
) => (either: Either<LA, R>) => Either<LB, R>;

export const bimap = createInvoker<Either<any, any>>("bimap") as <
  LA,
  RA,
  LB,
  RB
>(
  leftFn: (val: LA) => LB,
  rightFn: (val: RA) => RB
) => (either: Either<LA, RA>) => Either<LB, RB>;

export const isLeft = createInvoker<Either<any, any>>("isLeft") as <L, R>() => (
  either: Either<L, R>
) => boolean;

export const left = createInvoker<Either<any, any>>("left") as <L, R>() => (
  either: Either<L, R>
) => L;

export const isRight = createInvoker<Either<any, any>>("isRight") as <
  L,
  R
>() => (either: Either<L, R>) => boolean;

export const right = createInvoker<Either<any, any>>("right") as <L, R>() => (
  either: Either<L, R>
) => R;

export const toMaybe = createInvoker<Either<any, any>>("toMaybe") as <
  L,
  R
>() => (either: Either<L, R>) => Maybe<R>;

export const swap = createInvoker<Either<any, any>>("swap") as <L, R>() => (
  either: Either<L, R>
) => Either<R, L>;

export const rightMap = map;
export const rightFlatMap = flatMap;
export const flatMapBoth = cata;
export const mapBoth = bimap;
export const flip = swap;
