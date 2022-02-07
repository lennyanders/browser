import { ipcRenderer } from 'electron';

addEventListener(
  'keyup',
  (event) => {
    if (event.ctrlKey && event.key === 't') return ipcRenderer.send('newTab');

    if (event.ctrlKey && event.key === 'Tab') {
      return ipcRenderer.send('setActiveTabByOffset', event.shiftKey ? -1 : 1);
    }
  },
  { passive: true },
);
