import 'jest';

import { isTruthy } from './isTruthy';

describe('isTruthy', () => {
  describe('when truthy', () => {
    it('should return true', () => {
      expect(isTruthy(123)).toBeTruthy();
    });
  });

  describe('when falsy', () => {
    it('should return false', () => {
      expect(isTruthy(null)).toBeFalsy();
      expect(isTruthy(undefined)).toBeFalsy();
    });
  });
});
