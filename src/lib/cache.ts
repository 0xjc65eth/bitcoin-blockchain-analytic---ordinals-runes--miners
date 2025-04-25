import { LRUCache } from 'lru-cache';

// Cache statistics
interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  maxSize: number;
}

// Cache configuration
const cacheConfig = {
  max: 500, // Maximum number of items
  maxSize: 5000000, // Maximum size in bytes (5MB)
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  updateAgeOnGet: true, // Reset TTL on access
  sizeCalculation: (value: any) => {
    // Calculate size based on value type
    if (typeof value === 'string') return value.length;
    if (typeof value === 'object') return JSON.stringify(value).length;
    return 1;
  },
  dispose: (key: string, value: any) => {
    // Cleanup function for disposed items
    if (value && typeof value.dispose === 'function') {
      value.dispose();
    }
  }
};

// Create cache instance with proper typing
const cache = new LRUCache<string, any>(cacheConfig);

// Cache statistics tracking
let hits = 0;
let misses = 0;

/**
 * Get cached data by key
 * @param key - Cache key
 * @returns Cached data or null if not found
 */
export const getCachedData = <T>(key: string): T | null => {
  const value = cache.get(key) as T | null;
  if (value !== null) {
    hits++;
    console.debug(`Cache hit for key: ${key}`);
  } else {
    misses++;
    console.debug(`Cache miss for key: ${key}`);
  }
  return value;
};

/**
 * Set data in cache
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Optional time-to-live in milliseconds
 */
export const setCachedData = <T>(key: string, data: T, ttl?: number): void => {
  cache.set(key, data, { ttl });
};

/**
 * Check if cache has key
 * @param key - Cache key
 * @returns True if key exists in cache
 */
export const hasCachedData = (key: string): boolean => {
  return cache.has(key);
};

/**
 * Clear cache
 */
export const clearCache = (): void => {
  cache.clear();
  hits = 0;
  misses = 0;
};

/**
 * Get cache statistics
 * @returns Cache statistics
 */
export const getCacheStats = (): CacheStats => {
  const totalRequests = hits + misses;
  return {
    hits,
    misses,
    hitRate: totalRequests > 0 ? hits / totalRequests : 0,
    size: cache.size,
    maxSize: cacheConfig.maxSize
  };
};

/**
 * Cache wrapper for async functions
 * @param fn - Async function to cache
 * @param key - Cache key or function to generate key
 * @param ttl - Optional time-to-live in milliseconds
 * @returns Cached function result
 */
export const withCache = <T>(
  fn: (...args: any[]) => Promise<T>,
  key: string | ((...args: any[]) => string),
  ttl?: number
) => {
  return async (...args: any[]): Promise<T> => {
    const cacheKey = typeof key === 'function' ? key(...args) : key;
    const cached = getCachedData<T>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await fn(...args);
    setCachedData(cacheKey, result, ttl);
    return result;
  };
}; 