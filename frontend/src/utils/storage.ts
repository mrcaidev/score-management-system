export function getLocalStorage<T>(key: string) {
  try {
    const text = localStorage.getItem(key);
    return text === null ? null : (JSON.parse(text) as T);
  } catch {
    return null;
  }
}

export function setLocalStorage(key: string, value: unknown) {
  try {
    if (value === undefined) {
      localStorage.removeItem(key);
      return;
    }

    const text = JSON.stringify(value);
    localStorage.setItem(key, text);
  } catch {
    return;
  }
}
