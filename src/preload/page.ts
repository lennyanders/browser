import { ipcRenderer } from 'electron';
import './shared/events';

ipcRenderer.send('initPageContextMenu');

addEventListener('keyup', (event: KeyboardEvent) => event.key === 'F5' && location.reload(), {
  passive: true,
});
