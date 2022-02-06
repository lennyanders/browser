import { app, BrowserWindow, ipcMain } from 'electron';

import { cwd } from './consts';
import { defaultNewTab, isDev } from '../shared/consts';
import { Tab, tabsStore } from './stores/tabs';
import { getUserAgentForUrl } from './utils/user-agent';
import { registerProtocol } from './protocol';
import { handleContextMenus } from './contextMenus';

const createWindow = () => {
  if (!isDev) registerProtocol();

  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    show: false,
    webPreferences: {
      preload: `${cwd}/preload.js`,
      sandbox: true,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:9090/app/index.html');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(`${cwd}/app/index.html`);
  }

  win.once('ready-to-show', () => win.show());

  ipcMain.on('minimize', () => win.minimize());
  ipcMain.on('maximize', () => win.maximize());
  ipcMain.on('unmaximize', () => win.unmaximize());
  ipcMain.on('close', () => win.close());
  ipcMain.on('getMaximizedState', (event) => {
    const send = () => event.sender.send('maximizedStateChanged', win.isMaximized());
    win.on('maximize', send);
    win.on('minimize', send);
    win.on('unmaximize', send);
    win.on('restore', send);
    event.returnValue = win.isMaximized();
  });

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

  ipcMain.on('getUserAgentForUrl', (event, url: string) => {
    event.returnValue = getUserAgentForUrl(win.webContents.getUserAgent(), url);
  });

  handleContextMenus();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
