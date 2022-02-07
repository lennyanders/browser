import { ipcRenderer } from 'electron';

addEventListener(
  'keyup',
  (event) => {
    if (event.ctrlKey) {
      if (event.key === 't') return ipcRenderer.send('newTab');

      if (event.key === 'w') return ipcRenderer.send('deleteTab');

      if (event.key === '9') return ipcRenderer.send('setActiveTab', { last: true });

      if ('12345678'.includes(event.key)) {
        return ipcRenderer.send('setActiveTab', { index: +event.key - 1 });
      }

      if (event.key === 'Tab') {
        return ipcRenderer.send('setActiveTab', { offset: event.shiftKey ? -1 : 1 });
      }

      if (event.shiftKey) {
        if (event.key === 'ArrowUp') return ipcRenderer.send('updateActiveTabPosition', -1);
        if (event.key === 'ArrowDown') return ipcRenderer.send('updateActiveTabPosition', 1);
      }
    }
  },
  { passive: true },
);
