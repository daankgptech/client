// Simple in-memory cache utility with localStorage persistence
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes default

class Cache {
  constructor() {
    this.memory = new Map();
  }

  // Generate cache key
  static generateKey(url, params = {}) {
    const paramsStr = Object.keys(params).length > 0 
      ? JSON.stringify(params) 
      : '';
    return `${url}${paramsStr}`;
  }

  // Get cached data
  get(key) {
    // Check memory first
    const memoryItem = this.memory.get(key);
    if (memoryItem && Date.now() - memoryItem.timestamp < CACHE_DURATION) {
      return memoryItem.data;
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
          // Restore to memory
          this.memory.set(key, parsed);
          return parsed.data;
        }
        // Expired, remove from localStorage
        localStorage.removeItem(`cache_${key}`);
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }

    return null;
  }

  // Set cached data
  set(key, data, duration = CACHE_DURATION) {
    const item = {
      data,
      timestamp: Date.now(),
      duration
    };

    // Store in memory
    this.memory.set(key, item);

    // Store in localStorage
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (e) {
      console.warn('Cache write error:', e);
    }
  }

  // Clear specific cache
  clear(key) {
    this.memory.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
  }

  // Clear all cache
  clearAll() {
    this.memory.clear();
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith('cache_'))
        .forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.warn('Cache clear all error:', e);
    }
  }
}

// Singleton instance
const cache = new Cache();

// Hook for using cached API calls
export const useCachedApi = () => {
  const fetchWithCache = async (api, url, options = {}) => {
    const { 
      cache: useCache = true, 
      cacheDuration = CACHE_DURATION,
      params = {}
    } = options;

    const cacheKey = Cache.generateKey(url, params);

    // Return cached data if available
    if (useCache) {
      const cached = cache.get(cacheKey);
      if (cached) {
        return { data: cached, fromCache: true };
      }
    }

    // Fetch fresh data
    const response = await api.get(url, { params });
    const data = response.data;

    // Cache the data
    if (useCache) {
      cache.set(cacheKey, data, cacheDuration);
    }

    return { data, fromCache: false };
  };

  return { fetchWithCache, cache };
};

export { cache };
export default cache;
