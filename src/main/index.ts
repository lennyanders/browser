import { app, BrowserWindow, ipcMain, webContents } from 'electron';
import { join } from 'path';
import { cwd } from './consts';
import { isDev } from '../shared/consts';
import { registerProtocol } from './protocol';
import { useWindowActions } from './modules/windowActions';
import { useTabs } from './modules/tabs';
import { useCustomUserAgent } from './modules/userAgent';
import { showPageMenu } from './modules/contextMenus/page';
import { createTab, updateTab } from './modules/tabs/utils';
import { exists } from './utils/url';

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

  win.setMenu(null);
  win.once('ready-to-show', () => win.show());

  ipcMain.on('getPagePreloadPath', (event) => {
    event.returnValue = join(cwd, 'preloads', 'page.js');
  });

  ipcMain.on('tabWebview', (event, webContentsId: number, tabId: number) => {
    const page = webContents.fromId(webContentsId);

    page.on('context-menu', (_, params) => showPageMenu(params, page));

    page.on('did-navigate', (_, url) => updateTab(tabId, { url }));
    page.on('did-navigate-in-page', (_, url, isMainFrame) => {
      if (isMainFrame) updateTab(tabId, { url });
    });
    page.on('page-title-updated', (_, title) => updateTab(tabId, { title }));
    page.on('page-favicon-updated', async (_, [faviconUrl]) => {
      if (await exists(faviconUrl)) updateTab(tabId, { faviconUrl });
    });
    page.on('did-start-loading', () => updateTab(tabId, { loading: true }));
    page.on('did-stop-loading', () => updateTab(tabId, { loading: false }));
    page.on('media-started-playing', () => updateTab(tabId, { audible: true }));
    page.on('media-paused', () => updateTab(tabId, { audible: false }));
    page.setWindowOpenHandler(({ disposition, url }) => {
      if (disposition === 'foreground-tab') createTab({ url }, true);
      else if (disposition === 'background-tab') createTab({ url });
      return { action: 'deny' };
    });

    event.returnValue = updateTab(tabId, { title: page.getTitle(), url: page.getURL() });
  });

  useWindowActions(win);
  useTabs();
  useCustomUserAgent(win);
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
