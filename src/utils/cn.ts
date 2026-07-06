export type ClassValue = string | number | null | false | undefined;

/** Lightweight className combiner — filters falsy values and joins with a space. */
export const cn = (...values: ClassValue[]): string => values.filter(Boolean).join(' ');
