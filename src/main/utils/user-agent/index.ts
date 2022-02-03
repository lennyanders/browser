// stolen from https://github.com/wexond/browser-base/blob/master/src/main/user-agent.ts

import { app } from 'electron';

const CHROME_COMPONENT_PATTERN = / Chrome\\?.([^\s]+)/g;
const COMPONENTS_TO_REMOVE = [/ Electron\\?.([^\s]+)/g, ` ${app.name}/${app.getVersion()}`];

// TODO(sentialx): script to update stable Chrome version?
const COMPONENTS_TO_REPLACE: [string | RegExp, string][] = [
  [CHROME_COMPONENT_PATTERN, ' Chrome/87.0.4280.88'],
];

/**
 * Checks if a given url is suitable for removal of Chrome
 * component from the user agent string.
 * @param url
 */
const shouldRemoveChromeString = (url: string) => {
  return [/^https:\/\/accounts\.google\.com(\/|$)/].some((pattern) => url.match(pattern));
};

export const getUserAgentForUrl = (userAgent: string, url: string) => {
  let componentsToRemove = [...COMPONENTS_TO_REMOVE];

  // For accounts.google.com, we remove Chrome/*.* component
  // from the user agent, to fix compatibility issues on Google Sign In.
  // WATCH: https://developers.googleblog.com/2020/08/guidance-for-our-effort-to-block-less-secure-browser-and-apps.html
  if (shouldRemoveChromeString(url)) {
    componentsToRemove = [...componentsToRemove, CHROME_COMPONENT_PATTERN];
  }

  // Replace the components.
  [
    // Convert components to remove to pairs.
    ...componentsToRemove.map((x): [string | RegExp, string] => [x, '']),
    ...COMPONENTS_TO_REPLACE,
  ].forEach((x) => (userAgent = userAgent.replace(x[0], x[1])));

  return userAgent;
};
