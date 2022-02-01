import Store from 'electron-store';
import type { Schema } from 'electron-store';
import { userDataPath } from '../../consts';

export type Tab = {
  title: string;
  url: string;
  active?: boolean;
  children?: Tab[];
};

export const tabsStore = new Store({
  name: 'tabs',
  cwd: userDataPath,
  schema: <Schema<{ tabs: Tab[] }>>{
    tabs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
          active: { type: 'boolean' },
          children: { type: 'array', $ref: '#' },
        },
      },
      default: [
        {
          title: 'New tab',
          url: 'browser://newtab',
          active: true,
        },
      ],
    },
  },
});
