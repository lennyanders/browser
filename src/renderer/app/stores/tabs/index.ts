import { getToRef } from '../../utils';

export const tabsStore = getToRef(window.browser.tabs.getAll);
