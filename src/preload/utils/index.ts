import { ipcRenderer } from 'electron';

/**
 * Uitility to minimize communication with main script
 */
export const get = <T>(getChannel: string, cbChannel: string) => {
  type Callback = (type: T) => void;
  let first = true;
  let res: any;
  let cb: Callback;
  return (callback: Callback) => {
    cb = callback;
    if (!first) return res;

    ipcRenderer.on(cbChannel, (_, newState: any) => {
      if (typeof newState === 'object' && !Array.isArray(newState)) res = { ...res, ...newState };
      else res = newState;
      cb(res);
    });
    res = ipcRenderer.sendSync(getChannel) as T;
    first = false;
    return res;
  };
};
