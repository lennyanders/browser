import { ipcRenderer } from 'electron';

addEventListener(
  'keyup',
  (event) => {
    if (event.ctrlKey) {
      if (event.key === 't') return ipcRenderer.send('newTab');

      if (event.key === 'w') return ipcRenderer.send('deleteTab');

      if (event.key === '9') return ipcRenderer.send('setLastTabActive');

      if ('12345678'.includes(event.key)) {
        return ipcRenderer.send('setActiveTabByIndex', +event.key - 1);
      }

      if (event.key === 'Tab') {
        return ipcRenderer.send('setActiveTabByOffset', event.shiftKey ? -1 : 1);
      }

      if (event.shiftKey) {
        if (event.key === 'ArrowUp') return ipcRenderer.send('updateActiveTabPosition', -1);
        if (event.key === 'ArrowDown') return ipcRenderer.send('updateActiveTabPosition', 1);
      }
    }
  },
  { passive: true },
);
