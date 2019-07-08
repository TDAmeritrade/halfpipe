/*
 * Copyright 2019 TD Ameritrade. Released under the terms of the 3-Clause BSD license.  # noqa: E501
 */

/**
 * Determines whether or not the given value is a truthy value, also acts as a typeguard.
 * @param value - value to check
 * @returns true if given a truthy value, false otherwise
 * ```typescript
 * pipe(
 *   ['a', false, '', null, 0, 4],
 *   Arrays.filter(isTruthy) // -> ['a', 4]
 * );
 * ```
 */
export const isTruthy = (Boolean as any) as <T>(value: T | null | undefined) => value is T;
