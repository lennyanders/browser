import { ipcRenderer } from 'electron';
import './shared/events';

ipcRenderer.on('tab', (_, tabId: number) => ipcRenderer.send('tabWebview', tabId));

addEventListener('keyup', (event: KeyboardEvent) => event.key === 'F5' && location.reload(), {
  passive: true,
});
