interface RobustStorage {
  hasItem(key: string, session?: boolean): boolean;
  getItem<T>(key: string, defaultValue: T, session?: boolean): T;
  setItem<T>(key: string, value: T, session?: boolean): void;
  removeItem(key: string, session?: boolean): void;
  clear(session?: boolean): void;
}

const fallbackLocalStorage: Record<string, unknown> = {};
const fallbackSessionStorage: Record<string, unknown> = {};

function getStorage(session?: boolean): Storage | Record<string, unknown> {
  if (typeof window === 'undefined') {
    return session ? fallbackSessionStorage : fallbackLocalStorage;
  }

  try {
    const storage = session ? window.sessionStorage : window.localStorage;
    storage.getItem('test'); // force an error if storage is off limits
    return storage;
  } catch (error) {
    console.warn('Storage is not available.', error); // eslint-disable-line no-console
    return session ? fallbackSessionStorage : fallbackLocalStorage;
  }
}

// TODO: Expand on this to handle object shapes.
function isTypeValid<T>(value: unknown, defaultValue: T): boolean {
  const expectedType = Array.isArray(defaultValue) ? 'array' : typeof defaultValue;

  if (expectedType === 'array') {
    return Array.isArray(value);
  }

  if (expectedType === 'object') {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  return typeof value === expectedType;
}

export const robustStorage: RobustStorage = {
  hasItem(key: string, session = false): boolean {
    try {
      const storage = getStorage(session);

      if (storage instanceof Storage) {
        return storage.getItem(key) !== null;
      }

      return key in storage;
    } catch (error) {
      console.warn('Failed to check if item exists.', error); // eslint-disable-line no-console
      return false;
    }
  },

  getItem<T>(key: string, defaultValue: T, session = false): T {
    try {
      const storage = getStorage(session);

      const raw = storage instanceof Storage ? storage.getItem(key) : storage[key];
      if (raw == null) {
        return defaultValue;
      }

      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;

      if (isTypeValid(parsed, defaultValue)) {
        return parsed as T;
      } else {
        throw new Error(`Invalid type. ${typeof defaultValue} (expected) ${typeof parsed} (actual)`);
      }
    } catch (error) {
      console.warn('Failed to get item.', error); // eslint-disable-line no-console
      return defaultValue;
    }
  },

  setItem<T>(key: string, value: T, session = false): void {
    try {
      const storage = getStorage(session);

      if (storage instanceof Storage) {
        storage.setItem(key, JSON.stringify(value));
      } else {
        storage[key] = JSON.stringify(value);
      }
    } catch (error) {
      console.warn('Failed to set item.', error); // eslint-disable-line no-console
    }
  },

  removeItem(key: string, session = false): void {
    try {
      const storage = getStorage(session);

      if (storage instanceof Storage) {
        storage.removeItem(key);
      } else {
        delete storage[key];
      }
    } catch (error) {
      console.warn('Failed to remove item.', error); // eslint-disable-line no-console
    }
  },

  clear(session = false): void {
    try {
      const storage = getStorage(session);

      if (storage instanceof Storage) {
        storage.clear();
      } else {
        for (const key in storage) {
          delete storage[key];
        }
      }
    } catch (error) {
      console.warn('Failed to clear storage.', error); // eslint-disable-line no-console
    }
  },
};
