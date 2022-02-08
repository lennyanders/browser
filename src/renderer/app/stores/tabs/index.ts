import { getToReactive } from '../../utils';

export const tabsStore = getToReactive(window.browser.tabs.getAll);
