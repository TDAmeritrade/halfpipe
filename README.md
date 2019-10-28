# halfpipe
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FTDAmeritrade%2Fhalfpipe.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FTDAmeritrade%2Fhalfpipe?ref=badge_shield)


Halfpipe is a functional programming library containing a pipe function, composable and pipe-able functions, and monadic constructs.

## Install Instructions:

`npm install @tdameritrade/halfpipe`

## Usage:

Functions are split into "namespaces" that operate on specific types of entities. Currently supported namespaces include:

- `Arrays`
- `Eithers`
- `Maps`
- `Maybes`
- `Objects`
- `Promises`
- `Sets`
- `Validations`

To use, import the `pipe` function as well as the desired namespaces:

```typescript
import { pipe, Objects } from '@tdameritrade/halfpipe';

const myObj = {
  x: 2,
  y: 4
};

const hasZ = pipe(
  myObj,
  Objects.has('z')
);

// hasZ === false
```

All functions are immutable:

```typescript
import { pipe, Arrays } from '@tdameritrade/halfpipe';

const myArr = [1, 2, 3];

const reversedArr = pipe(
  myArr,
  Arrays.reverse()
);

// reversedArr === [ 3, 2, 1 ]
// myArr === [ 1, 2, 3 ]
```

Functions can easily be composed:

```typescript
import { pipe, Arrays, Objects } from '@tdameritrade/halfpipe';

const myArr = [{ x: 2 }, { x: 3, y: 4 }, { y: 4 }];

const allHaveX = pipe(
  myArr,
  Arrays.every(Objects.has('x'))
);

// allHaveX === false
```

All functions that can return a potentially `null`/`undefined` value will return a `Maybe` instead:

```typescript
import { pipe, Arrays, Objects, Maybes } from '@tdameritrade/halfpipe';

const myArr = [{ x: 1 }, { x: 4, y: 3 }, { x: 1, y: 2 }];

const firstXWithY = pipe(
  myArr,
  Arrays.find(Objects.has('y')),
  Maybes.flatMap(Objects.get('x')),
  Maybes.orNull()
);

// firstXWithY === 4
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FTDAmeritrade%2Fhalfpipe.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FTDAmeritrade%2Fhalfpipe?ref=badge_large)