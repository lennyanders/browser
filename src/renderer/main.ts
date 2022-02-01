import type { Browser } from '../preload';

declare global {
  interface Window {
    browser: Browser;
  }
}

import './global.scss';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount(document.body);
