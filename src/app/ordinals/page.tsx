'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { fetchCollections } from '@/lib/api'
import type { Collection } from '@/lib/api'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function OrdinalsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h')

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCollections()
      setCollections(data.filter(c => !c.runeInfo)) // Only show NFT collections
      setLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchData, 300000) // Update every 5 minutes

    return () => clearInterval(interval)
  }, [])

  const lineChartOptions: ApexOptions = {
    chart: {
      type: 'line',
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
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: collections.slice(0, 10).map(c => c.name),
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Floor Price (BTC)',
        style: {
          color: '#9ca3af'
        }
      },
      labels: {
        style: {
          colors: '#9ca3af'
        },
        formatter: (value) => value.toFixed(4)
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4
    },
    markers: {
      size: 6,
      colors: ['#6366f1'],
      strokeColors: '#8b5cf6',
      strokeWidth: 2
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toFixed(4)} BTC`
      }
    }
  }

  const lineChartSeries = [{
    name: 'Floor Price',
    data: collections.slice(0, 10).map(c => c.floorPrice)
  }]

  return (
    <div className="min-h-screen bg-dark-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Ordinals Market</h1>
          <p className="text-gray-400">Real-time analysis of Bitcoin NFT collections and market data</p>
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
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Collections</h3>
                <p className="text-2xl font-bold text-white">{collections.length}</p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Total Volume ({timeframe})</h3>
                <p className="text-2xl font-bold text-white">
                  {collections.reduce((acc, c) => acc + c.volume24h, 0).toFixed(2)} BTC
                </p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Avg Floor Price</h3>
                <p className="text-2xl font-bold text-white">
                  {(collections.reduce((acc, c) => acc + c.floorPrice, 0) / collections.length).toFixed(4)} BTC
                </p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Total Holders</h3>
                <p className="text-2xl font-bold text-white">
                  {collections.reduce((acc, c) => acc + c.holders, 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex justify-end mb-6">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setTimeframe('24h')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    timeframe === '24h'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-200 text-gray-400 hover:bg-dark-300'
                  }`}
                >
                  24h
                </button>
                <button
                  onClick={() => setTimeframe('7d')}
                  className={`px-4 py-2 text-sm font-medium ${
                    timeframe === '7d'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-200 text-gray-400 hover:bg-dark-300'
                  }`}
                >
                  7d
                </button>
                <button
                  onClick={() => setTimeframe('30d')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    timeframe === '30d'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-200 text-gray-400 hover:bg-dark-300'
                  }`}
                >
                  30d
                </button>
              </div>
            </div>

            {/* Floor Price Chart */}
            <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-primary-400 mb-4">Top Collections Floor Price</h3>
              <div className="h-[400px]">
                <Chart
                  options={lineChartOptions}
                  series={lineChartSeries}
                  type="line"
                  height="100%"
                />
              </div>
            </div>

            {/* Collections Table */}
            <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-primary-600/20">
                <h3 className="text-lg font-semibold text-primary-400">Collections</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Collection</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Floor Price</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Volume ({timeframe})</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Supply</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Holders</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-400">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map(collection => (
                      <tr key={collection.id} className="border-t border-primary-600/10">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {collection.imageUrl && (
                              <Image
                                src={collection.imageUrl}
                                alt={collection.name}
                                width={32}
                                height={32}
                                className="rounded-full mr-3"
                              />
                            )}
                            <span className="text-white font-medium">{collection.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white">{collection.floorPrice.toFixed(4)} BTC</td>
                        <td className="px-6 py-4 text-white">{collection.volume24h.toFixed(2)} BTC</td>
                        <td className="px-6 py-4 text-white">{collection.totalSupply.toLocaleString()}</td>
                        <td className="px-6 py-4 text-white">{collection.holders.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          {collection.verified ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Unverified
                            </span>
                          )}
                        </td>
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