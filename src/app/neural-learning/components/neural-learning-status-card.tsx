'use client'

import React, { useState, useEffect } from 'react'
import { Card, Title, Text, Metric, Flex, ProgressBar } from '@tremor/react'
import { RiBrainLine, RiCheckboxCircleLine, RiAlertLine, RiTimeLine, RiRefreshLine } from 'react-icons/ri'

// Simulated learning progress data
const learningStages = [
  'data_collection',
  'preprocessing',
  'training',
  'validation',
  'insight_generation',
  'correction'
]

// Simulated auto-correction data
const autoCorrections = [
  {
    id: 'market-price-1',
    timestamp: new Date().toISOString(),
    dataType: 'Market',
    field: 'btcPrice',
    oldValue: 68452,
    newValue: 65789,
    confidence: 92,
    source: 'Anomaly Detection',
    explanation: 'Detected abnormal price variation of 22.5% in less than an hour. Value corrected based on adjacent data points.',
    modelId: 'price-prediction',
    status: 'applied'
  },
  {
    id: 'ordinals-volume-1',
    timestamp: new Date().toISOString(),
    dataType: 'Ordinals',
    field: 'volume24h',
    oldValue: 1250000,
    newValue: 850000,
    confidence: 88,
    source: 'Pattern Recognition',
    explanation: 'Detected abnormal volume spike of 320% in less than 2 hours. Value corrected based on historical patterns.',
    modelId: 'ordinals-analysis',
    status: 'applied'
  },
  {
    id: 'runes-mintrate-1',
    timestamp: new Date().toISOString(),
    dataType: 'Runes',
    field: 'mintRate',
    oldValue: 0.0025,
    newValue: 0.0018,
    confidence: 85,
    source: 'Statistical Analysis',
    explanation: 'Detected abnormal mint rate variation of 550% in less than 3 hours. Value corrected based on adjacent data points.',
    modelId: 'runes-analysis',
    status: 'applied'
  },
  {
    id: 'arbitrage-opportunity-1',
    timestamp: new Date().toISOString(),
    dataType: 'Arbitrage',
    field: 'profitMargin',
    oldValue: 28.5,
    newValue: 12.3,
    confidence: 94,
    source: 'Cross-Market Analysis',
    explanation: 'Corrected profit margin calculation by including previously omitted marketplace fees and transfer costs.',
    modelId: 'arbitrage-detection',
    status: 'applied'
  }
]

export function NeuralLearningStatusCard() {
  const [activeTab, setActiveTab] = useState('progress')
  const [progress, setProgress] = useState(78)
  const [currentStage, setCurrentStage] = useState('training')
  const [completedTasks, setCompletedTasks] = useState(12)
  const [totalTasks, setTotalTasks] = useState(20)
  const [currentTask, setCurrentTask] = useState('Training neural models with latest data')
  const [corrections, setCorrections] = useState(autoCorrections)

  // Simulate progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 5)
        return newProgress > 100 ? 100 : newProgress
      })

      setCompletedTasks(prev => {
        const newCompleted = prev + (Math.random() > 0.7 ? 1 : 0)
        return newCompleted > totalTasks ? totalTasks : newCompleted
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [totalTasks])

  // Function to run auto-correction
  const runAutoCorrection = () => {
    setCurrentStage('correction')
    setCurrentTask('Autonomously correcting inconsistent data')
    setProgress(45)

    // Simulate adding a new correction after a delay
    setTimeout(() => {
      const newCorrection = {
        id: `trade-setup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        dataType: 'Trade',
        field: 'stopLoss',
        oldValue: 58200,
        newValue: 61450,
        confidence: 96,
        source: 'SMC Analysis',
        explanation: 'Corrected invalid stop loss value that was below support level. New value aligned with nearest valid support.',
        modelId: 'smc-analysis',
        status: 'applied'
      }

      setCorrections(prev => [newCorrection, ...prev])
      setCurrentStage('training')
      setCurrentTask('Training neural models with latest data')
      setProgress(82)
    }, 2000)
  }

  return (
    <Card className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center mr-3 border border-[#8B5CF6]/30">
            <RiBrainLine className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <Title className="text-white text-xl">Neural Learning Status</Title>
        </div>

        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-xs font-medium ${activeTab === 'progress' ? 'bg-[#8B5CF6] text-white' : 'bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30'}`}
            onClick={() => setActiveTab('progress')}
          >
            Progress
          </button>
          <button
            className={`px-3 py-1 rounded-md text-xs font-medium ${activeTab === 'corrections' ? 'bg-[#8B5CF6] text-white' : 'bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30'}`}
            onClick={() => setActiveTab('corrections')}
          >
            Auto-Corrections
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Flex>
            <Text className="text-gray-400">System Status</Text>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
              <Text className="text-emerald-400 font-medium">Active</Text>
            </div>
          </Flex>
          <Flex className="mt-2">
            <Text className="text-gray-400">Last Updated</Text>
            <Text className="text-white">Just now</Text>
          </Flex>
        </div>

        {activeTab === 'progress' ? (
          <>
            <div className="bg-[#8B5CF6]/10 p-4 rounded-lg border border-[#8B5CF6]/20">
              <Text className="text-white font-medium mb-2">{currentTask}</Text>
              <ProgressBar value={progress} color="indigo" className="mt-2 h-2" />
              <Flex className="mt-2">
                <Text className="text-xs text-gray-400">Current Stage: <span className="text-[#8B5CF6] capitalize">{currentStage.replace('_', ' ')}</span></Text>
                <Text className="text-xs text-white">{progress}%</Text>
              </Flex>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-[#8B5CF6]/20 p-3 rounded-lg">
                  <Text className="text-xs text-gray-400 mb-1">Tasks Completed</Text>
                  <div className="flex items-end">
                    <Metric className="text-white text-lg">{completedTasks}</Metric>
                    <Text className="text-xs text-gray-400 ml-1 mb-0.5">/ {totalTasks}</Text>
                  </div>
                </div>

                <div className="bg-[#8B5CF6]/20 p-3 rounded-lg">
                  <Text className="text-xs text-gray-400 mb-1">Estimated Completion</Text>
                  <div className="flex items-center">
                    <RiTimeLine className="text-[#8B5CF6] mr-1" />
                    <Text className="text-white text-sm">~{Math.ceil((totalTasks - completedTasks) * 2.5)} min</Text>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#8B5CF6]/10 p-4 rounded-lg border border-[#8B5CF6]/20">
              <Text className="text-white font-medium">Neural System Metrics</Text>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Text className="text-xs text-gray-400">Accuracy</Text>
                  <Metric className="text-white text-lg">87.4%</Metric>
                </div>
                <div>
                  <Text className="text-xs text-gray-400">Precision</Text>
                  <Metric className="text-white text-lg">91.2%</Metric>
                </div>
                <div>
                  <Text className="text-xs text-gray-400">Recall</Text>
                  <Metric className="text-white text-lg">83.9%</Metric>
                </div>
                <div>
                  <Text className="text-xs text-gray-400">F1 Score</Text>
                  <Metric className="text-white text-lg">87.4%</Metric>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[#8B5CF6]/10 p-4 rounded-lg border border-[#8B5CF6]/20">
            <div className="flex justify-between items-center mb-3">
              <Text className="text-white font-medium">Autonomous Corrections</Text>
              <div className="flex items-center text-xs text-[#8B5CF6]">
                <RiCheckboxCircleLine className="mr-1" />
                <Text className="text-[#8B5CF6]">{corrections.length} corrections applied</Text>
              </div>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {corrections.map((correction, index) => (
                <div key={correction.id} className="bg-[#8B5CF6]/20 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${correction.confidence > 90 ? 'bg-emerald-400' : 'bg-amber-400'} mr-2`}></div>
                      <Text className="text-white text-sm font-medium">{correction.dataType} {correction.field}</Text>
                    </div>
                    <Text className="text-xs text-gray-400">{correction.confidence}% confidence</Text>
                  </div>

                  <Text className="text-xs text-gray-300 mb-2">{correction.explanation}</Text>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-500/20 p-2 rounded">
                      <Text className="text-gray-400">Old Value:</Text>
                      <Text className="text-red-300 font-medium">{correction.oldValue}</Text>
                    </div>
                    <div className="bg-emerald-500/20 p-2 rounded">
                      <Text className="text-gray-400">New Value:</Text>
                      <Text className="text-emerald-300 font-medium">{correction.newValue}</Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            className="flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
            onClick={runAutoCorrection}
          >
            <RiAlertLine className="mr-1" />
            Run Auto-Correction
          </button>

          <button
            className="flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30"
            onClick={() => {
              setProgress(Math.floor(Math.random() * 30) + 70)
              setCompletedTasks(Math.floor(Math.random() * 5) + 15)
            }}
          >
            <RiRefreshLine className="mr-1" />
            Refresh Status
          </button>
        </div>
      </div>
    </Card>
  )
}
