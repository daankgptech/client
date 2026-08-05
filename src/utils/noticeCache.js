const CACHE_KEY = "daankgp_notices_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Retrieve cached notices from localStorage if available.
 * Returns { data: Array, isExpired: boolean } or null if no cache.
 */
export const getCachedNotices = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data)) return null;

    const isExpired = Date.now() - (parsed.timestamp || 0) > CACHE_TTL;
    return {
      data: parsed.data,
      isExpired,
    };
  } catch (err) {
    console.warn("Error reading notices from localStorage cache:", err);
    return null;
  }
};

/**
 * Save notices array to localStorage cache with timestamp.
 */
export const setCachedNotices = (data) => {
  try {
    const cacheObject = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
  } catch (err) {
    console.warn("Error saving notices to localStorage cache:", err);
  }
};

/**
 * Clear cached notices from localStorage.
 */
export const clearCachedNotices = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (err) {
    console.warn("Error clearing notices cache:", err);
  }
};
