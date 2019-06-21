import { isPromiseLike } from './isPromiseLike';

describe('utils.isPromiseLike', () => {
  it('should return true for a Promise', () => {
    expect(isPromiseLike(new Promise(() => {}))).toBeTruthy;
  });

  it('should return false for anything else', () => {
    expect(isPromiseLike(4)).toBe(false);
    expect(isPromiseLike('')).toBe(false);
    expect(isPromiseLike({})).toBe(false);
  });
});
