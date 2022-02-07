import { app, ipcMain } from 'electron';
import { Tab, tabsStore } from '.';
import { defaultNewTab } from '../../../shared/consts';
import { isNumber } from '../../utils/types';
import { setActiveTab } from './utils';

export type SetActiveTabOptions = { id?: number; index?: number; offset?: number; last?: boolean };

export const handleTabEvents = () => {
  ipcMain.on('getTabs', (event) => {
    tabsStore.on(({ tabs }) => event.sender.send('tabsChanged', tabs));
    event.returnValue = tabsStore().tabs;
  });
  ipcMain.on('newTab', () => {
    let { tabs, nextTabId } = tabsStore();
    tabs.forEach((tab) => (tab.active = false));
    tabs.push({ ...defaultNewTab, id: nextTabId++ });
    tabsStore({ tabs, nextTabId });
  });
  ipcMain.on('createTab', (_, partialTab: Pick<Tab, 'url' | 'active'>) => {
    let { tabs, nextTabId } = tabsStore();
    if (partialTab.active) tabs.forEach((tab) => (tab.active = false));
    const activeTabIndex = tabs.findIndex((tab) => tab.active);
    tabs.splice(activeTabIndex + 1, 0, {
      ...partialTab,
      title: partialTab.url,
      loadInBackground: true,
      id: nextTabId++,
    });
    tabsStore({ tabs, nextTabId });
  });

  ipcMain.on('setActiveTab', (_, { id, index, offset, last }: SetActiveTabOptions) => {
    const { tabs } = tabsStore();
    const _setActiveTab = setActiveTab.bind(null, tabs);
    if (last) return _setActiveTab(tabs.length - 1);
    if (isNumber(index)) return _setActiveTab(index!);
    if (isNumber(id)) return _setActiveTab(tabs.findIndex((tab) => tab.id === id));
    if (isNumber(offset)) return _setActiveTab(tabs.findIndex((tab) => tab.active) + offset!, true);
  });
  ipcMain.on('deleteTab', (_, id?: number) => {
    const { tabs } = tabsStore();
    if (tabs.length === 1) app.quit();

    const tabIndex = tabs.findIndex(id ? (tab) => tab.id === id : (tab) => tab.active);
    if (tabs[tabIndex].active) (tabs[tabIndex + 1] || tabs[tabIndex - 1]).active = true;
    tabs.splice(tabIndex, 1);
    tabsStore({ tabs });
  });
  ipcMain.on('updateActiveTab', (_, partialTab: Partial<Tab>) => {
    const { tabs } = tabsStore();
    tabs.forEach((tab) => tab.active && Object.assign(tab, partialTab));
    tabsStore({ tabs });
  });
  ipcMain.on('updateTab', (_, id: number, partialTab: Partial<Tab>) => {
    const { tabs } = tabsStore();
    tabs.forEach((tab) => tab.id === id && Object.assign(tab, partialTab));
    tabsStore({ tabs });
  });
  ipcMain.on('updateTabPosition', (_, oldIndex: number, newIndex: number) => {
    const { tabs } = tabsStore();
    tabs.splice(newIndex, 0, tabs.splice(oldIndex, 1)[0]);
    tabsStore({ tabs });
  });
  ipcMain.on('updateActiveTabPosition', (_, offset: number) => {
    const { tabs } = tabsStore();
    const activeTabIndex = tabs.findIndex((tab) => tab.active);
    let newTabIndex = activeTabIndex + offset;
    if (newTabIndex > tabs.length - 1) newTabIndex = 0;
    else if (newTabIndex < 0) newTabIndex = tabs.length - 1;
    tabs.splice(newTabIndex, 0, tabs.splice(activeTabIndex, 1)[0]);
    tabsStore({ tabs });
  });
};
