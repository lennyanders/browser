import { contextBridge, ipcRenderer } from 'electron';
import { Tab } from '../main/stores/tabs';
import { get } from './utils';

const windowActions = {
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  unmaximize: () => ipcRenderer.send('unmaximize'),
  close: () => ipcRenderer.send('close'),
  // showContextMenu: (menu: MenuKey) => ipcRenderer.send('showContextMenu', menu),
  getMaximizedState: get<boolean>('getMaximizedState', 'maximizedStateChanged'),
};

const tabs = {
  getAll: get<Tab[]>('getTabs', 'tabsChanged'),
};

const browser = { windowActions, tabs };

export type Browser = typeof browser;

contextBridge.exposeInMainWorld('browser', browser);
