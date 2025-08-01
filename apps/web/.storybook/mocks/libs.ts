/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock for @poke-playbook/libs
export const isNotNullOrUndefined = (value: any) => value != null;

export const isNullOrUndefined = (value: any) => value == null;

export const withDefault = (value: any, defaultValue: any) => {
  return value != null ? value : defaultValue;
};

export const purgeFlatMap = (array: any[], callback: (item: any) => any) => {
  return array.flatMap(callback).filter(Boolean);
};
