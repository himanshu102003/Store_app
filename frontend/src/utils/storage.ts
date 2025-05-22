type StorageType = 'local' | 'session';

const getStorage = (type: StorageType): Storage => {
  return type === 'local' ? localStorage : sessionStorage;
};

export const getItem = <T>(key: string, type: StorageType = 'local'): T | null => {
  try {
    const item = getStorage(type).getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item ${key} from ${type}Storage:`, error);
    return null;
  }
};

export const setItem = <T>(key: string, value: T, type: StorageType = 'local'): void => {
  try {
    const serializedValue = JSON.stringify(value);
    getStorage(type).setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting item ${key} in ${type}Storage:`, error);
  }
};

export const removeItem = (key: string, type: StorageType = 'local'): void => {
  try {
    getStorage(type).removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from ${type}Storage:`, error);
  }
};

export const clear = (type: StorageType = 'local'): void => {
  try {
    getStorage(type).clear();
  } catch (error) {
    console.error(`Error clearing ${type}Storage:`, error);
  }
};

export const getToken = (): string | null => {
  return getItem<string>('token') || null;
};

export const setToken = (token: string): void => {
  setItem('token', token);
};

export const removeToken = (): void => {
  removeItem('token');
};
