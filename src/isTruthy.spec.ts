import { isTruthy } from './isTruthy';

describe('utils.isTruthy', () => {
  describe('when truthy', () => {
    it('should return true', () => {
      expect(isTruthy(123)).toBeTruthy;
    });
  });

  describe('when falsey', () => {
    it('should return false', () => {
      expect(isTruthy(null)).toBe(false);
      expect(isTruthy(undefined)).toBe(false);
    });
  });
});
