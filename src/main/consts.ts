import type { Tab } from './stores/tabs';
import { join } from 'path';
import { app } from 'electron';

export const isDev = process.env.NODE_ENV === 'development';

export const cwd = process.cwd();

export const userDataPath = isDev ? join(process.cwd(), '..', 'userData') : app.getPath('userData');

export const defaultNewTab: Pick<Tab, 'title' | 'url' | 'active'> = {
  title: 'New tab',
  url: isDev ? 'http://localhost:9090/pages/newtab/index.html' : 'browser://newtab',
  active: true,
};
