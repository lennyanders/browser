import { join } from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';

import { isDev } from './consts';
import { Tab, tabsStore } from './stores/tabs';

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
    const tabs = tabsStore.get('tabs').map((tab) => ((tab.active = false), tab));
    tabs.push({ title: 'New tab', url: 'browser://newtab', active: true });
    tabsStore.set('tabs', tabs);
  });
  ipcMain.on('setActiveTab', (_, index: number) => {
    const tabs = tabsStore.get('tabs').map((tab, i) => ((tab.active = i === index), tab));
    tabsStore.set('tabs', tabs);
  });
  ipcMain.on('deleteTab', (_, index: number) => {
    const tabs = tabsStore.get('tabs');
    if (tabs.length === 1) app.quit();
    if (tabs[index].active) {
      console.log(tabs[index + 1] || tabs[index - 1]);

      (tabs[index + 1] || tabs[index - 1]).active = true;
    }
    const filteredTabs = tabs.filter((_, i) => i !== index);
    tabsStore.set('tabs', filteredTabs);
  });
  ipcMain.on('updateTab', (_, index: number, partialTab: Partial<Tab>) => {
    const tabs = tabsStore.get('tabs');
    tabs[index] = { ...tabs[index], ...partialTab };
    tabsStore.set('tabs', tabs);
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
