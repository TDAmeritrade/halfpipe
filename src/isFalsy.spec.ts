import 'jest';

import { isFalsy } from './isFalsy';

describe('isFalsy', () => {
  describe('when truthy', () => {
    it('should return false', () => {
      expect(isFalsy(123)).toBeFalsy();
    });
  });

  describe('when falsy', () => {
    it('should return true', () => {
      expect(isFalsy(null)).toBeTruthy();
      expect(isFalsy(undefined)).toBeTruthy();
    });
  });
});
