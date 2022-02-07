import { ipcRenderer } from 'electron';

addEventListener(
  'keyup',
  (event) => {
    if (event.ctrlKey && event.key === 'Tab') {
      ipcRenderer.send('setActiveTabByOffset', event.shiftKey ? -1 : 1);
    }
  },
  { passive: true },
);
