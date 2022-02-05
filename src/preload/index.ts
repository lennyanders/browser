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
  newTab: () => ipcRenderer.send('newTab'),
  createTab: (partialTab: Pick<Tab, 'url' | 'active'>) => ipcRenderer.send('createTab', partialTab),
  setActiveTab: (id: number) => ipcRenderer.send('setActiveTab', id),
  deleteTab: (id: number) => ipcRenderer.send('deleteTab', id),
  updateActiveTab: (partialTab: Partial<Tab>) => ipcRenderer.send('updateActiveTab', partialTab),
  updateTab: (id: number, partialTab: Partial<Tab>) => {
    ipcRenderer.send('updateTab', id, partialTab);
  },
  updateTabPosition: (oldIndex: number, newIndex: number) => {
    ipcRenderer.send('updateTabPosition', oldIndex, newIndex);
  },
};

const views = {
  getUserAgentForUrl: (url: string) => ipcRenderer.sendSync('getUserAgentForUrl', url) as string,
};

const browser = { windowActions, tabs, views };

export type Browser = typeof browser;

contextBridge.exposeInMainWorld('browser', browser);
