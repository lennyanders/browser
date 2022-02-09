import type { Tab } from '../main/modules/tabs';

export const isDev = import.meta.env.DEV;

export const defaultNewTab: Omit<Tab, 'id'> = {
  title: 'New tab',
  url: isDev ? 'http://localhost:9090/pages/newtab/index.html' : 'browser://newtab/',
};
