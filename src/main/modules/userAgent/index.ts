import { BrowserWindow, ipcMain } from 'electron';
import { getUserAgentForUrl } from '../../utils/user-agent';

export const useCustomUserAgent = (win: BrowserWindow) => {
  ipcMain.on('getUserAgentForUrl', (event, url: string) => {
    event.returnValue = getUserAgentForUrl(win.webContents.getUserAgent(), url);
  });
};
