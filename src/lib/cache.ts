import { LRUCache } from 'lru-cache';

// Configuração do cache
const CACHE_CONFIG = {
  max: 500, // Número máximo de itens no cache
  ttl: 1000 * 60 * 5, // Tempo de vida dos itens (5 minutos)
  updateAgeOnGet: true, // Atualiza a idade do item quando acessado
};

// Cache para dados de mercado
export const marketCache = new LRUCache<string, any>(CACHE_CONFIG);

// Cache para dados de mineração
export const minerCache = new LRUCache<string, any>(CACHE_CONFIG);

// Cache para dados do mempool
export const mempoolCache = new LRUCache<string, any>(CACHE_CONFIG);

// Cache para coleções
export const collectionsCache = new LRUCache<string, any>(CACHE_CONFIG);

// Cache para previsões neurais
export const neuralCache = new LRUCache<string, any>(CACHE_CONFIG);

// Cache para sinais
export const signalsCache = new LRUCache<string, any>(CACHE_CONFIG);

// Função genérica para obter dados do cache ou buscar da API
export const fetchWithCache = async <T>(
  key: string,
  cache: LRUCache<string, any>,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  // Verificar se os dados estão no cache
  const cachedData = cache.get(key);
  if (cachedData) {
    return cachedData as T;
  }

  // Buscar dados da API
  const data = await fetchFn();
  
  // Armazenar no cache
  cache.set(key, data, { ttl: ttl || CACHE_CONFIG.ttl });
  
  return data;
};

// Função para limpar todos os caches
export const clearAllCaches = () => {
  marketCache.clear();
  minerCache.clear();
  mempoolCache.clear();
  collectionsCache.clear();
  neuralCache.clear();
  signalsCache.clear();
};

// Função para obter estatísticas do cache
export const getCacheStats = () => {
  return {
    market: {
      size: marketCache.size,
      max: marketCache.max,
    },
    miner: {
      size: minerCache.size,
      max: minerCache.max,
    },
    mempool: {
      size: mempoolCache.size,
      max: mempoolCache.max,
    },
    collections: {
      size: collectionsCache.size,
      max: collectionsCache.max,
    },
    neural: {
      size: neuralCache.size,
      max: neuralCache.max,
    },
    signals: {
      size: signalsCache.size,
      max: signalsCache.max,
    },
  };
}; 