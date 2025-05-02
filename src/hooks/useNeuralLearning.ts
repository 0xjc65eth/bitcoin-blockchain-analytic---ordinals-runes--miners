'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { neuralLearningService, NeuralInsight } from '@/services/neural-learning-service'

interface UseNeuralLearningOptions {
  autoStart?: boolean
  insightTypes?: string[]
  insightLimit?: number
  refreshInterval?: number
}

export function useNeuralLearning(options: UseNeuralLearningOptions = {}) {
  const {
    autoStart = true,
    insightTypes = [],
    insightLimit = 10,
    refreshInterval = 30000 // 30 segundos
  } = options

  const [isLearning, setIsLearning] = useState(false)
  const [lastModelUpdate, setLastModelUpdate] = useState<string | null>(null)
  const [learningProgress, setLearningProgress] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  // Iniciar aprendizado automático se autoStart for true
  useEffect(() => {
    if (autoStart) {
      startLearning()
    }

    // Verificar status atual
    const currentStatus = neuralLearningService.getStatus()
    setIsLearning(currentStatus.isLearning)
    setLastModelUpdate(currentStatus.lastModelUpdate)

    // Configurar listeners de eventos
    const handleModelTrained = (data: any) => {
      setLastModelUpdate(data.timestamp)
      // Atualizar progresso de aprendizado (simulação)
      setLearningProgress(prev => Math.min(100, prev + 5))
    }

    const handleLearningStarted = () => {
      setIsLearning(true)
      setLearningProgress(0)
    }

    const handleLearningStopped = () => {
      setIsLearning(false)
    }

    const handleCloudSyncStarted = () => {
      setIsSyncing(true)
    }

    const handleCloudSyncCompleted = (data: any) => {
      setIsSyncing(false)
      setLastSyncTime(data.timestamp)
    }

    const handleForcedCloudSync = (data: any) => {
      if (data.success) {
        setLastSyncTime(data.timestamp)
      }
      setIsSyncing(false)
    }

    // Registrar listeners
    neuralLearningService.on('model-trained', handleModelTrained)
    neuralLearningService.on('learning-started', handleLearningStarted)
    neuralLearningService.on('learning-stopped', handleLearningStopped)
    neuralLearningService.on('cloud-sync-started', handleCloudSyncStarted)
    neuralLearningService.on('cloud-data-saved', handleCloudSyncCompleted)
    neuralLearningService.on('cloud-data-loaded', handleCloudSyncCompleted)
    neuralLearningService.on('forced-cloud-sync', handleForcedCloudSync)

    // Limpar listeners ao desmontar
    return () => {
      neuralLearningService.off('model-trained', handleModelTrained)
      neuralLearningService.off('learning-started', handleLearningStarted)
      neuralLearningService.off('learning-stopped', handleLearningStopped)
      neuralLearningService.off('cloud-sync-started', handleCloudSyncStarted)
      neuralLearningService.off('cloud-data-saved', handleCloudSyncCompleted)
      neuralLearningService.off('cloud-data-loaded', handleCloudSyncCompleted)
      neuralLearningService.off('forced-cloud-sync', handleForcedCloudSync)
    }
  }, [autoStart])

  // Função para iniciar o aprendizado
  const startLearning = () => {
    neuralLearningService.startContinuousLearning()
    setIsLearning(true)
  }

  // Função para parar o aprendizado
  const stopLearning = () => {
    neuralLearningService.stopContinuousLearning()
    setIsLearning(false)
  }

  // Obter insights usando React Query
  const { data: insights, isLoading, error, refetch } = useQuery({
    queryKey: ['neural-insights', insightTypes, insightLimit],
    queryFn: () => {
      const allInsights = neuralLearningService.getRecentInsights(insightLimit)

      // Filtrar por tipos se especificados
      if (insightTypes.length > 0) {
        return allInsights.filter(insight => insightTypes.includes(insight.type))
      }

      return allInsights
    },
    refetchInterval: refreshInterval,
    enabled: true
  })

  // Obter status do serviço
  const { data: status } = useQuery({
    queryKey: ['neural-learning-status'],
    queryFn: () => neuralLearningService.getStatus(),
    refetchInterval: refreshInterval,
    enabled: true
  })

  // Obter modelos
  const { data: models } = useQuery({
    queryKey: ['neural-learning-models'],
    queryFn: () => neuralLearningService.getAllModels(),
    refetchInterval: refreshInterval,
    enabled: true
  })

  // Função para obter insights específicos por tipo
  const getInsightsByType = (type: string, limit: number = 5): NeuralInsight[] => {
    return neuralLearningService.getRecentInsights(limit, type)
  }

  // Função para atualizar configuração
  const updateConfig = (newConfig: any) => {
    neuralLearningService.updateConfig(newConfig)
  }

  // Função para forçar sincronização com a nuvem
  const forceSyncWithCloud = async () => {
    try {
      await neuralLearningService.forceSyncWithCloud()
      return true
    } catch (error) {
      console.error('Error syncing with cloud:', error)
      throw error
    }
  }

  return {
    isLearning,
    startLearning,
    stopLearning,
    insights,
    models,
    status,
    lastModelUpdate,
    learningProgress,
    isLoading,
    error,
    refetch,
    getInsightsByType,
    updateConfig,
    isSyncing,
    lastSyncTime,
    forceSyncWithCloud
  }
}
