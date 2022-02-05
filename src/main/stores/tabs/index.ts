import type { Schema } from 'electron-store';
import Store from 'electron-store';
import { defaultNewTab } from '../../../shared/consts';
import { userDataPath } from '../../consts';

export type Tab = {
  id: number;
  title: string;
  url: string;
  faviconUrl?: string;
  active?: boolean;
  loading?: boolean;
  loadInBackground?: boolean;
  children?: Tab[];
};

export const tabsStore = new Store({
  name: 'tabs',
  cwd: userDataPath,
  schema: <Schema<{ tabs: Tab[]; nextTabId: number }>>{
    tabs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
          faviconUrl: { type: 'string' },
          active: { type: 'boolean' },
          children: { type: 'array', $ref: '#' },
        },
      },
      default: [{ ...defaultNewTab, id: 0 }],
    },
    nextTabId: { type: 'number', default: 1 },
  },
});
