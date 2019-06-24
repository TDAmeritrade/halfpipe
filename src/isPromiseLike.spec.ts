import { isPromiseLike } from './isPromiseLike';

describe('isPromiseLike', () => {
  it('should return true for a Promise', () => {
    expect(isPromiseLike(new Promise(() => {}))).toBeTruthy();
  });

  it('should return false for anything else', () => {
    expect(isPromiseLike(4)).toBeFalsy();
    expect(isPromiseLike('')).toBeFalsy();
    expect(isPromiseLike({})).toBeFalsy();
  });
});
