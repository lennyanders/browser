export const debounce = <T extends any[]>(fn: (...args: T) => void, ms: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: T) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => fn(...args), ms);
  };
};
