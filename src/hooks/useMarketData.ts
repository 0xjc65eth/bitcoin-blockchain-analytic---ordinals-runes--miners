'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { setMarketData } from '@/store/marketSlice'

export function useMarketData() {
  const dispatch = useAppDispatch()
  const marketData = useAppSelector(state => state.market)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Mock data for now - will be replaced with real API calls
        const mockData = {
          btcPrice: 65000 + Math.random() * 1000,
          btcChange24h: -2.5 + Math.random() * 5,
          volume24h: 25000000000 + Math.random() * 5000000000,
          marketCap: 1250000000000 + Math.random() * 100000000000,
        }
        
        dispatch(setMarketData(mockData))
      } catch (error) {
        console.error('Error fetching market data:', error)
      }
    }

    // Initial fetch
    fetchMarketData()

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchMarketData, 30000) // Update every 30 seconds

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [dispatch])

  return marketData
} 