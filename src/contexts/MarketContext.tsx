'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { z } from 'zod';

const marketDataSchema = z.object({
  bitcoinPrice: z.number(),
  priceChange24h: z.number(),
  marketCap: z.number(),
  volume24h: z.number(),
  dominance: z.number(),
  ordinalsVolume: z.number(),
  runesVolume: z.number(),
});

type MarketData = z.infer<typeof marketDataSchema>;

interface MarketContextType {
  marketData: MarketData | null;
  isLoading: boolean;
  error: string | null;
  bitcoinPrice: number | null;
  priceChange24h: number | null;
  ordinalsVolume: number | null;
  runesVolume: number | null;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market');
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        const data = await response.json();
        const validatedData = marketDataSchema.parse(data);
        setMarketData(validatedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Set mock data for development
        setMarketData({
          bitcoinPrice: 58000,
          priceChange24h: 2.5,
          marketCap: 1100000000000,
          volume24h: 25000000000,
          dominance: 52.3,
          ordinalsVolume: 150,
          runesVolume: 75,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <MarketContext.Provider
      value={{
        marketData,
        isLoading,
        error,
        bitcoinPrice: marketData?.bitcoinPrice ?? null,
        priceChange24h: marketData?.priceChange24h ?? null,
        ordinalsVolume: marketData?.ordinalsVolume ?? null,
        runesVolume: marketData?.runesVolume ?? null,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}; 