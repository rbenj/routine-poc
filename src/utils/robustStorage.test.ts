import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { robustStorage } from './robustStorage';

describe('robustStorage', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
    [Symbol.iterator]: function* () {
      yield* Object.keys(this);
    },
  };

  const mockSessionStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
    [Symbol.iterator]: function* () {
      yield* Object.keys(this);
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Create a mock window object if it doesn't exist
    if (typeof window === 'undefined') {
      // @ts-expect-error - Creating mock window for testing
      global.window = {};
    }

    // Set up the Storage prototype
    if (typeof Storage === 'undefined') {
      // Create mock Storage for testing
      global.Storage = class Storage {
        getItem() { return null; }
        setItem() { }
        removeItem() { }
        clear() { }
        key() { return null; }
        get length() { return 0; }
        [Symbol.iterator]() { return [][Symbol.iterator](); }
      };
    }

    // Make our mocks inherit from Storage
    Object.setPrototypeOf(mockLocalStorage, Storage.prototype);
    Object.setPrototypeOf(mockSessionStorage, Storage.prototype);

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up the mock window object
    if (typeof window !== 'undefined') {
      // @ts-expect-error - Cleaning up mock window after testing
      delete global.window;
    }
  });

  describe('hasItem', () => {
    it('returns true when item exists in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('value');
      expect(robustStorage.hasItem('key')).toBe(true);
    });

    it('returns true when item exists in sessionStorage', () => {
      mockSessionStorage.getItem.mockReturnValue('value');
      expect(robustStorage.hasItem('key', true)).toBe(true);
    });

    it('returns false when item does not exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      expect(robustStorage.hasItem('key')).toBe(false);
    });
  });

  describe('getItem', () => {
    it('returns default value when item does not exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      expect(robustStorage.getItem('key', 'default')).toBe('default');
    });

    it('returns parsed value when item exists', () => {
      mockLocalStorage.getItem.mockReturnValue('"value"');
      expect(robustStorage.getItem('key', '')).toBe('value');
    });

    it('validates type of returned value', () => {
      mockLocalStorage.getItem.mockReturnValue('"value"');
      expect(robustStorage.getItem('key', 0)).toBe(0); // Type mismatch
    });

    it('handles session storage', () => {
      mockSessionStorage.getItem.mockReturnValue('"value"');
      expect(robustStorage.getItem('key', '', true)).toBe('value');
    });
  });

  describe('setItem', () => {
    it('sets item in localStorage', () => {
      robustStorage.setItem('key', 'value');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', '"value"');
    });

    it('sets item in sessionStorage', () => {
      robustStorage.setItem('key', 'value', true);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('key', '"value"');
    });

    it('handles complex objects', () => {
      const value = { a: 1, b: 'test' };
      robustStorage.setItem('key', value);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(value));
    });
  });

  describe('removeItem', () => {
    it('removes item from localStorage', () => {
      robustStorage.removeItem('key');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('key');
    });

    it('removes item from sessionStorage', () => {
      robustStorage.removeItem('key', true);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('key');
    });
  });

  describe('clear', () => {
    it('clears localStorage', () => {
      robustStorage.clear();
      expect(mockLocalStorage.clear).toHaveBeenCalled();
    });

    it('clears sessionStorage', () => {
      robustStorage.clear(true);
      expect(mockSessionStorage.clear).toHaveBeenCalled();
    });
  });

  describe('fallback behavior', () => {
    it('uses fallback storage when window is undefined', () => {
      const originalWindow = global.window;
      const originalLocalStorage = window.localStorage;

      const mockWindow = Object.create(window);
      Object.defineProperty(mockWindow, 'localStorage', {
        get: () => { throw new Error('Storage not available'); },
        configurable: true,
      });
      (globalThis as typeof globalThis & { window: typeof window }).window = mockWindow;

      try {
        robustStorage.setItem('key', 'value');
        const result = robustStorage.getItem('key', '');
        expect(result).toBe('value');
        robustStorage.setItem('key2', 'value2');
        expect(robustStorage.getItem('key', '')).toBe('value');
        expect(robustStorage.getItem('key2', '')).toBe('value2');
      } finally {
        (globalThis as typeof globalThis & { window: typeof window }).window = originalWindow;
        Object.defineProperty(window, 'localStorage', {
          value: originalLocalStorage,
          writable: true,
          configurable: true,
        });
      }
    });

    it('uses fallback storage when storage is not available', () => {
      const originalLocalStorage = window.localStorage;
      const nonStorage = new Proxy({}, {
        get: () => { throw new Error('Storage not available'); },
      });
      Object.defineProperty(window, 'localStorage', {
        get: () => nonStorage,
        configurable: true,
      });

      try {
        robustStorage.setItem('key', 'value');
        const result = robustStorage.getItem('key', '');
        expect(result).toBe('value');
        robustStorage.setItem('key2', 'value2');
        expect(robustStorage.getItem('key', '')).toBe('value');
        expect(robustStorage.getItem('key2', '')).toBe('value2');
      } finally {
        Object.defineProperty(window, 'localStorage', {
          value: originalLocalStorage,
          writable: true,
          configurable: true,
        });
      }
    });
  });
});
