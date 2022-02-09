import { Tab, tabsStore } from '.';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export const setActiveTab = (activeTabId: number) => tabsStore({ activeTabId });

export const createTab = (
  partialTab: Optional<Omit<Tab, 'id'>, 'title'>,
  active?: boolean,
  end?: boolean,
) => {
  const { tabs, activeTabId, nextTabId } = tabsStore();
  const newTab = {
    ...partialTab,
    title: partialTab.title || partialTab.url,
    loadInBackground: true,
    id: nextTabId,
  };

  if (end) tabs.push(newTab);
  else tabs.splice(tabs.findIndex((tab) => tab.id === activeTabId) + 1, 0, newTab);

  tabsStore({ tabs, activeTabId: active ? nextTabId : activeTabId, nextTabId: nextTabId + 1 });
};
