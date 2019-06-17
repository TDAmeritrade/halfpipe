import { Observable, Subscription } from "rxjs";

import { createInvoker } from "./utils/createInvoker";

export {
  map,
  mapTo,
  filter,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  concatMap,
  exhaustMap,
  withLatestFrom,
  combineLatest
} from "rxjs/operators";

export {
  of,
  from,
  fromEvent,
  merge as mergeOf,
  combineLatest as combineLatestOf
} from "rxjs";

export const toPromise = createInvoker<Observable<any>>("toPromise") as <
  T
>() => (obs: Observable<T>) => Promise<T>;

export const subscribe = createInvoker<Observable<any>>("subscribe") as <T>(
  next?: (value: T) => void,
  error?: (error: any) => void,
  complete?: () => void
) => (obs: Observable<T>) => Subscription;
