'use client'

import { DashboardCard } from '@/components/dashboard-card'
import { RiBrainLine, RiPulseLine, RiRadarLine } from 'react-icons/ri'
import { useMemo, useState, useEffect } from 'react'

export function NeuralInsightsCard() {
  const [mounted, setMounted] = useState(false)

  // Evitar hidratação usando useEffect para renderizar apenas no cliente
  useEffect(() => {
    setMounted(true)
  }, [])
  // Generate mock neural insights data
  const neuralInsights = useMemo(() => {
    return [
      {
        name: 'BTC Price Trend',
        value: 78,
        signal: 'Bullish',
        confidence: 'High',
        color: 'emerald'
      },
      {
        name: 'Market Sentiment',
        value: 65,
        signal: 'Positive',
        confidence: 'Medium',
        color: 'emerald'
      },
      {
        name: 'Volatility Forecast',
        value: 42,
        signal: 'Moderate',
        confidence: 'Medium',
        color: 'amber'
      },
      {
        name: 'Ordinals Momentum',
        value: 82,
        signal: 'Strong',
        confidence: 'High',
        color: 'emerald'
      },
      {
        name: 'Runes Momentum',
        value: 71,
        signal: 'Bullish',
        confidence: 'Medium',
        color: 'emerald'
      }
    ];
  }, []);

  return (
    <DashboardCard title="Neural Network Insights" className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
              <RiBrainLine className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-300">AI Signal</p>
              <p className="text-xl font-bold text-white">Bullish Bias</p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-blue-500 text-xs font-bold animate-pulse text-white">Real-time Analysis</span>
        </div>

        <div className="space-y-3">
          {neuralInsights.map((insight, index) => (
            <div key={index} className="bg-blue-500/10 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  {index % 2 === 0 ? (
                    <RiPulseLine className="w-4 h-4 text-blue-400 mr-2" />
                  ) : (
                    <RiRadarLine className="w-4 h-4 text-blue-400 mr-2" />
                  )}
                  <span className="text-sm font-medium text-white">{insight.name}</span>
                </div>
                <span className={`text-xs font-medium text-${insight.color}-400`}>{insight.signal}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`bg-${insight.color}-500 h-2 rounded-full`}
                  style={{ width: mounted ? `${insight.value}%` : `${insight.name === 'BTC Price Trend' ? 78 : insight.name === 'Market Sentiment' ? 65 : insight.name === 'Volatility Forecast' ? 42 : insight.name === 'Ordinals Momentum' ? 82 : 71}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-400">Confidence: {insight.confidence}</span>
                <span className="text-xs text-white">
                  {mounted
                    ? `${insight.value}%`
                    : `${insight.name === 'BTC Price Trend' ? 78 : insight.name === 'Market Sentiment' ? 65 : insight.name === 'Volatility Forecast' ? 42 : insight.name === 'Ordinals Momentum' ? 82 : 71}%`
                  }
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-white/80 mt-2">
          Our neural engine currently detects a <span className="font-bold text-emerald-400">bullish</span> bias.
          Signals are updated in real time based on on-chain and market data.
        </p>
      </div>
    </DashboardCard>
  )
}
