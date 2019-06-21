/**
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 * halfpipe is a trademark of TD Ameritrade IP Company, Inc. All rights reserved.
 */

export const isTruthy = (Boolean as any) as <T>(value: T | null | undefined) => value is T;
