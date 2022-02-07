import { Tab, tabsStore } from '.';

export const setActiveTab = (tabs: Tab[], index: number, cycle = false) => {
  if (index < 0) {
    if (!cycle) return;
    index = tabs.length - 1;
  } else if (index >= tabs.length) {
    if (!cycle) return;
    index = 0;
  }

  tabs.forEach((tab, i) => (tab.active = i === index));
  tabsStore({ tabs });
};
