export const getUrl = (text: string) => {
  try {
    return new URL(text).href;
  } catch (_) {
    try {
      const url = new URL(`https://${text}`);
      if (url.hostname.includes('.')) return url.href;

      return false;
    } catch (_) {
      return false;
    }
  }
};
