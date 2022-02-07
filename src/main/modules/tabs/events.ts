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
    tabs.push({ ...partialTab, title: partialTab.url, loadInBackground: true, id: nextTabId++ });
    tabsStore({ tabs, nextTabId });
  });
  ipcMain.on('setActiveTab', (_, id: number) => {
    const { tabs } = tabsStore();
    tabs.forEach((tab) => (tab.active = tab.id === id));
    tabsStore({ tabs });
  });
  ipcMain.on('deleteTab', (_, id: number) => {
    const { tabs } = tabsStore();
    if (tabs.length === 1) app.quit();

    const tabIndex = tabs.findIndex((tab) => tab.id === id);
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