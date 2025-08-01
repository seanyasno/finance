import { isNotNullOrUndefined } from "./object";

/**
 * Checks if a value is a non-empty array.
 *
 * @param {Item[] | null | undefined} array - The array to check.
 * @returns {boolean} - Returns true if the array is non-empty, otherwise false.
 */
export function isNotEmptyArray<Item>(
  array: Item[] | null | undefined,
): array is [Item, ...Item[]] {
  return isNotNullOrUndefined(array) && array.length > 0;
}

/**
 * Checks if a value is an empty array.
 *
 * @param {Item[] | null | undefined} array - The array to check.
 * @returns {boolean} - Returns true if the array is empty, otherwise false.
 */
export function isEmptyArray<Item>(
  array: Item[] | null | undefined,
): array is [] {
  return isNotNullOrUndefined(array) && array.length === 0;
}

/**
 * Purges null and undefined values from an array.
 *
 * @param {Item[] | null | undefined} array - The array to purge.
 * @returns {Item[]} - Returns a new array with null and undefined values removed.
 */
export function purge<Item>(array: (Item | null | undefined)[]): Item[] {
  return array.filter(isNotNullOrUndefined) as Item[];
}

/**
 * Purges null and undefined values from an array after applying a map function.
 *
 * @param {Item[] | null | undefined} array - The array to purge.
 * @returns {Item[]} - Returns a new array with null and undefined values removed.
 */
export function purgeMap<Item>(array: (Item | null | undefined)[]): Item[] {
  return purge(array.map((item) => item));
}

/**
 * Purges null and undefined values from an array after applying a flatMap function.
 *
 * @param {Item[] | null | undefined} array - The array to purge.
 * @returns {Item[]} - Returns a new array with null and undefined values removed.
 */
export function purgeFlatMap<Item, Result>(
  array: Item[],
  callback: (item: Item) => (Result | null | undefined)[],
): Result[] {
  return purge(array.flatMap(callback));
}

/**
 * Finds an item in an array by a specific key and value.
 *
 * @param {Item[]} array - The array to search in.
 * @param {Key} key - The key to match.
 * @param {Item[Key]} value - The value to match.
 * @returns {Item | undefined} - Returns the found item or undefined if not found.
 */
export function findItemBy<Item, Key extends keyof Item>(
  array: Item[],
  key: Key,
  value: Item[Key],
): Item | undefined {
  return array.find((item) => item[key] === value);
}

/**
 * Finds the index of an item in an array by a specific key and value.
 *
 * @param {Item[]} array - The array to search in.
 * @param {Key} key - The key to match.
 * @param {Item[Key]} value - The value to match.
 * @returns {number} - Returns the index of the found item or -1 if not found.
 */
export function findIndexBy<Item, Key extends keyof Item>(
  array: Item[],
  key: Key,
  value: Item[Key],
): number {
  return array.findIndex((item) => item[key] === value);
}
