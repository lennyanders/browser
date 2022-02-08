import { Ref, ref } from 'vue';

export const getToRef = <T>(fn: (cb: (type: T) => void) => T) => {
  const state = ref<T>() as Ref<T>;
  state.value = fn((newState) => (state.value = newState));
  return state;
};

export const reloadActiveTab = () => {
  document.querySelector<Electron.WebviewTag>('webview:not([hidden])')?.reload();
};
