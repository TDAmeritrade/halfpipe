/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { negate } from 'lodash';

export const isFalsy = (negate(Boolean) as any) as <T>(
  value: T
) => value is T &
  (T extends number
    ? 0
    : never | T extends string
    ? ''
    : never | T extends boolean
    ? false
    : never | T extends undefined
    ? undefined
    : never | T extends null
    ? null
    : never);
