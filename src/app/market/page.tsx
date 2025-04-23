'use client'

import { useState, useEffect } from 'react'
import { fetchMarketData, MarketData } from '@/lib/api'

export default function MarketPage() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMarketData()
      setMarketData(data)
      setLoading(false)
    }

    loadData()
    const interval = setInterval(loadData, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-dark-300 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-dark-200/50 rounded-xl mb-8"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-purple bg-clip-text text-transparent">
            Market Overview
          </h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-primary-600/20 border border-primary-600/20 rounded-lg text-primary-400 hover:bg-primary-600/30 transition-all duration-200">
              24h
            </button>
            <button className="px-4 py-2 bg-dark-200/50 border border-primary-600/20 rounded-lg text-gray-300 hover:bg-dark-300/50 transition-all duration-200">
              7d
            </button>
            <button className="px-4 py-2 bg-dark-200/50 border border-primary-600/20 rounded-lg text-gray-300 hover:bg-dark-300/50 transition-all duration-200">
              30d
            </button>
          </div>
        </div>

        <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-600/20">
              <thead className="bg-dark-300/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Collection
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price (BTC)
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Volume
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Trade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-600/20">
                {marketData.map((item) => (
                  <tr key={item.id} className="hover:bg-dark-300/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                      {item.price.toFixed(4)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      item.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.change24h > 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                      {item.volume.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                      {item.marketCap.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-400">
                      {item.lastTrade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 