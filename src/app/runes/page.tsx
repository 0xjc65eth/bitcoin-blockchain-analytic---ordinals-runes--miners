'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { fetchCollections } from '@/lib/api'
import type { Collection } from '@/lib/api'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function RunesPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCollections()
      setCollections(data.filter(c => c.runeInfo))
      setLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchData, 300000) // Update every 5 minutes

    return () => clearInterval(interval)
  }, [])

  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: {
        show: true
      },
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: true,
          speed: 800
        }
      }
    },
    theme: {
      mode: 'dark'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: collections.map(c => c.runeInfo?.symbol || ''),
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Volume (BTC)',
        style: {
          color: '#9ca3af'
        }
      },
      labels: {
        style: {
          colors: '#9ca3af'
        },
        formatter: (value) => value.toFixed(2)
      }
    },
    fill: {
      opacity: 1,
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#6366f1',
            opacity: 1
          },
          {
            offset: 100,
            color: '#8b5cf6',
            opacity: 0.8
          }
        ]
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toFixed(2)} BTC`
      }
    }
  }

  const barChartSeries = [{
    name: '24h Volume',
    data: collections.map(c => c.runeInfo?.volume24h || 0)
  }]

  return (
    <div className="min-h-screen bg-dark-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Runes Market</h1>
          <p className="text-gray-400">Real-time analysis of Runes trading activity and market data</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Active Runes</h3>
                <p className="text-2xl font-bold text-white">{collections.length}</p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Total Volume (24h)</h3>
                <p className="text-2xl font-bold text-white">
                  {collections.reduce((acc, c) => acc + (c.runeInfo?.volume24h || 0), 0).toFixed(2)} BTC
                </p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Total Transactions (24h)</h3>
                <p className="text-2xl font-bold text-white">
                  {collections.reduce((acc, c) => acc + (c.runeInfo?.transactions24h || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Total Market Cap</h3>
                <p className="text-2xl font-bold text-white">
                  {collections.reduce((acc, c) => acc + (c.runeInfo?.marketCap || 0), 0).toFixed(2)} BTC
                </p>
              </div>
            </div>

            {/* Volume Chart */}
            <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-primary-400 mb-4">Trading Volume (24h)</h3>
              <div className="h-[400px]">
                <Chart
                  options={barChartOptions}
                  series={barChartSeries}
                  type="bar"
                  height="100%"
                />
              </div>
            </div>

            {/* Runes Table */}
            <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-primary-600/20">
                <h3 className="text-lg font-semibold text-primary-400">Runes Market Data</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Symbol</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Price (BTC)</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Market Cap</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Volume (24h)</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Supply</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Holders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map(collection => (
                      <tr key={collection.id} className="border-t border-primary-600/10">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-white font-medium">{collection.runeInfo?.symbol}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white">{collection.runeInfo?.price.toFixed(8)}</td>
                        <td className="px-6 py-4 text-white">{collection.runeInfo?.marketCap.toFixed(2)}</td>
                        <td className="px-6 py-4 text-white">{collection.runeInfo?.volume24h.toFixed(2)}</td>
                        <td className="px-6 py-4 text-white">{collection.runeInfo?.supply.toLocaleString()}</td>
                        <td className="px-6 py-4 text-white">{collection.runeInfo?.holders.toLocaleString()}</td>
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