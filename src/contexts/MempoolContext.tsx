'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { z } from 'zod';

const mempoolStatsSchema = z.object({
  size: z.number(),
  count: z.number(),
  feeRate: z.number(),
});

type MempoolStats = z.infer<typeof mempoolStatsSchema>;

interface MempoolContextType {
  mempoolStats: MempoolStats | null;
  isLoading: boolean;
  error: string | null;
}

const MempoolContext = createContext<MempoolContextType | undefined>(undefined);

export const MempoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mempoolStats, setMempoolStats] = useState<MempoolStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMempoolStats = async () => {
      try {
        const response = await fetch('/api/mempool');
        if (!response.ok) {
          throw new Error('Failed to fetch mempool stats');
        }
        const data = await response.json();
        const validatedData = mempoolStatsSchema.parse(data);
        setMempoolStats(validatedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Set mock data for development
        setMempoolStats({
          size: 150,
          count: 25000,
          feeRate: 45,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMempoolStats();
    const interval = setInterval(fetchMempoolStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <MempoolContext.Provider
      value={{
        mempoolStats,
        isLoading,
        error,
      }}
    >
      {children}
    </MempoolContext.Provider>
  );
};

export const useMempool = () => {
  const context = useContext(MempoolContext);
  if (context === undefined) {
    throw new Error('useMempool must be used within a MempoolProvider');
  }
  return context;
}; 