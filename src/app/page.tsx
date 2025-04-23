'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { fetchBitcoinPrice, fetchCollections } from '@/lib/api'
import { ApexOptions } from 'apexcharts'
import WhaleAlert from '@/components/WhaleAlert'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Stats {
  totalInscriptions: number
  totalCollections: number
  floorPrice: number
  volume24h: number
  btcPrice: number
}

interface FeaturedCollection {
  name: string
  floorPrice: number
  imageUrl: string
  benefits: string[]
}

interface ChartData {
  dates: string[]
  prices: number[]
  volumes: number[]
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalInscriptions: 0,
    totalCollections: 0,
    floorPrice: 0,
    volume24h: 0,
    btcPrice: 0
  })

  const [featuredCollections] = useState<FeaturedCollection[]>([
    {
      name: 'SEIZE CTRL',
      floorPrice: 0.89,
      imageUrl: '/collections/seize-ctrl.jpg',
      benefits: ['Early Access to New Features', 'Exclusive Airdrops', 'Community Governance']
    },
    {
      name: 'ONCHAIN MONKEYS',
      floorPrice: 1.2,
      imageUrl: '/collections/onchain-monkeys.jpg',
      benefits: ['Special Events Access', 'Trading Fee Discounts', 'Exclusive Merchandise']
    },
    {
      name: 'STACK SATS',
      floorPrice: 0.75,
      imageUrl: '/collections/stack-sats.jpg',
      benefits: ['Staking Rewards', 'Premium Analytics', 'Private Discord Access']
    },
    {
      name: 'BITCOIN PUPPETS',
      floorPrice: 0.95,
      imageUrl: '/collections/bitcoin-puppets.jpg',
      benefits: ['NFT Whitelist Spots', 'Community Events', 'Exclusive Content']
    },
    {
      name: 'THE WIZARD OF LORD',
      floorPrice: 1.5,
      imageUrl: '/collections/wizard-lord.jpg',
      benefits: ['Metaverse Access', 'Special Roles', 'Future Game Benefits']
    },
    {
      name: 'MULTIVERSO',
      floorPrice: 1.8,
      imageUrl: '/collections/multiverso.jpg',
      benefits: ['Exclusive Community Access', 'Early Feature Testing', 'Special Governance Rights', 'Premium Support']
    }
  ])

  const [chartData] = useState<{
    options: ApexOptions,
    series: any[]
  }>({
    options: {
      chart: {
        type: 'area',
        height: 350,
        group: 'market',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        animations: {
          enabled: true,
          dynamicAnimation: {
            enabled: true,
            speed: 800
          }
        },
        background: 'transparent'
      },
      theme: {
        mode: 'dark',
        palette: 'palette1'
      },
      stroke: {
        curve: 'smooth',
        width: [2, 2],
        dashArray: [0, 0]
      },
      fill: {
        type: ['gradient', 'gradient'],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: '#6366f1',
              opacity: 0.8
            },
            {
              offset: 100,
              color: '#6366f1',
              opacity: 0.2
            }
          ]
        }
      },
      grid: {
        borderColor: 'rgba(99, 102, 241, 0.1)',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: [{
          formatter: (value: number) => `$${value.toLocaleString()}`
        }, {
          formatter: (value: number) => `$${value.toLocaleString()}`
        }]
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#9ca3af'
          },
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM',
            day: 'dd MMM',
            hour: 'HH:mm'
          }
        }
      },
      yaxis: [
        {
          title: {
            text: 'Price (USD)',
            style: {
              color: '#9ca3af'
            }
          },
          labels: {
            style: {
              colors: '#9ca3af'
            },
            formatter: (value: number) => `$${value.toLocaleString()}`
          }
        },
        {
          opposite: true,
          title: {
            text: 'Volume (USD)',
            style: {
              color: '#9ca3af'
            }
          },
          labels: {
            style: {
              colors: '#9ca3af'
            },
            formatter: (value: number) => `$${value.toLocaleString()}`
          }
        }
      ],
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#9ca3af'
        }
      }
    },
    series: [
      {
        name: 'Price',
        type: 'area',
        data: [[new Date().getTime(), 50000]]
      },
      {
        name: 'Volume',
        type: 'area',
        data: [[new Date().getTime(), 1000000]]
      }
    ]
  })

  useEffect(() => {
    const loadData = async () => {
      const btcPrice = await fetchBitcoinPrice()
      const collections = await fetchCollections()
      
      setStats({
        totalInscriptions: 31245678,
        totalCollections: collections.length,
        floorPrice: collections[0]?.floorPrice || 0,
        volume24h: collections.reduce((acc, col) => acc + col.volume24h, 0),
        btcPrice
      })
    }

    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-purple/20 blur-3xl"></div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-accent-purple to-primary-600 bg-clip-text text-transparent relative">
            Explore the Future of Digital Assets
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto relative">
            Advanced analytics and tracking for Bitcoin Ordinals and Inscriptions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="card bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-2">Total Inscriptions</h3>
            <p className="text-3xl font-bold text-white">
              {stats.totalInscriptions.toLocaleString()}
            </p>
          </div>
          <div className="card bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-2">Collections</h3>
            <p className="text-3xl font-bold text-white">
              {stats.totalCollections.toLocaleString()}
            </p>
          </div>
          <div className="card bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-2">Floor Price</h3>
            <p className="text-3xl font-bold text-white">
              {stats.floorPrice.toFixed(4)} BTC
            </p>
            <p className="text-sm text-gray-400">
              ${(stats.floorPrice * stats.btcPrice).toFixed(2)}
            </p>
          </div>
          <div className="card bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-2">24h Volume</h3>
            <p className="text-3xl font-bold text-white">
              {stats.volume24h.toFixed(2)} BTC
            </p>
            <p className="text-sm text-gray-400">
              ${(stats.volume24h * stats.btcPrice).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 p-6 rounded-xl mb-16">
          <h2 className="text-xl font-semibold mb-4">Market Activity</h2>
          <div className="h-[400px]">
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="area"
              height="100%"
              width="100%"
            />
          </div>
        </div>

        {/* Featured Collections */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary-400 to-accent-purple bg-clip-text text-transparent">
            Featured Collections with Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCollections.map((collection) => (
              <div key={collection.name} className="group">
                <div className="card bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 p-6 rounded-xl transition-all duration-300 hover:bg-dark-300/50 hover:border-primary-500/30">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-dark-300">
                    <img
                      src={collection.imageUrl}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-primary-400">{collection.name}</h3>
                  <p className="text-lg font-semibold mb-4">Floor: {collection.floorPrice} BTC</p>
                  <div className="space-y-2">
                    {collection.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-gray-400">
                        <span className="w-2 h-2 bg-primary-400 rounded-full mr-2"></span>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/collections" className="group">
            <div className="card bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 p-8 rounded-xl transition-all duration-300 hover:bg-dark-300/50 hover:border-primary-500/30">
              <h3 className="text-xl font-semibold mb-4 text-primary-400">Ordinals Explorer</h3>
              <p className="text-gray-400">
                Browse and analyze the latest Ordinal inscriptions and collections
              </p>
            </div>
          </Link>
          
          <Link href="/market" className="group">
            <div className="card bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 p-8 rounded-xl transition-all duration-300 hover:bg-dark-300/50 hover:border-primary-500/30">
              <h3 className="text-xl font-semibold mb-4 text-primary-400">Market Analytics</h3>
              <p className="text-gray-400">
                Advanced market analysis, real-time price tracking, and detailed trading volume metrics
              </p>
            </div>
          </Link>
          
          <Link href="/insights" className="group">
            <div className="card bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 p-8 rounded-xl transition-all duration-300 hover:bg-dark-300/50 hover:border-primary-500/30">
              <h3 className="text-xl font-semibold mb-4 text-primary-400">Market Insights</h3>
              <p className="text-gray-400">
                Smart market analysis, trend predictions, and whale movement tracking
              </p>
            </div>
          </Link>
        </div>
      </div>
      
      <WhaleAlert />

      {/* Footer with Community Benefits */}
      <footer className="bg-dark-200/50 backdrop-blur-sm border-t border-primary-600/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary-400">Featured Communities</h3>
              <p className="text-gray-400">
                Our featured communities - SEIZE CTRL, ONCHAIN MONKEYS, THE WIZARD OF LORD, STACK SATS, BITCOIN PUPPETS, and MULTIVERSO - will receive exclusive future benefits and privileges.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary-400">Future Benefits</h3>
              <ul className="text-gray-400 space-y-2">
                <li>• Early access to new platform features</li>
                <li>• Exclusive airdrops and rewards</li>
                <li>• Special governance rights</li>
                <li>• Premium analytics and insights</li>
                <li>• Community-exclusive events</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary-400">Ecosystem Integration</h3>
              <p className="text-gray-400">
                Members of these communities will play a key role in shaping the future of our platform through voting rights, feature testing, and exclusive access to upcoming products and services.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
