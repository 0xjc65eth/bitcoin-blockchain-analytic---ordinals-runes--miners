import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMarket } from './MarketContext';
import { useMempool } from './MempoolContext';

interface Collection {
  id: string;
  name: string;
  floorPrice: number;
  volume24h: number;
  volume7d: number;
  holders: number;
  listed: number;
  marketCap: number;
  image: string;
  attributes: Record<string, any>;
  score: number;
  isPrivileged: boolean;
}

interface CollectionsContextType {
  collections: Collection[];
  privilegedCollections: Collection[];
  loading: boolean;
  error: string | null;
  refreshCollections: () => Promise<void>;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

const calculateCollectionScore = (
  collection: Collection,
  marketData: any,
  mempoolData: any
): number => {
  const {
    floorPrice,
    volume24h,
    volume7d,
    holders,
    listed,
    marketCap
  } = collection;

  const weights = {
    floorPrice: 0.2,
    volume24h: 0.25,
    volume7d: 0.15,
    holders: 0.15,
    listed: 0.1,
    marketCap: 0.15
  };

  // Normalize values based on market data
  const normalizedFloorPrice = floorPrice / (marketData?.bitcoinPrice || 1);
  const normalizedVolume24h = volume24h / (marketData?.volume24h || 1);
  const normalizedMarketCap = marketCap / (marketData?.marketCap || 1);

  // Calculate score with mempool consideration
  const mempoolFactor = mempoolData ? 1 + (mempoolData.feeRate / 100) : 1;

  return (
    (normalizedFloorPrice * weights.floorPrice +
      normalizedVolume24h * weights.volume24h +
      (volume7d / volume24h) * weights.volume7d +
      (holders / 1000) * weights.holders +
      (listed / holders) * weights.listed +
      normalizedMarketCap * weights.marketCap) *
    mempoolFactor
  );
};

const isPrivilegedCollection = (
  collection: Collection,
  marketData: any
): boolean => {
  const minScore = 0.7;
  const minHolders = 100;
  const minVolume = marketData?.bitcoinPrice ? 0.1 * marketData.bitcoinPrice : 0.1;
  const minLiquidity = 0.05; // 5% of holders

  return (
    collection.score >= minScore &&
    collection.holders >= minHolders &&
    collection.volume24h >= minVolume &&
    collection.listed / collection.holders >= minLiquidity
  );
};

export const CollectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [privilegedCollections, setPrivilegedCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { marketData } = useMarket();
  const { mempoolData } = useMempool();

  const refreshCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collections');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      
      const collectionsWithScores = data.map((collection: Collection) => ({
        ...collection,
        score: calculateCollectionScore(collection, marketData, mempoolData)
      }));

      const privileged = collectionsWithScores.filter((collection: Collection) =>
        isPrivilegedCollection(collection, marketData)
      );

      setCollections(collectionsWithScores);
      setPrivilegedCollections(privileged);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCollections();
  }, []);

  useEffect(() => {
    if (marketData || mempoolData) {
      refreshCollections();
    }
  }, [marketData, mempoolData]);

  useEffect(() => {
    // Only calculate scores when we have both market and mempool data
    if (marketData && mempoolData && collections.length > 0) {
      const updatedCollections = collections.map((collection: Collection) => ({
        ...collection,
        score: calculateCollectionScore(collection, marketData, mempoolData)
      }));
      setCollections(updatedCollections);

      // Filter for privileged collections
      const privileged = updatedCollections.filter((collection: Collection) =>
        isPrivilegedCollection(collection, marketData)
      );
      setPrivilegedCollections(privileged);
    }
  }, [collections, marketData, mempoolData]);

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        privilegedCollections,
        loading,
        error,
        refreshCollections
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
}; 