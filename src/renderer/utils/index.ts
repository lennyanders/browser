import { ref } from 'vue';

export const getToRef = <T>(fn: (cb: (type: T) => void) => T) => {
  const state = ref<T>();
  state.value = fn((newState) => (state.value = newState));
  return state;
};
