import { pipe } from './pipe';

describe('utils.pipe', () => {
  it('should pipe the value through the functions', () => {
    const result = pipe(
      0,
      v => v + 10,
      v => v - 5,
      v => v * 10
    );

    expect(result).toBe(50);
  });
});
