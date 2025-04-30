import { useState, useEffect } from 'react';
import { TradingData, getTradingData, refreshTradingData } from '@/services/trading-data-service';

export function useTradingData(refreshInterval: number = 60000) {
  const [data, setData] = useState<TradingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);
        const tradingData = getTradingData();
        setData(tradingData);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data immediately
    fetchData();

    // Set up interval for refreshing data
    const intervalId = setInterval(() => {
      try {
        const refreshedData = refreshTradingData();
        setData(refreshedData);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error refreshing trading data:', err);
      }
    }, refreshInterval);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Function to manually refresh data
  const refresh = () => {
    try {
      setIsLoading(true);
      const refreshedData = refreshTradingData();
      setData(refreshedData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, lastUpdated, refresh };
}
