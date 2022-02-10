import { ContextMenuEvent, Menu, clipboard, WebContents } from 'electron';
import { getUrl } from '../../utils/url';
import { createTab } from '../tabs/utils';

export const showPageMenu = (params: ContextMenuEvent['params'], webContents: WebContents) => {
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
        click: () => webContents.downloadURL(params.srcURL),
      },
      {
        label: 'Copy image',
        click: () => webContents.copyImageAt(params.x, params.y),
      },
      {
        label: 'Copy image link',
        click: () => (clipboard.clear(), clipboard.writeText(params.srcURL)),
      },
    );
  }

  menuItems.push(
    { type: 'separator' },
    {
      label: 'Inspect',
      click: () => webContents.inspectElement(params.x, params.y),
    },
  );

  if (menuItems.length) Menu.buildFromTemplate(menuItems).popup();
};
