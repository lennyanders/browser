import { reactive, ref, Ref, UnwrapNestedRefs } from 'vue';

export const getToReactive = <T>(fn: (cb: (type: T) => void) => T) => {
  const value = fn((newState) => {
    if (isObject) Object.assign(state, newState);
    // @ts-ignore
    else state.value = newState;
  });
  const isObject = typeof value === 'object';
  // @ts-ignore
  const state = isObject ? reactive(value) : ref(value);

  return state as T extends object ? UnwrapNestedRefs<T> : Ref<T>;
};

export const removeFocus = (event: MouseEvent) => {
  const { activeElement } = document;
  if ((<HTMLDListElement>event.target).contains(activeElement)) {
    (<HTMLElement>document.activeElement).blur?.();
  }
};

export const reloadActiveTab = () => {
  document.querySelector<Electron.WebviewTag>('webview:not([hidden])')?.reload();
};
