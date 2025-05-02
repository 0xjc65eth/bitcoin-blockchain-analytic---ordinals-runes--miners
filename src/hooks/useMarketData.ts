'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { setMarketData } from '@/store/marketSlice'

export function useMarketData() {
  const dispatch = useAppDispatch()
  const marketData = useAppSelector(state => state.market)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true)
      setError(null)

      console.log('Fetching Bitcoin price data...')

      try {
        // Adicionar timestamp e número aleatório para evitar cache
        const timestamp = new Date().getTime()
        const randomParam = Math.floor(Math.random() * 1000000)
        const response = await fetch(`/api/bitcoin-price?t=${timestamp}&r=${randomParam}`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
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

        // Resetar contador de tentativas em caso de sucesso
        setRetryCount(0)

        // Definir isLoading como false apenas após os dados serem atualizados
        setTimeout(() => {
          setIsLoading(false)
        }, 300)
      } catch (error) {
        console.error('Error fetching market data:', error)

        // Incrementar contador de tentativas
        const newRetryCount = retryCount + 1
        setRetryCount(newRetryCount)

        if (newRetryCount < maxRetries) {
          console.log(`Retry attempt ${newRetryCount}/${maxRetries} in 2 seconds...`)
          // Tentar novamente após 2 segundos
          setTimeout(fetchMarketData, 2000)
          return
        }

        setError('Failed to fetch Bitcoin price')

        // Dados de fallback em caso de erro - valores reais atualizados
        const fallbackData = {
          btcPrice: 67500.00,
          btcChange24h: 2.35,
          volume24h: 28500000000,
          marketCap: 1320000000000,
          lastUpdated: new Date().toISOString(),
        }

        console.log('Using fallback market data:', fallbackData)
        dispatch(setMarketData(fallbackData))

        // Definir isLoading como false apenas após os dados serem atualizados
        setTimeout(() => {
          setIsLoading(false)
        }, 300)
      }
    }

    // Initial fetch
    fetchMarketData()

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchMarketData, 30000) // Update every 30 seconds for Bitcoin price

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [dispatch, retryCount])

  return { ...marketData, isLoading, error }
}