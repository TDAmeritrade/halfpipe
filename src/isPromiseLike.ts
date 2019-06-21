/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

import { isObject, isFunction } from 'lodash';

export function isPromiseLike<T>(obj: any): obj is Promise<T> {
  return isObject(obj) && isFunction((obj as { then?: Function }).then);
}
