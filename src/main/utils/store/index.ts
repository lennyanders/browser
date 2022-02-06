import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { createState } from '../state';
import { debounce } from '../debounce';

interface StoreOptions<T> {
  defaultValue: T;
  deserialize?: (value: string) => T;
  afterDeserialize?: (value: T) => T;
  beforeSerialize?: (value: T) => T;
  serialize?: (value: T) => string;
}

export const createStore = <T>(
  filePath: string,
  {
    defaultValue,
    deserialize = JSON.parse,
    afterDeserialize,
    beforeSerialize,
    serialize = JSON.stringify,
  }: StoreOptions<T>,
) => {
  let value: T;
  try {
    value = deserialize(readFileSync(filePath, { encoding: 'utf-8' }));
    if (afterDeserialize) value = afterDeserialize(value);
  } catch (_) {
    value = defaultValue;
  }

  const state = createState(value);

  state.on(
    debounce((value) => {
      let clone: T = beforeSerialize ? JSON.parse(JSON.stringify(value)) : value;
      if (beforeSerialize) clone = beforeSerialize(clone);
      try {
        mkdirSync(dirname(filePath), { recursive: true });
      } catch (_) {}
      writeFileSync(filePath, serialize(clone), { encoding: 'utf-8' });
    }, 2500),
  );

  return state;
};
