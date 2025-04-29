'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { setMarketData } from '@/store/marketSlice'

export function useMarketData() {
  const dispatch = useAppDispatch()
  const marketData = useAppSelector(state => state.market)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true)
      setError(null)

      console.log('Fetching Bitcoin price data...')

      try {
        // Buscar dados reais da API do CoinMarketCap
        const timestamp = new Date().getTime() // Add timestamp to prevent caching
        const response = await fetch(`/api/bitcoin-price?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          console.error(`API error: ${response.status}`)
          throw new Error(`Failed to fetch Bitcoin price data: ${response.status}`)
        }

        const data = await response.json()
        console.log('Bitcoin price data received:', data)

        // Verificar se os dados são válidos
        if (!data || typeof data.btcPrice !== 'number') {
          console.error('Invalid data received:', data)
          throw new Error('Invalid data format received from API')
        }

        // Atualizar o estado com os dados recebidos
        dispatch(setMarketData({
          ...data,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
        }))

        // Definir isLoading como false apenas após os dados serem atualizados
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching market data:', error)
        setError('Failed to fetch Bitcoin price')

        // Dados de fallback em caso de erro
        const fallbackData = {
          btcPrice: 65432.10,
          btcChange24h: 2.34,
          volume24h: 25000000000,
          marketCap: 1250000000000,
          lastUpdated: new Date().toISOString(),
        }

        dispatch(setMarketData(fallbackData))

        // Definir isLoading como false apenas após os dados serem atualizados
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }
    }

    // Initial fetch
    fetchMarketData()

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchMarketData, 60000) // Update every minute for Bitcoin price

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [dispatch])

  return { ...marketData, isLoading, error }
}