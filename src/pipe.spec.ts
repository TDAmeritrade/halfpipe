import 'jest';

import { pipe } from './pipe';

describe('pipe', () => {
  const add: (y: string) => (x: string) => string = y => x => x + y;

  it('should return the value if no functions specified', () => {
    const result = pipe('a');

    expect(result).toEqual('a');
  });

  it('should pipe value through 1 function', () => {
    const result = pipe(
      'a',
      add('b')
    );

    expect(result).toEqual('ab');
  });

  it('should pipe value through 2 functions', () => {
    const result = pipe(
      'a',
      add('b'),
      add('c')
    );

    expect(result).toEqual('abc');
  });

  it('should pipe value through 3 functions', () => {
    const result = pipe(
      'a',
      add('b'),
      add('c'),
      add('d')
    );

    expect(result).toEqual('abcd');
  });

  it('should pipe value through 4 functions', () => {
    const result = pipe(
      'a',
      add('b'),
      add('c'),
      add('d'),
      add('e')
    );

    expect(result).toEqual('abcde');
  });

  it('should pipe value through 5 functions', () => {
    const result = pipe(
      'a',
      add('b'),
      add('c'),
      add('d'),
      add('e'),
      add('f')
    );

    expect(result).toEqual('abcdef');
  });

  it('should pipe value through 6 functions', () => {
    const result = pipe(
      'a',
      add('b'),
      add('c'),
      add('d'),
      add('e'),
      add('f'),
      add('g')
    );

    expect(result).toEqual('abcdefg');
  });

  it('should pipe value through 7 functions', () => {
    const result = pipe(
      'a',
      add('b'),
      add('c'),
      add('d'),
      add('e'),
      add('f'),
      add('g'),
      add('h')
    );

    expect(result).toEqual('abcdefgh');
  });

  it('should pipe value through 8 functions', () => {
    const result = pipe(
      'a',
      add('b'),
      add('c'),
      add('d'),
      add('e'),
      add('f'),
      add('g'),
      add('h'),
      add('i')
    );

    expect(result).toEqual('abcdefghi');
  });

  it('should pipe value through 9 functions', () => {
    const result = pipe(
      'a',
      add('b'),
      add('c'),
      add('d'),
      add('e'),
      add('f'),
      add('g'),
      add('h'),
      add('i'),
      add('j')
    );

    expect(result).toEqual('abcdefghij');
  });

  it('should pipe value through 10 functions', () => {
    const result = pipe(
      'a',
      add('b'),
      add('c'),
      add('d'),
      add('e'),
      add('f'),
      add('g'),
      add('h'),
      add('i'),
      add('j'),
      add('k')
    );

    expect(result).toEqual('abcdefghijk');
  });

  it('should pipe value through n functions', () => {
    const result = pipe(
      'a',
      add('b'),
      add('c'),
      add('d'),
      add('e'),
      add('f'),
      add('g'),
      add('h'),
      add('i'),
      add('j'),
      add('k'),
      add('l'),
      add('m'),
      add('n'),
      add('o'),
      add('p')
    );

    expect(result).toEqual('abcdefghijklmnop');
  });

  it('should pipe value through n functions with given generic', () => {
    const result = pipe<string, string>(
      'a',
      add('b'),
      add('c'),
      add('d'),
      add('e'),
      add('f'),
      add('g'),
      add('h'),
      add('i'),
      add('j'),
      add('k'),
      add('l'),
      add('m'),
      add('n'),
      add('o'),
      add('p')
    );

    expect(result).toEqual('abcdefghijklmnop');
  });
});
