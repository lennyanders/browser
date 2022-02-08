import { tabsStore } from '.';

export const setActiveTab = (activeTabId: number) => tabsStore({ activeTabId });
