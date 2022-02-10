import { request } from 'http';

export const parseUrl = (text: string) => {
  try {
    return new URL(text);
  } catch (_) {
    try {
      const url = new URL(`https://${text}`);
      if (url.hostname.includes('.')) return url;
    } catch (_) {}
  }
};

export const getUrl = (text: string) => parseUrl(text)?.href;

export const exists = (stringUrl: string) => {
  const url = parseUrl(stringUrl);
  if (!url) return false;

  return new Promise((resolve) => {
    const req = request({ method: 'HEAD', host: url.host, path: url.pathname }, (res) => {
      resolve(!/4\d\d/.test(`${res.statusCode}`));
    });
    req.on('error', () => resolve(false));
    req.end();
  });
};
