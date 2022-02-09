import { ContextMenuEvent, ipcMain, Menu, clipboard, BrowserWindow } from 'electron';
import { getUrl } from '../../utils/url';
import { createTab } from '../tabs/utils';

const showMenu = (params: ContextMenuEvent['params']) => {
  console.log(params);

  const menuItems: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [];

  const selectionText = params.selectionText.trim();
  const url = params.linkURL || getUrl(selectionText);
  if (url) {
    menuItems.push(
      {
        label: 'Open link in new tab',
        click: () => createTab({ url, title: params.linkText || url }),
      },
      {
        label: 'Copy link',
        click: () => (clipboard.clear(), clipboard.writeText(url)),
      },
    );
    if (params.linkText) {
      menuItems.push({
        label: 'Copy link text',
        click: () => (clipboard.clear(), clipboard.writeText(params.linkText)),
      });
    }
  } else if (selectionText) {
    menuItems.push(
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click: () => (clipboard.clear(), clipboard.writeText(selectionText)),
      },
      {
        label: `Search DuckDuckGo for "${selectionText}"`,
        click: () => createTab({ url: `https://duckduckgo.com/?q=${selectionText}` }, true),
      },
    );
  }

  if (params.mediaType === 'image' && params.srcURL) {
    menuItems.push(
      {
        label: 'Open image in new tab',
        click: () => createTab({ url: params.srcURL }),
      },
      {
        label: 'Save image',
        click: () => BrowserWindow.getFocusedWindow()?.webContents.downloadURL(params.srcURL),
      },
      {
        label: 'Copy image',
      },
      {
        label: 'Copy image link',
        click: () => (clipboard.clear(), clipboard.writeText(params.srcURL)),
      },
    );
  }

  menuItems.push(
    {
      type: 'separator',
    },
    {
      label: 'Inspect',
    },
  );

  if (menuItems.length) Menu.buildFromTemplate(menuItems).popup();
};

export const handlePageContextMenu = () => {
  ipcMain.on('showPageContextMenu', (_, params: ContextMenuEvent['params']) => showMenu(params));
};
