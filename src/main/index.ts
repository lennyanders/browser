import { join } from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';

import { isDev } from './consts';
import { Tab, tabsStore } from './stores/tabs';
import { getUserAgentForUrl } from './utils/user-agent';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      sandbox: true,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:9090/index.html');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(join(__dirname, 'index.html'));
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
    tabsStore.onDidChange('tabs', (newValue) => event.sender.send('tabsChanged', newValue));
    event.returnValue = tabsStore.get('tabs');
  });
  ipcMain.on('newTab', () => {
    const tabs = tabsStore.store.tabs.map((tab) => ((tab.active = false), tab));
    tabs.push({
      title: 'New tab',
      // url: 'browser://newtab',
      url: 'https://lenny.fyi/',
      active: true,
      id: tabsStore.store.nextTabId,
    });
    tabsStore.set({ tabs, nextTabId: tabsStore.store.nextTabId + 1 });
  });
  ipcMain.on('setActiveTab', (_, id: number) => {
    const tabs = tabsStore.store.tabs.map<Tab>((tab) => ({ ...tab, active: tab.id === id }));
    tabsStore.set({ tabs });
  });
  ipcMain.on('deleteTab', (_, id: number) => {
    const tabs = tabsStore.get('tabs');
    if (tabs.length === 1) app.quit();

    const tabIndex = tabs.findIndex((tab) => tab.id === id);
    if (tabs[tabIndex].active) (tabs[tabIndex + 1] || tabs[tabIndex - 1]).active = true;
    tabs.splice(tabIndex, 1);
    tabsStore.set({ tabs });
  });
  ipcMain.on('updateActiveTab', (_, partialTab: Partial<Tab>) => {
    const tabs = tabsStore.get('tabs').map((tab) => (tab.active ? { ...tab, ...partialTab } : tab));
    tabsStore.set({ tabs });
  });
  ipcMain.on('updateTab', (_, id: number, partialTab: Partial<Tab>) => {
    const tabs = tabsStore.store.tabs.map((tab) => {
      return tab.id === id ? { ...tab, ...partialTab } : tab;
    });
    tabsStore.set({ tabs });
  });
  ipcMain.on('updateTabPosition', (_, oldIndex: number, newIndex: number) => {
    const tabs = tabsStore.get('tabs');
    tabs.splice(newIndex, 0, tabs.splice(oldIndex, 1)[0]);
    tabsStore.set({ tabs });
  });

  ipcMain.on('getUserAgentForUrl', (event, url: string) => {
    event.returnValue = getUserAgentForUrl(win.webContents.getUserAgent(), url);
  });
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
