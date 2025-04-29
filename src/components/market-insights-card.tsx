'use client'

import { DashboardCard } from '@/components/dashboard-card'
import { RiLightbulbLine, RiExchangeDollarLine, RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import { useMemo, useState, useEffect } from 'react'

export function MarketInsightsCard() {
  const [mounted, setMounted] = useState(false)

  // Evitar hidratação usando useEffect para renderizar apenas no cliente
  useEffect(() => {
    setMounted(true)
  }, [])
  // Generate mock market insights data
  const marketInsights = useMemo(() => {
    return {
      ordinals: [
        {
          title: "Taproot Wizards Volume Surge",
          description: "Taproot Wizards collection has seen a 35% increase in trading volume over the last 24 hours, with floor price up 12%.",
          impact: "High",
          trend: "up"
        },
        {
          title: "New Collections Launch",
          description: "Three major collections launched in the past 48 hours, bringing 15,000+ new inscriptions to the network.",
          impact: "Medium",
          trend: "up"
        }
      ],
      runes: [
        {
          title: "ORDI Token Liquidity Increase",
          description: "ORDI token has seen a 28% increase in liquidity pools across major exchanges, reducing slippage for traders.",
          impact: "High",
          trend: "up"
        },
        {
          title: "Arbitrage Opportunities",
          description: "Price disparities between UniSat and OKX for SATS token creating 4-6% arbitrage opportunities.",
          impact: "Medium",
          trend: "neutral"
        }
      ],
      general: [
        {
          title: "Inscription Fees Declining",
          description: "Average inscription fees have decreased by 15% this week, making new mints more accessible.",
          impact: "Medium",
          trend: "down"
        }
      ]
    };
  }, []);

  return (
    <DashboardCard title="Market Insights" className="bg-gradient-to-br from-[#2A2A3A] to-[#3A3A4A] border-none shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
              <RiLightbulbLine className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-amber-300">Latest Analysis</p>
              <p className="text-xl font-bold text-white">Ordinals & Runes Insights</p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-amber-500 text-xs font-bold animate-pulse text-white">Updated Hourly</span>
        </div>

        <div>
          <p className="text-sm font-medium text-amber-300 mb-2">Ordinals Insights</p>
          <div className="space-y-2">
            {marketInsights.ordinals.map((insight, index) => (
              <div key={index} className="bg-amber-500/10 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <RiExchangeDollarLine className="w-4 h-4 text-amber-400 mr-2" />
                      <p className="text-sm font-medium text-white">{insight.title}</p>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{insight.description}</p>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    <span className={`text-xs font-medium ${
                      insight.impact === 'High' ? 'text-rose-400' :
                      insight.impact === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {insight.impact} Impact
                    </span>
                    {insight.trend === 'up' && <RiArrowUpSLine className="w-4 h-4 text-emerald-400" />}
                    {insight.trend === 'down' && <RiArrowDownSLine className="w-4 h-4 text-rose-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-amber-300 mb-2">Runes Insights</p>
          <div className="space-y-2">
            {marketInsights.runes.map((insight, index) => (
              <div key={index} className="bg-amber-500/10 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <RiExchangeDollarLine className="w-4 h-4 text-amber-400 mr-2" />
                      <p className="text-sm font-medium text-white">{insight.title}</p>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{insight.description}</p>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    <span className={`text-xs font-medium ${
                      insight.impact === 'High' ? 'text-rose-400' :
                      insight.impact === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {insight.impact} Impact
                    </span>
                    {insight.trend === 'up' && <RiArrowUpSLine className="w-4 h-4 text-emerald-400" />}
                    {insight.trend === 'down' && <RiArrowDownSLine className="w-4 h-4 text-rose-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-amber-300 mb-2">General Market</p>
          <div className="space-y-2">
            {marketInsights.general.map((insight, index) => (
              <div key={index} className="bg-amber-500/10 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <RiExchangeDollarLine className="w-4 h-4 text-amber-400 mr-2" />
                      <p className="text-sm font-medium text-white">{insight.title}</p>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{insight.description}</p>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    <span className={`text-xs font-medium ${
                      insight.impact === 'High' ? 'text-rose-400' :
                      insight.impact === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {insight.impact} Impact
                    </span>
                    {insight.trend === 'up' && <RiArrowUpSLine className="w-4 h-4 text-emerald-400" />}
                    {insight.trend === 'down' && <RiArrowDownSLine className="w-4 h-4 text-rose-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}
