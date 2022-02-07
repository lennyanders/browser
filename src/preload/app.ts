import { contextBridge, ContextMenuEvent, ipcRenderer } from 'electron';
import { Tab } from '../main/modules/tabs';
import { get } from './utils';

const windowActions = {
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  unmaximize: () => ipcRenderer.send('unmaximize'),
  close: () => ipcRenderer.send('close'),
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

const page = {
  preloadPath: ipcRenderer.sendSync('getPagePreloadPath'),
  getUserAgentForUrl: (url: string) => ipcRenderer.sendSync('getUserAgentForUrl', url) as string,
  showContextMenu: (params: ContextMenuEvent['params']) => {
    ipcRenderer.send('showPageContextMenu', params);
  },
};

const browser = { windowActions, tabs, page };

export type Browser = typeof browser;

contextBridge.exposeInMainWorld('browser', browser);
