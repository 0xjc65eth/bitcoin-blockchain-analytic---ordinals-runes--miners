'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { setMempoolData } from '@/store/mempoolSlice'
import type { MempoolState } from '@/types/store'

export const useMempoolData = () => {
  const dispatch = useAppDispatch()
  const mempoolData = useAppSelector((state) => state.mempool)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMempoolData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Buscar dados reais da API
        const response = await fetch('/api/mempool-data')

        if (!response.ok) {
          throw new Error('Failed to fetch mempool data')
        }

        const data = await response.json()
        console.log('Mempool data received:', data)
        dispatch(setMempoolData(data))
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching mempool data:', error)
        setError('Failed to fetch mempool data')

        // Dados de fallback em caso de erro
        const mockData: MempoolState = {
          pendingTransactions: Math.floor(Math.random() * 1000) + 500,
          averageFeeRate: Math.floor(Math.random() * 50) + 10,
          mempoolSize: Math.floor(Math.random() * 10000) + 5000,
          lastUpdated: new Date().toISOString(),
          transactions: [],
          feeRates: {
            low: Math.floor(Math.random() * 10) + 5,
            medium: Math.floor(Math.random() * 20) + 15,
            high: Math.floor(Math.random() * 30) + 25
          },
          blocks: [
            {
              height: 0,
              hash: '',
              timestamp: Date.now(),
              size: 0,
              weight: 0
            }
          ]
        }

        dispatch(setMempoolData(mockData))
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchMempoolData()

    // Set up interval for periodic updates
    const interval = setInterval(fetchMempoolData, 60000) // Atualizar a cada minuto

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [dispatch])

  return { ...mempoolData, isLoading, error }
}