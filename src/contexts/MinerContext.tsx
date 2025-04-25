'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { z } from 'zod';

const minerStatsSchema = z.object({
  avgHashrate: z.number(),
  difficulty: z.number(),
  blockTime: z.number(),
});

type MinerStats = z.infer<typeof minerStatsSchema>;

interface MinerContextType {
  avgHashrate: number | null;
  difficulty: number | null;
  blockTime: number | null;
  isLoading: boolean;
  error: string | null;
}

const MinerContext = createContext<MinerContextType | undefined>(undefined);

export const MinerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [minerStats, setMinerStats] = useState<MinerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMinerStats = async () => {
      try {
        const response = await fetch('/api/miner');
        if (!response.ok) {
          throw new Error('Failed to fetch miner stats');
        }
        const data = await response.json();
        const validatedData = minerStatsSchema.parse(data);
        setMinerStats(validatedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Set mock data for development
        setMinerStats({
          avgHashrate: 350,
          difficulty: 72e12,
          blockTime: 9.8,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMinerStats();
    const interval = setInterval(fetchMinerStats, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const value = {
    avgHashrate: minerStats?.avgHashrate ?? null,
    difficulty: minerStats?.difficulty ?? null,
    blockTime: minerStats?.blockTime ?? null,
    isLoading,
    error,
  };

  return (
    <MinerContext.Provider value={value}>
      {children}
    </MinerContext.Provider>
  );
};

export const useMiner = () => {
  const context = useContext(MinerContext);
  if (context === undefined) {
    throw new Error('useMiner must be used within a MinerProvider');
  }
  return context;
}; 