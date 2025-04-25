import { LRUCache } from "lru-cache";
import { z } from "zod";

const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export const fetchWithCache = async (url: string, schema: z.ZodType<any>, options: RequestInit = {}) => {
  const cached = cache.get(url);
  if (cached) return cached;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ORDISCAN_API_KEY || process.env.NEXT_PUBLIC_MAGICEDEN_API_KEY || ""}`,
          ...options.headers,
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      const data = await response.json();
      const validatedData = schema.parse(data);
      cache.set(url, validatedData);
      return validatedData;
    } catch (error) {
      if (attempt === 3) {
        console.error(`Failed to fetch ${url} after 3 attempts: ${error}`);
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  return null;
};

const syncData = async (fetchFn: () => Promise<any>, key: string) => {
  const data = await fetchFn();
  if (data) cache.set(key, data);
  setTimeout(() => syncData(fetchFn, key), 1000 * 60 * 5);
};

export const fetchCollections = () => fetchWithCache(
  "https://api.ordiscan.com/v1/collections",
  z.array(z.object({ id: z.string(), name: z.string(), floorPrice: z.number().or(z.string()), volume24h: z.number(), volume7d: z.number(), image: z.string() }))
);

export const fetchMempool = () => fetchWithCache(
  "https://mempool.space/api/mempool",
  z.object({ size: z.number(), count: z.number(), feeRate: z.number() })
);

export const fetchMinerData = () => fetchWithCache(
  "/api/miner",
  z.object({ avgHashrate: z.number(), blocks: z.array(z.object({ height: z.number(), timestamp: z.number(), miner: z.string(), transactionCount: z.number() })), difficulty: z.number(), blockTime: z.number() })
);

export const fetchMarketData = () => fetchWithCache(
  "https://api.magiceden.io/v1/stats",
  z.object({ bitcoinPrice: z.number(), priceChange24h: z.number(), ordinalsVolume: z.number(), runesVolume: z.number() })
);

export const fetchRunes = () =>
  fetchWithCache(
    "https://api.ordiscan.com/v1/runes",
    z.array(z.object({
      id: z.string(),
      name: z.string(),
      floorPrice: z.number().or(z.string()),
      volume24h: z.number(),
      volume7d: z.number(),
      divisibility: z.number(),
      totalSupply: z.number(),
      image: z.string()
    }))
  );

export const fetchRareSats = () =>
  fetchWithCache(
    "https://api.ordiscan.com/v1/rare-sats",
    z.object({
      uncommon: z.number(),
      rare: z.number(),
      epic: z.number(),
      legendary: z.number(),
      mythic: z.number()
    })
  );

syncData(fetchCollections, "collections");
syncData(fetchMempool, "mempool");
syncData(fetchMinerData, "miner");
syncData(fetchMarketData, "market"); 