import type {
  ContextMenuEvent,
  DidNavigateEvent,
  DidNavigateInPageEvent,
  NewWindowEvent,
  PageFaviconUpdatedEvent,
  PageTitleUpdatedEvent,
  UpdateTargetUrlEvent,
} from 'electron';
import type { Browser } from '../../preload/app';

declare global {
  interface Window {
    browser: Browser;
  }
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // Temp: Electron.WebviewTag;

    webview: {
      new (): {
        $props: Partial<{
          partition: string;
          plugins: boolean;
          preload: string;
          src: string;
          useragent: string;
          nodeIntegration: boolean;
          contextIsolation: boolean;
          onUpdateTargetUrl: (event: UpdateTargetUrlEvent) => void;
          onDidNavigate: (event: DidNavigateEvent) => void;
          onDidNavigateInPage: (event: DidNavigateInPageEvent) => void;
          onNewWindow: (event: NewWindowEvent) => void;
          onPageTitleUpdated: (event: PageTitleUpdatedEvent) => void;
          onPageFaviconUpdated: (event: PageFaviconUpdatedEvent) => void;
          onDidStartLoading: (event: Event) => void;
          onDidStopLoading: (event: Event) => void;
          onContextMenu: (event: ContextMenuEvent) => void;
        }>;
      };
    };
  }
}

import './global.scss';
import { createApp } from 'vue';
import { reloadActiveTab } from './utils';
import App from './App.vue';

createApp(App).mount(document.body);

addEventListener('keyup', (event) => event.key === 'F5' && reloadActiveTab(), { passive: true });
