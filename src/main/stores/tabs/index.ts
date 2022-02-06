import { join } from 'path';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { defaultNewTab } from '../../../shared/consts';
import { userDataPath } from '../../consts';
import { createStore } from '../../utils/store';
import { debounce } from '../../utils/throttle';

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

type TabsStore = {
  tabs: Tab[];
  nextTabId: number;
};

const filePath = join(userDataPath, 'tabs.json');
let value: TabsStore;
try {
  value = JSON.parse(readFileSync(filePath, { encoding: 'utf-8' }));
  value.tabs.forEach((tab, index) => (tab.id = index));
  value.nextTabId = value.tabs.length;
} catch (_) {
  value = { tabs: [{ ...defaultNewTab, id: 0 }], nextTabId: 1 };
}

export const tabsStore = createStore(value);

tabsStore.on(
  debounce((value) => {
    try {
      mkdirSync(userDataPath, { recursive: true });
    } catch (_) {}

    const clone = JSON.parse(JSON.stringify(value)) as TabsStore;
    clone.tabs.forEach((tab) => {
      delete tab.loading;
      delete tab.loadInBackground;
      if (!tab.faviconUrl) delete tab.faviconUrl;
    });

    writeFileSync(filePath, JSON.stringify(clone), { encoding: 'utf-8' });
  }, 2500),
);
