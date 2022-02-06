import { ContextMenuEvent, ipcMain, Menu, clipboard } from 'electron';
import { getUrl } from '../../utils/url';

const showMenu = (params: ContextMenuEvent['params']) => {
  console.log(params);

  const menuItems: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [];

  const selectionText = params.selectionText.trim();
  const url = params.linkURL || getUrl(selectionText);
  if (url) {
    menuItems.push(
      {
        label: 'Open link in new tab',
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
      },
    );
  }

  if (params.mediaType === 'image' && params.srcURL) {
    menuItems.push(
      {
        label: 'Open image in new tab',
      },
      {
        label: 'Save image',
      },
      {
        label: 'Copy image',
      },
      {
        label: 'Copy image link',
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
