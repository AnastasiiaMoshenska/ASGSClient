import {merge, Observable} from "rxjs";
import {mapTo} from "rxjs/operators";

export function defined<T>(x: T | null | undefined | void): x is T {
  return x !== null && x !== undefined;
}

export function sanitizeTerm(term: string) {
  return term?.toLocaleLowerCase()?.trim() || '';
}

export const noop = () => {};

export function mergeLoadingStates(start$: Observable<any>, finish$: Observable<any>) {
  return merge(start$.pipe(mapTo(true)), finish$.pipe(mapTo(false)));
}
