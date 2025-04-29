'use client'

import { useQuery } from '@tanstack/react-query';
import { fetchOrdiscanData } from '@/lib/ordiscan';

export function useOrdiscanData(endpoint: string) {
  return useQuery({
    queryKey: ['ordiscan', endpoint],
    queryFn: () => fetchOrdiscanData(endpoint),
    refetchInterval: 600000, // Refetch every 10 minutes
    retry: 3, // Retry failed requests 3 times
    staleTime: 300000, // Consider data stale after 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnReconnect: true, // Refetch when internet connection is restored
  });
}