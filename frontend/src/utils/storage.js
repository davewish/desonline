/**
 * Safe localStorage access utility
 * Handles cases where localStorage is disabled or inaccessible
 * Falls back to in-memory storage if localStorage is not available
 */

let storageAvailable = true;
const memoryStore = {}; // Fallback in-memory storage

// Check if localStorage is available on first import
try {
  const test = "__localStorage_test__";
  window.localStorage.setItem(test, test);
  window.localStorage.removeItem(test);
} catch (err) {
  // Storage not available (privacy mode, sandboxed, etc) - use memory storage
  console.error("localStorage NOT available, using in-memory storage:", err);
  storageAvailable = false;
}

export const storage = {
  /**
   * Get item from storage
   */
  getItem: (key) => {
    if (!storageAvailable) {
      return memoryStore[key] || null;
    }

    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      console.error(`getItem error for ${key}:`, err);
      return memoryStore[key] || null;
    }
  },

  /**
   * Set item in storage
   */
  setItem: (key, value) => {
    if (!storageAvailable) {
      memoryStore[key] = value;
      return;
    }

    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      console.error(`setItem error for ${key}:`, err);
      memoryStore[key] = value;
    }
  },

  /**
   * Remove item from storage
   */
  removeItem: (key) => {
    if (!storageAvailable) {
      delete memoryStore[key];
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.error(`removeItem error for ${key}:`, err);
      delete memoryStore[key];
    }
  },

  /**
   * Check if storage is available
   */
  isAvailable: () => storageAvailable,
};

export default storage;
