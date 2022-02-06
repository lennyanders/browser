import { join } from 'path';
import { defaultNewTab } from '../../../shared/consts';
import { userDataPath } from '../../consts';
import { createStore } from '../../utils/store';

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

export const tabsStore = createStore<TabsStore>(join(userDataPath, 'tabs.json'), {
  defaultValue: { tabs: [{ ...defaultNewTab, id: 0 }], nextTabId: 1 },
  afterDeserialize(value) {
    value.tabs.forEach((tab, index) => (tab.id = index));
    value.nextTabId = value.tabs.length;
    return value;
  },
  beforeSerialize(value) {
    value.tabs.forEach((tab) => {
      delete tab.loading;
      delete tab.loadInBackground;
      if (!tab.faviconUrl) delete tab.faviconUrl;
    });
    return value;
  },
});
