'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { fetchMinerData } from '@/lib/api'
import type { MinerData } from '@/lib/api'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function MinersPage() {
  const [miners, setMiners] = useState<MinerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMinerData()
      setMiners(data)
      setLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchData, 600000) // Update every 10 minutes

    return () => clearInterval(interval)
  }, [])

  const pieChartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      background: 'transparent'
    },
    theme: {
      mode: 'dark'
    },
    labels: miners.map(m => m.id),
    colors: ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f97316'],
    legend: {
      position: 'bottom',
      labels: {
        colors: '#9ca3af'
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toFixed(2)}%`
      }
    }
  }

  const pieChartSeries = miners.map(m => m.networkPercentage)

  return (
    <div className="min-h-screen bg-dark-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Bitcoin Miners Analytics</h1>
          <p className="text-gray-400">Real-time analysis of solo miners and network decentralization</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Total Hashrate</h3>
                <p className="text-2xl font-bold text-white">
                  {(miners.reduce((acc, m) => acc + m.hashrate, 0) / 1e6).toFixed(2)} EH/s
                </p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Active Solo Miners</h3>
                <p className="text-2xl font-bold text-white">{miners.length}</p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Decentralization Index</h3>
                <p className="text-2xl font-bold text-white">
                  {miners[0]?.decentralizationIndex?.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-4">Hashrate Distribution</h3>
                <div className="h-[400px]">
                  <Chart
                    options={pieChartOptions}
                    series={pieChartSeries}
                    type="pie"
                    height="100%"
                  />
                </div>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-4">Network Percentage</h3>
                <div className="space-y-4">
                  {miners.map(miner => (
                    <div key={miner.id} className="relative">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">{miner.id}</span>
                        <span className="text-sm text-gray-400">{miner.networkPercentage.toFixed(2)}%</span>
                      </div>
                      <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${miner.networkPercentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Miners Table */}
            <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-primary-600/20">
                <h3 className="text-lg font-semibold text-primary-400">Solo Miners</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Miner ID</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Hashrate</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Network %</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Last Block</th>
                    </tr>
                  </thead>
                  <tbody>
                    {miners.map(miner => (
                      <tr key={miner.id} className="border-t border-primary-600/10">
                        <td className="px-6 py-4 text-white">{miner.id}</td>
                        <td className="px-6 py-4 text-white">{(miner.hashrate / 1e6).toFixed(2)} EH/s</td>
                        <td className="px-6 py-4 text-white">{miner.networkPercentage.toFixed(2)}%</td>
                        <td className="px-6 py-4 text-white">#{miner.lastBlock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 