import { contextBridge, ipcRenderer } from 'electron';
import { get } from './utils';

const windowActions = {
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  unmaximize: () => ipcRenderer.send('unmaximize'),
  close: () => ipcRenderer.send('close'),
  // showContextMenu: (menu: MenuKey) => ipcRenderer.send('showContextMenu', menu),
  getMaximizedState: get<boolean>('getMaximizedState', 'maximizedStateChanged'),
};
export type WindowActions = typeof windowActions;
contextBridge.exposeInMainWorld('windowActions', windowActions);
