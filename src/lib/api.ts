import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosError, AxiosRequestConfig } from 'axios'
import DOMPurify from 'dompurify'
import { getCachedData, setCachedData, withCache } from './cache'

declare global {
  interface Date {
    toRelativeTimeString(): string;
  }
}

// Custom type for axios config with retry options
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: number;
  retryDelay?: number;
}

// API Configuration
export const API_CONFIG = {
  ordiscan: {
    baseUrl: process.env.NEXT_PUBLIC_ORDISCAN_API_URL || 'https://ordiscan.com/api/v1',
    apiKey: process.env.NEXT_PUBLIC_ORDISCAN_API_KEY || '',
    endpoints: {
      collections: '/collections',
      runes: '/runes',
      inscriptions: (address: string) => `/address/${address}/inscriptions`,
    },
  },
  mempool: {
    baseUrl: 'https://mempool.space/api',
    endpoints: {
      miners: '/v1/mining/hashrate/1d',
      blocks: '/blocks',
      fees: '/v1/fees/recommended',
      historicalStats: '/v1/mining/hashrate/3d'
    },
  },
  blockstream: {
    baseUrl: 'https://blockstream.info/api',
    endpoints: {
      price: '/price',
      transactions: (address: string) => `/address/${address}/txs`,
    },
  },
  sentimentAnalysis: {
    baseUrl: 'https://sentiment-analysis2.p.rapidapi.com/sentiment',
    apiKey: process.env.NEXT_PUBLIC_SENTIMENT_API_KEY || '',
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_SENTIMENT_API_KEY || '',
      'X-RapidAPI-Host': 'sentiment-analysis2.p.rapidapi.com',
    },
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  ORDISCAN: {
    BASE_URL: 'https://api.ordiscan.com/v1',
    COLLECTIONS: '/collections',
    RUNES: '/runes',
    INSCRIPTIONS: '/inscriptions'
  },
  MEMPOOL: {
    BASE_URL: 'https://mempool.space/api/v1',
    FEES: '/fees/recommended',
    MEMPOOL: '/mempool',
    BLOCKS: '/blocks'
  },
  BLOCKSTREAM: {
    BASE_URL: 'https://blockstream.info/api',
    ADDRESS: '/address',
    TRANSACTION: '/tx'
  }
}

// Interfaces
export interface MinerData {
  id: string;
  name: string;
  supply: number;
  holders: number;
  hashrate: number;
  networkPercentage: number;
  lastBlock: number;
  decentralizationIndex?: number;
}

export interface Transaction {
  txid: string;
  value: number;
  fee: number;
  timestamp: string;
  size: number;
  status?: {
    block_height?: number;
    block_time?: number;
  };
  vin?: Array<{
    prevout?: {
      value?: number;
    };
  }>;
  vout?: Array<{
    value?: number;
  }>;
}

export interface Ordinal {
  id: string
  inscription: string
  content: string
  owner: string
  value: number
}

export interface Inscription {
  id: string
  number: number
  content: string
  contentType: string
  timestamp: string
  owner: string
  size: number
}

export interface Collection {
  id: string
  name: string
  description: string
  totalSupply: number
  floorPrice: number
  volume24h: number
  createdAt: string
}

export interface RuneInfo {
  symbol: string
  supply: number
  holders: number
  price: number
  marketCap: number
  volume24h: number
  transactions24h: number
}

export interface MarketData {
  id: string
  name: string
  price: number
  change24h: number
  volume: number
  marketCap: number
  lastTrade: string
  highestSale: number
  totalVolume: number
  listedCount: number
  uniqueHolders: number
}

export interface WhaleAlert {
  id: string
  type: 'sale' | 'mint' | 'transfer' | 'hashrate_shift' | 'inscription_fee'
  collection?: string
  price?: number
  from: string
  to: string
  timestamp: string
  txHash: string
  details: string
}

export interface Signal {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  timestamp: string
  data: any
}

export interface Rune {
  id: string
  name: string
  symbol: string
  totalSupply: number
  holders: number
  createdAt: string
}

export interface NetworkStats {
  blockHeight: number
  difficulty: number
  hashRate: number
  mempoolSize: number
  averageFee: number
  timestamp: string
}

// API Response Interfaces
export interface CollectionItem {
  id: string;
  name: string;
  floorPrice: number;
  volume: number;
  rareSats?: string;
  content_url?: string;
}

export interface RuneItem {
  id: string;
  name: string;
  floorPrice: number;
  volume: number;
}

export interface MempoolStats {
  size: number;
  count: number;
  feeRate: number;
}

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  retryAfter?: number;
}

// API Client with proper configuration
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  if (config.url?.includes('ordiscan.com') && API_CONFIG.ordiscan.apiKey) {
    config.headers.Authorization = `Bearer ${API_CONFIG.ordiscan.apiKey}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message,
      status: error.response?.status,
      code: error.code,
    };

    if (error.response?.status === 429) {
      apiError.retryAfter = parseInt(error.response.headers['retry-after'] || '60');
    }

    return Promise.reject(apiError);
  }
);

/**
 * Normalize API response to handle various formats
 * @param response - API response data
 * @param expectArray - Whether to expect an array response
 * @returns Normalized data
 */
const normalizeResponse = <T>(response: any, expectArray: boolean = false): T => {
  // Log response for debugging
  console.log('API Response:', response);

  if (expectArray) {
    if (Array.isArray(response)) {
      return response as T;
    }
    if (response && typeof response === 'object') {
      if (Array.isArray(response.data)) {
        return response.data as T;
      }
      if (Array.isArray(response.results)) {
        return response.results as T;
      }
      if (Array.isArray(response.items)) {
        return response.items as T;
      }
    }
    console.warn('Expected array response but received:', response);
    return [] as unknown as T;
  }

  return response as T;
};

/**
 * Fetch data from API with caching and error handling
 * @param url - API URL
 * @param cacheKey - Cache key
 * @param cacheTTL - Cache time-to-live in milliseconds
 * @param config - Axios request config
 * @param expectArray - Whether to expect an array response
 * @returns Fetched data
 */
export const fetchWithCache = async <T>(
  url: string,
  cacheKey: string,
  cacheTTL: number,
  config: AxiosRequestConfig = {},
  expectArray: boolean = false
): Promise<T> => {
  try {
    // Check cache first
    const cachedData = getCachedData<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Make API request
    const response = await apiClient.request<T>({
      url,
      ...config,
    });

    // Normalize and cache response
    const data = normalizeResponse<T>(response.data, expectArray);
    setCachedData(cacheKey, data, cacheTTL);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error as ApiError;
      console.error('API Error:', apiError);
      throw apiError;
    }
    throw error;
  }
};

// API Functions with proper error handling and type validation
export const fetchMinerData = async (): Promise<MinerData[]> => {
  try {
    const response = await apiClient.get(`${API_CONFIG.mempool.baseUrl}${API_CONFIG.mempool.endpoints.miners}`);
    const data = normalizeResponse<any[]>(response.data, true);

    return data.map((miner: any) => ({
      id: miner.pool,
      name: miner.pool || 'Unknown Miner',
      supply: miner.hashrate || 0,
      holders: miner.share || 0,
      hashrate: miner.hashrate || 0,
      networkPercentage: miner.share || 0,
      lastBlock: miner.lastBlock || 0,
      decentralizationIndex: calculateDecentralizationIndex(miner.share)
    }));
  } catch (error) {
    throw error;
  }
};

export const fetchRecentTransactions = async (address: string): Promise<Transaction[]> => {
  const url = `${API_CONFIG.blockstream.baseUrl}${API_CONFIG.blockstream.endpoints.transactions(address)}`;
  const cacheKey = `transactions_${address}`;
  const cacheTTL = 5 * 60 * 1000; // 5 minutes

  const data = await fetchWithCache<Transaction[]>(url, cacheKey, cacheTTL, {}, true);
  return data.map((tx) => ({
    txid: tx.txid,
    value: tx.vout?.reduce((sum, output) => sum + (output.value || 0), 0) || 0,
    fee: tx.fee || 0,
    timestamp: tx.status?.block_time ? new Date(tx.status.block_time * 1000).toISOString() : new Date().toISOString(),
    size: tx.size || 0,
  }));
};

export const fetchOrdinalsByAddress = withCache(async (address: string): Promise<Ordinal[]> => {
  try {
    const sanitizedAddress = DOMPurify.sanitize(address);
    const { data } = await apiClient.get(`https://ordinals.com/inscriptions/address/${sanitizedAddress}`);
    const ordinals = normalizeResponse<any[]>(data, true);

    return ordinals.map((ordinal: any) => ({
      id: ordinal.id || '',
      inscription: ordinal.inscription || '',
      content: ordinal.content || '',
      owner: ordinal.owner || '',
      value: ordinal.value || 0,
    }));
  } catch (error) {
    throw error;
  }
}, (address: string) => `ordinals:${address}`, 300);

export const fetchLatestInscriptions = withCache(async (): Promise<Inscription[]> => {
  try {
    const { data } = await apiClient.get<{ results: any[] }>('https://api.hiro.so/ordinals/v1/inscriptions?limit=20');
    const results = normalizeResponse<{ results: any[] }>(data, true).results;

    return results.map((inscription: any) => ({
      id: inscription.id || '',
      number: inscription.number || 0,
      content: `https://ordinals.com/content/${inscription.id}`,
      contentType: inscription.content_type || '',
      timestamp: new Date(inscription.timestamp).toRelativeTimeString(),
      owner: inscription.address || '',
      size: inscription.content_length || 0
    }));
  } catch (error) {
    throw error;
  }
}, 'latestInscriptions', 60);

export const fetchCollections = withCache(async (): Promise<Collection[] | undefined> => {
  try {
    const response = await apiClient.get(`${API_CONFIG.ordiscan.baseUrl}${API_CONFIG.ordiscan.endpoints.collections}`)
    return response.data
  } catch (error) {
    throw error;
  }
}, 'collections', 300)

export const fetchCollectionFloorPrice = withCache(async (collectionId: string): Promise<number | undefined> => {
  try {
    const response = await apiClient.get(`/api/collections/${collectionId}/floor-price`)
    return response.data.floorPrice
  } catch (error) {
    throw error;
  }
}, (collectionId: string) => `floorPrice:${collectionId}`, 300)

export const fetchTransactions = withCache(async (limit: number = 10): Promise<any[] | undefined> => {
  try {
    const response = await apiClient.get(`/api/transactions?limit=${limit}`)
    return response.data
  } catch (error) {
    throw error;
  }
}, (limit: number) => `transactions:${limit}`, 60)

export const fetchWhaleAlerts = withCache(async (): Promise<WhaleAlert[] | undefined> => {
  try {
    const response = await apiClient.get(`https://api-mainnet.magiceden.dev/v2/activities?limit=50&type=sale,mint,transfer&minValue=100`)
    return response.data.map((activity: any) => ({
      id: activity.id,
      type: activity.type,
      collection: activity.collection,
      price: activity.price,
      from: activity.from,
      to: activity.to,
      timestamp: new Date(activity.timestamp).toRelativeTimeString(),
      txHash: activity.txHash,
      details: generateAlertDetails(activity)
    }))
  } catch (error) {
    throw error;
  }
}, 'whaleAlerts', 60)

export const fetchMarketData = withCache(async (): Promise<MarketData[] | undefined> => {
  try {
    const [collectionsResponse, btcResponse] = await Promise.all([
      apiClient.get(`https://api-mainnet.magiceden.dev/v2/collections/popular`),
      apiClient.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`)
    ])

    const collections = collectionsResponse.data
    const btcData = btcResponse.data.bitcoin

    return collections.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.floorPrice,
      change24h: item.priceChange24h,
      volume: item.volume24h,
      marketCap: item.marketCap,
      lastTrade: new Date(item.lastTradeTime).toRelativeTimeString(),
      highestSale: item.highestSale,
      totalVolume: item.totalVolume,
      listedCount: item.listedCount,
      uniqueHolders: item.uniqueHolders
    }))
  } catch (error) {
    throw error;
  }
}, 'marketData', 60)

export const fetchBitcoinPrice = withCache(async (): Promise<number | undefined> => {
  try {
    const response = await apiClient.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    return response.data.bitcoin.usd
  } catch (error) {
    throw error;
  }
}, 'bitcoinPrice', 60)

export const fetchRunes = withCache(async (): Promise<Rune[] | undefined> => {
  try {
    const response = await apiClient.get(`${API_CONFIG.ordiscan.baseUrl}${API_CONFIG.ordiscan.endpoints.runes}`)
    return response.data
  } catch (error) {
    throw error;
  }
}, 'runes', 300)

export const fetchNetworkStats = withCache(async (): Promise<NetworkStats | undefined> => {
  try {
    const [mempoolResponse, blocksResponse] = await Promise.all([
      apiClient.get(`${API_CONFIG.mempool.baseUrl}${API_CONFIG.mempool.endpoints.blocks}`),
      apiClient.get(`${API_CONFIG.mempool.baseUrl}${API_CONFIG.mempool.endpoints.blocks}`)
    ])

    return {
      blockHeight: blocksResponse.data[0].height,
      difficulty: blocksResponse.data[0].difficulty,
      hashRate: blocksResponse.data[0].extras.avgHashRate,
      mempoolSize: mempoolResponse.data.count,
      averageFee: mempoolResponse.data.total_fee / mempoolResponse.data.vsize,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    throw error;
  }
}, 'networkStats', 60)

export const fetchBTCPrice = withCache(async (): Promise<number | undefined> => {
  try {
    const response = await apiClient.get(`${API_CONFIG.blockstream.baseUrl}${API_CONFIG.blockstream.endpoints.price}`)
    return response.data.last
  } catch (error) {
    throw error;
  }
}, 'btcPrice', 60)

export const fetchAddressTransactions = withCache(async (address: string): Promise<Transaction[] | undefined> => {
  try {
    const response = await apiClient.get(`${API_CONFIG.blockstream.baseUrl}${API_CONFIG.blockstream.endpoints.transactions(address)}`)
    return response.data.map((tx: any) => ({
      txid: tx.txid,
      blockHeight: tx.status.block_height,
      timestamp: tx.status.block_time,
      fee: tx.fee,
      size: tx.size,
      inputs: tx.vin.map((input: any) => ({
        address: input.prevout.scriptpubkey_address,
        value: input.prevout.value
      })),
      outputs: tx.vout.map((output: any) => ({
        address: output.scriptpubkey_address,
        value: output.value
      }))
    }))
  } catch (error) {
    throw error;
  }
}, (address: string) => `addressTxs:${address}`, 300)

export const fetchAddressInscriptions = withCache(async (address: string): Promise<any[] | undefined> => {
  try {
    const response = await apiClient.get(`${API_CONFIG.ordiscan.baseUrl}${API_CONFIG.ordiscan.endpoints.inscriptions(address)}`)
    return response.data
  } catch (error) {
    throw error;
  }
}, (address: string) => `addressInscriptions:${address}`, 300)

// Helper Functions
function calculateDecentralizationIndex(share: number): number {
  return Math.max(0, 100 - (share * 100));
}

function generateAlertDetails(activity: any): string {
  const amount = activity.price ? `${activity.price} BTC` : '';
  switch (activity.type) {
    case 'sale':
      return `Sale of ${activity.collection} for ${amount}`;
    case 'mint':
      return `New mint in ${activity.collection}`;
    case 'transfer':
      return `Transfer of ${activity.collection}`;
    case 'hashrate_shift':
      return `Significant hashrate change: ${activity.details}`;
    case 'inscription_fee':
      return `High inscription fee: ${amount}`;
    default:
      return '';
  }
}

// Add a polyfill for toRelativeTimeString if it doesn't exist
if (!Date.prototype.toRelativeTimeString) {
  Date.prototype.toRelativeTimeString = function() {
    const now = new Date();
    const diffMs = now.getTime() - this.getTime();
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
}

/**
 * Analyze sentiment of a text using Sentiment Analysis 2 API
 * @param text - Text to analyze
 * @returns Sentiment result
 */
export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  const url = API_CONFIG.sentimentAnalysis.baseUrl;
  const cacheKey = `sentiment_${text}`;
  const cacheTTL = 5 * 60 * 1000; // 5 minutes

  const cachedData = getCachedData<SentimentResult>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const config: AxiosRequestConfig = {
    method: 'POST',
    headers: API_CONFIG.sentimentAnalysis.headers,
    data: { text },
  };

  const data = await fetchWithCache<SentimentResult>(url, cacheKey, cacheTTL, config);
  return {
    sentiment: data.sentiment || 'neutral',
    score: data.score || 0,
  };
};

/**
 * Sanitize input to prevent XSS
 * @param input - Input string
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
}; 