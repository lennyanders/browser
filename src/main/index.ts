import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { cwd } from './consts';
import { isDev } from '../shared/consts';
import { registerProtocol } from './protocol';
import { useWindowActions } from './modules/windowActions';
import { useTabs } from './modules/tabs';
import { useCustomUserAgent } from './modules/userAgent';
import { useContextMenus } from './modules/contextMenus';

const createWindow = () => {
  if (!isDev) registerProtocol();

  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    show: false,
    webPreferences: {
      preload: join(cwd, 'preloads', 'app.js'),
      sandbox: true,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:9090/app/index.html');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(join(cwd, 'app', 'index.html'));
  }

  win.once('ready-to-show', () => win.show());

  ipcMain.on('getPagePreloadPath', (event) => {
    event.returnValue = join(cwd, 'preloads', 'page.js');
  });

  useWindowActions(win);
  useTabs();
  useCustomUserAgent(win);
  useContextMenus();
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
