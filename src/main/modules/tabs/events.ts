import { app, ipcMain } from 'electron';
import { Tab, tabsStore } from '.';
import { defaultNewTab } from '../../../shared/consts';
import { isNumber } from '../../utils/types';
import { setActiveTab, createTab, updateTab } from './utils';

export type SetActiveTabOptions = { id?: number; index?: number; offset?: number; last?: boolean };

export const handleTabEvents = () => {
  ipcMain.on('getTabs', (event) => {
    tabsStore.on(({ tabs, activeTabId }) => {
      event.sender.send('tabsChanged', { tabs, activeTabId });
    });
    const { tabs, activeTabId } = tabsStore();
    event.returnValue = { tabs, activeTabId };
  });
  ipcMain.on('newTab', () => createTab(defaultNewTab, true, true));
  ipcMain.on('createTab', (_, partialTab: Pick<Tab, 'url'>, active: boolean) => {
    createTab(partialTab, active);
  });
  ipcMain.on('setActiveTab', (_, { id, index, offset, last }: SetActiveTabOptions) => {
    const { tabs, activeTabId } = tabsStore();
    if (last) return setActiveTab(tabs.slice(-1)[0].id);
    if (isNumber(id)) return setActiveTab(id!);
    if (isNumber(offset)) {
      index = tabs.findIndex((tab) => tab.id === activeTabId) + offset!;
      if (index < 0) index = tabs.length - 1;
      else if (index >= tabs.length) index = 0;
    }
    if (isNumber(index) && index! >= 0 && index! < tabs.length) setActiveTab(tabs[index!].id);
  });
  ipcMain.on('deleteTab', (_, id?: number) => {
    let { tabs, activeTabId } = tabsStore();
    if (tabs.length === 1) app.quit();

    const tabId = id || activeTabId;
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    if (tabId === activeTabId) activeTabId = (tabs[tabIndex + 1] || tabs[tabIndex - 1]).id;

    tabs.splice(tabIndex, 1);
    tabsStore({ tabs, activeTabId });
  });
  ipcMain.on('updateActiveTab', (_, partialTab: Partial<Tab>) => {
    const { tabs, activeTabId } = tabsStore();
    tabs.forEach((tab) => tab.id === activeTabId && Object.assign(tab, partialTab));
    tabsStore({ tabs });
  });
  ipcMain.on('updateTab', (_, id: number, partialTab: Partial<Tab>) => updateTab(id, partialTab));
  ipcMain.on('updateTabPosition', (_, oldIndex: number, newIndex: number) => {
    const { tabs } = tabsStore();
    tabs.splice(newIndex, 0, tabs.splice(oldIndex, 1)[0]);
    tabsStore({ tabs });
  });
  ipcMain.on('updateActiveTabPosition', (_, offset: number) => {
    const { tabs, activeTabId } = tabsStore();
    const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    let newTabIndex = activeTabIndex + offset;
    if (newTabIndex > tabs.length - 1) newTabIndex = 0;
    else if (newTabIndex < 0) newTabIndex = tabs.length - 1;
    tabs.splice(newTabIndex, 0, tabs.splice(activeTabIndex, 1)[0]);
    tabsStore({ tabs });
  });
};
