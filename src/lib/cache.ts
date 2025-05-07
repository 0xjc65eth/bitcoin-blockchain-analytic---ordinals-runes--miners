/**
 * Cache Service
 * 
 * This service provides caching functionality for the application.
 * It includes methods for storing, retrieving, and invalidating cached data.
 */

import { loggerService } from './logger';

// Cache entry interface
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

// Cache configuration interface
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean; // Whether to return stale data while revalidating
}

// Predefined cache configurations
export const cacheConfigs = {
  short: { ttl: 60 * 1000 }, // 1 minute
  medium: { ttl: 5 * 60 * 1000 }, // 5 minutes
  long: { ttl: 30 * 60 * 1000 }, // 30 minutes
  hour: { ttl: 60 * 60 * 1000 }, // 1 hour
  day: { ttl: 24 * 60 * 60 * 1000 }, // 1 day
  week: { ttl: 7 * 24 * 60 * 60 * 1000 }, // 1 week
  month: { ttl: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  permanent: { ttl: Infinity }, // Never expires
  
  // Custom configurations for specific data types
  portfolioData: { ttl: 5 * 60 * 1000 }, // 5 minutes
  neuralInsights: { ttl: 15 * 60 * 1000 } // 15 minutes
};

// Cache service class
class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultConfig: CacheConfig = cacheConfigs.medium;
  private maxSize: number = 1000; // Maximum number of entries
  private hits: number = 0;
  private misses: number = 0;
  
  constructor() {
    loggerService.info('Cache service initialized');
  }
  
  /**
   * Set the default cache configuration
   */
  public setDefaultConfig(config: CacheConfig): void {
    this.defaultConfig = config;
  }
  
  /**
   * Get the default cache configuration
   */
  public getDefaultConfig(): CacheConfig {
    return { ...this.defaultConfig };
  }
  
  /**
   * Set the maximum cache size
   */
  public setMaxSize(size: number): void {
    this.maxSize = size;
    this.trimCache();
  }
  
  /**
   * Get the maximum cache size
   */
  public getMaxSize(): number {
    return this.maxSize;
  }
  
  /**
   * Get cache statistics
   */
  public getStats(): { size: number; hits: number; misses: number; hitRate: number } {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;
    
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate
    };
  }
  
  /**
   * Reset cache statistics
   */
  public resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }
  
  /**
   * Get a value from the cache
   * If the value is not in the cache or has expired, the factory function is called to get the value
   */
  public async get<T>(
    key: string,
    factory: () => Promise<T>,
    config: CacheConfig = this.defaultConfig
  ): Promise<T> {
    // Check if the value is in the cache and not expired
    const entry = this.cache.get(key);
    const now = Date.now();
    
    if (entry && entry.expiresAt > now) {
      // Cache hit
      this.hits++;
      loggerService.debug(`Cache hit for key: ${key}`);
      return entry.value as T;
    }
    
    // Cache miss
    this.misses++;
    loggerService.debug(`Cache miss for key: ${key}`);
    
    try {
      // Get the value from the factory function
      const value = await factory();
      
      // Store the value in the cache
      this.set(key, value, config);
      
      return value;
    } catch (error) {
      loggerService.error(`Error getting value for cache key: ${key}`, error);
      throw error;
    }
  }
  
  /**
   * Set a value in the cache
   */
  public set<T>(key: string, value: T, config: CacheConfig = this.defaultConfig): void {
    const now = Date.now();
    const expiresAt = config.ttl === Infinity ? Infinity : now + config.ttl;
    
    // Store the value in the cache
    this.cache.set(key, { value, expiresAt });
    
    // Trim the cache if it's too large
    if (this.cache.size > this.maxSize) {
      this.trimCache();
    }
    
    loggerService.debug(`Cache set for key: ${key}`);
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    const now = Date.now();
    
    return !!entry && entry.expiresAt > now;
  }
  
  /**
   * Delete a value from the cache
   */
  public delete(key: string): boolean {
    loggerService.debug(`Cache delete for key: ${key}`);
    return this.cache.delete(key);
  }
  
  /**
   * Clear all values from the cache
   */
  public clear(): void {
    this.cache.clear();
    loggerService.info('Cache cleared');
  }
  
  /**
   * Get all keys in the cache
   */
  public keys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  /**
   * Get the number of entries in the cache
   */
  public size(): number {
    return this.cache.size;
  }
  
  /**
   * Trim the cache to the maximum size
   * Removes the oldest entries first
   */
  private trimCache(): void {
    if (this.cache.size <= this.maxSize) {
      return;
    }
    
    // Get all keys sorted by expiration time (oldest first)
    const now = Date.now();
    const keys = Array.from(this.cache.entries())
      .filter(([_, entry]) => entry.expiresAt !== Infinity) // Don't remove permanent entries
      .sort(([_, a], [__, b]) => a.expiresAt - b.expiresAt)
      .map(([key, _]) => key);
    
    // Calculate how many entries to remove
    const removeCount = Math.max(0, this.cache.size - this.maxSize);
    
    // Remove the oldest entries
    for (let i = 0; i < removeCount && i < keys.length; i++) {
      this.cache.delete(keys[i]);
    }
    
    loggerService.debug(`Trimmed cache, removed ${removeCount} entries`);
  }
  
  /**
   * Remove expired entries from the cache
   */
  public removeExpired(): number {
    const now = Date.now();
    let removedCount = 0;
    
    // Convert to array before iterating to avoid TypeScript issues
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (entry.expiresAt !== Infinity && entry.expiresAt <= now) {
        this.cache.delete(key);
        removedCount++;
      }
    });
    
    if (removedCount > 0) {
      loggerService.debug(`Removed ${removedCount} expired cache entries`);
    }
    
    return removedCount;
  }
  
  /**
   * Start automatic cache cleanup
   */
  public startCleanupInterval(intervalMs: number = 60000): NodeJS.Timeout {
    loggerService.info(`Starting cache cleanup interval (${intervalMs}ms)`);
    
    return setInterval(() => {
      this.removeExpired();
    }, intervalMs);
  }
  
  /**
   * Invalidate cache entries by prefix
   */
  public invalidateByPrefix(prefix: string): number {
    let removedCount = 0;
    
    // Convert to array before iterating to avoid TypeScript issues
    Array.from(this.cache.keys()).forEach(key => {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        removedCount++;
      }
    });
    
    if (removedCount > 0) {
      loggerService.debug(`Invalidated ${removedCount} cache entries with prefix: ${prefix}`);
    }
    
    return removedCount;
  }
  
  /**
   * Invalidate cache entries by pattern
   */
  public invalidateByPattern(pattern: RegExp): number {
    let removedCount = 0;
    
    // Convert to array before iterating to avoid TypeScript issues
    Array.from(this.cache.keys()).forEach(key => {
      if (pattern.test(key)) {
        this.cache.delete(key);
        removedCount++;
      }
    });
    
    if (removedCount > 0) {
      loggerService.debug(`Invalidated ${removedCount} cache entries with pattern: ${pattern}`);
    }
    
    return removedCount;
  }
  
  /**
   * Get a value from the cache without using the factory function
   */
  public getValue<T>(key: string): T | null {
    const entry = this.cache.get(key);
    const now = Date.now();
    
    if (entry && entry.expiresAt > now) {
      return entry.value as T;
    }
    
    return null;
  }
  
  /**
   * Set a value in the cache with a specific expiration time
   */
  public setWithExpiry<T>(key: string, value: T, expiryMs: number): void {
    const now = Date.now();
    const expiresAt = now + expiryMs;
    
    // Store the value in the cache
    this.cache.set(key, { value, expiresAt });
    
    // Trim the cache if it's too large
    if (this.cache.size > this.maxSize) {
      this.trimCache();
    }
    
    loggerService.debug(`Cache set for key: ${key} with custom expiry`);
  }
}

// Export singleton instance
export const cacheService = new CacheService();
