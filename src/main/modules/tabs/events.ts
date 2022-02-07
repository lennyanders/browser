import { app, ipcMain } from 'electron';
import { Tab, tabsStore } from '.';
import { defaultNewTab } from '../../../shared/consts';

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
  ipcMain.on('setActiveTab', (_, id: number) => {
    const { tabs } = tabsStore();
    tabs.forEach((tab) => (tab.active = tab.id === id));
    tabsStore({ tabs });
  });
  ipcMain.on('setLastTabActive', () => {
    const { tabs } = tabsStore();
    tabs.forEach((tab, index) => (tab.active = index === tabs.length - 1));
    tabsStore({ tabs });
  });
  ipcMain.on('setActiveTabByIndex', (_, index: number) => {
    const { tabs } = tabsStore();
    if (index > tabs.length - 1) return;
    tabs.forEach((tab, i) => (tab.active = i === index));
    tabsStore({ tabs });
  });
  ipcMain.on('setActiveTabByOffset', (_, offset: number) => {
    const { tabs } = tabsStore();
    const activeTabIndex = tabs.findIndex((tab) => tab.active);
    let newActiveTabIndex = activeTabIndex + offset;
    if (newActiveTabIndex > tabs.length - 1) newActiveTabIndex = 0;
    else if (newActiveTabIndex < 0) newActiveTabIndex = tabs.length - 1;
    tabs.forEach((tab, index) => (tab.active = index === newActiveTabIndex));
    tabsStore({ tabs });
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
};
