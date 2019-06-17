export const isTruthy = (Boolean as any) as <T>(
  value: T | null | undefined
) => value is T;
