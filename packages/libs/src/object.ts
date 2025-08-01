import type { Optional } from "./types";

/**
 * Checks if a value is null or undefined.
 *
 * @param {Optional<Type>} value - The value to check.
 * @returns {boolean} - Returns true if the value is null or undefined, otherwise false.
 */
export function isNullOrUndefined<Type>(
  value: Optional<Type>,
): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Checks if a value is null or undefined.
 *
 * @param {Optional<Type>} value - The value to check.
 * @returns {boolean} - Returns true if the value is null or undefined, otherwise false.
 */
export function isNotNullOrUndefined<Type>(
  value: Optional<Type>,
): value is Type {
  return !isNullOrUndefined(value);
}

/**
 * Returns a default value if the value is null or undefined.
 *
 * @param {Optional<Type>} value - The value to check.
 * @param {Type} defaultValue - The default value to return if the value is null or undefined.
 * @returns {Type} - Returns the value if it is not null or undefined, otherwise the default value.
 */
export function withDefault<Type>(value: Optional<Type>, defaultValue: Type): Type {
  return isNullOrUndefined(value) ? defaultValue : value;
}
