import type { Tab } from '../main/modules/tabs';

export const isDev = import.meta.env.DEV;

export const defaultNewTab: Pick<Tab, 'title' | 'url' | 'active'> = {
  title: 'New tab',
  url: isDev ? 'http://localhost:9090/pages/newtab/index.html' : 'browser://newtab/',
  active: true,
};
