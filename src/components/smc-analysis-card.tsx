'use client'

import { DashboardCard } from '@/components/dashboard-card'
import { RiBarChartBoxLine, RiLineChartLine, RiStockLine } from 'react-icons/ri'
import { useMemo } from 'react'

export function SmcAnalysisCard() {
  // Generate mock SMC (Smart Money Concept) analysis data
  const smcData = useMemo(() => {
    return {
      liquidityLevels: [
        { name: 'Major Support', price: 64200, strength: 'High', type: 'support' },
        { name: 'Minor Support', price: 65800, strength: 'Medium', type: 'support' },
        { name: 'Current Price', price: 67500, strength: 'N/A', type: 'current' },
        { name: 'Minor Resistance', price: 68300, strength: 'Medium', type: 'resistance' },
        { name: 'Major Resistance', price: 70000, strength: 'High', type: 'resistance' }
      ],
      orderBlocks: [
        { name: 'Bullish OB', price: '63500-64200', status: 'Untested', probability: 'High' },
        { name: 'Bearish OB', price: '69200-70100', status: 'Untested', probability: 'Medium' }
      ],
      fairValueGaps: [
        { name: 'Bullish FVG', price: '66200-66800', status: 'Filled', probability: 'N/A' },
        { name: 'Bearish FVG', price: '68500-69000', status: 'Unfilled', probability: 'High' }
      ]
    };
  }, []);

  return (
    <DashboardCard title="SMC Market Analysis" className="bg-gradient-to-br from-[#1A2A3A] to-[#2A3A4A] border-none shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
              <RiStockLine className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-cyan-300">Market Structure</p>
              <p className="text-xl font-bold text-white">Bullish Continuation</p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-cyan-500 text-xs font-bold animate-pulse text-white">Smart Money Analysis</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center mb-2">
              <RiBarChartBoxLine className="w-4 h-4 text-cyan-400 mr-2" />
              <p className="text-sm font-medium text-cyan-300">Liquidity Levels</p>
            </div>
            <div className="space-y-2">
              {smcData.liquidityLevels.map((level, index) => (
                <div key={index} className="flex justify-between items-center text-xs bg-cyan-500/10 p-2 rounded">
                  <span className={`font-medium ${
                    level.type === 'support' ? 'text-emerald-400' : 
                    level.type === 'resistance' ? 'text-rose-400' : 'text-white'
                  }`}>
                    {level.name}
                  </span>
                  <div className="flex items-center">
                    <span className="text-white">${level.price.toLocaleString()}</span>
                    <span className="text-gray-400 ml-2">({level.strength})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <RiLineChartLine className="w-4 h-4 text-cyan-400 mr-2" />
              <p className="text-sm font-medium text-cyan-300">Order Blocks & Fair Value Gaps</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {smcData.orderBlocks.map((ob, index) => (
                <div key={index} className="text-xs bg-cyan-500/10 p-2 rounded">
                  <p className="font-medium text-white">{ob.name}</p>
                  <p className="text-emerald-400">${ob.price}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400">{ob.status}</span>
                    <span className="text-white">{ob.probability}</span>
                  </div>
                </div>
              ))}
              {smcData.fairValueGaps.map((fvg, index) => (
                <div key={index} className="text-xs bg-cyan-500/10 p-2 rounded">
                  <p className="font-medium text-white">{fvg.name}</p>
                  <p className="text-rose-400">${fvg.price}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400">{fvg.status}</span>
                    <span className="text-white">{fvg.probability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-white/80 mt-2">
          Current market structure suggests a <span className="font-bold text-emerald-400">bullish continuation</span> with 
          strong support at $64,200. Watch for reaction at the bearish FVG ($68,500-$69,000).
        </p>
      </div>
    </DashboardCard>
  )
}
