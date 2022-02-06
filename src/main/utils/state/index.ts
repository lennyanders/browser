type Callback<T> = (newValue: T) => void;

export const createState = <T>(value: T) => {
  const callbacks: Callback<T>[] = [];

  const getterSetter = (newValue?: Partial<T>) => {
    if (typeof newValue === 'undefined') return value;

    value = Object.assign(value, newValue);
    callbacks.forEach((callback) => callback(value));
    return value;
  };

  getterSetter.on = (callback: Callback<T>) => {
    const callbackIndex = callbacks.push(callback);
    return () => callbacks.splice(callbackIndex, 1) as never as void;
  };

  return getterSetter;
};
