import type { WindowActions } from '../preload';

declare global {
  interface Window {
    windowActions: WindowActions;
  }
}

import './global.scss';
import { render } from 'preact';
import { App } from './App';

render(<App />, document.body);
