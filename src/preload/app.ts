import { contextBridge, ipcRenderer } from 'electron';
import { Tab } from '../main/modules/tabs';
import { SetActiveTabOptions } from '../main/modules/tabs/events';
import { get } from './utils';
import './shared/events';

const windowActions = {
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  unmaximize: () => ipcRenderer.send('unmaximize'),
  close: () => ipcRenderer.send('close'),
  getMaximizedState: get<boolean>('getMaximizedState', 'maximizedStateChanged'),
};

const tabs = {
  getAll: get<{ activeTabId: number; tabs: Tab[] }>('getTabs', 'tabsChanged'),
  newTab: () => ipcRenderer.send('newTab'),
  createTab: (partialTab: Pick<Tab, 'url'>, active?: boolean) => {
    ipcRenderer.send('createTab', partialTab, active);
  },
  setActiveTab: (options: SetActiveTabOptions) => ipcRenderer.send('setActiveTab', options),
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
};

const browser = { windowActions, tabs, page };

export type Browser = typeof browser;

contextBridge.exposeInMainWorld('browser', browser);
