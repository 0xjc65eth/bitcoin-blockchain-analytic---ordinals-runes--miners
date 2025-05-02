'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { setMiningData } from '@/store/miningSlice'
import type { MiningState } from '@/types/store'

export const useMiningData = () => {
  const dispatch = useAppDispatch()
  const miningData = useAppSelector((state) => state.mining)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMiningData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Buscar dados reais da API do mempool.space
        const [difficultyRes, blockTimeRes] = await Promise.all([
          fetch('https://mempool.space/api/v1/difficulty-adjustment'),
          fetch('https://mempool.space/api/v1/blocks/tip')
        ])

        if (!difficultyRes.ok || !blockTimeRes.ok) {
          throw new Error('Failed to fetch mining data')
        }

        const difficultyData = await difficultyRes.json()
        const blockData = await blockTimeRes.json()

        // Calcular o tempo médio de bloco em minutos
        const blockTimeMinutes = Math.round(difficultyData.timeAvg / 60)

        // Formatar os dados para nosso formato
        const realData: MiningState = {
          hashRate: Math.round(difficultyData.currentHashrate / 1e15), // Convert to PH/s
          difficulty: difficultyData.difficulty,
          blockTime: blockTimeMinutes,
          lastUpdated: new Date().toISOString()
        }

        console.log('Mining data fetched successfully:', realData)
        dispatch(setMiningData(realData))
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching mining data:', error)
        setError('Failed to fetch mining data')

        // Dados de fallback em caso de erro
        const fallbackData: MiningState = {
          hashRate: 350000, // 350 EH/s
          difficulty: 73516548906.56,
          blockTime: 10, // 10 minutos
          lastUpdated: new Date().toISOString()
        }

        dispatch(setMiningData(fallbackData))
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchMiningData()

    // Set up interval for periodic updates
    const interval = setInterval(fetchMiningData, 60000) // Atualizar a cada minuto

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [dispatch])

  return { ...miningData, isLoading, error }
}