'use client'

import { useMarketData } from '@/hooks/useMarketData'
import { DashboardCard } from '@/components/dashboard-card'
import { RiArrowUpSLine, RiArrowDownSLine, RiLineChartLine, RiExchangeDollarLine, RiCoinLine, RiTimeLine, RiRefreshLine } from 'react-icons/ri'
import { useMemo, useState, useEffect } from 'react'

export function BitcoinPriceCard() {
  const [mounted, setMounted] = useState(false)
  const marketData = useMarketData()
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [timeAgo, setTimeAgo] = useState<string>('just now')

  // Evitar hidratação usando useEffect para renderizar apenas no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  const deltaType = (marketData?.btcChange24h ?? 0) >= 0 ? "increase" : "decrease"
  const DeltaIcon = (marketData?.btcChange24h ?? 0) >= 0 ? RiArrowUpSLine : RiArrowDownSLine
  const changeColor = (marketData?.btcChange24h ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"

  // Update last updated time
  useEffect(() => {
    if (marketData?.lastUpdated) {
      console.log('Last updated time:', marketData.lastUpdated)
      setLastUpdated(new Date(marketData.lastUpdated))
    }
  }, [marketData?.lastUpdated])

  // Log market data for debugging
  useEffect(() => {
    console.log('Market data in component:', marketData)
  }, [marketData])

  // Update time ago string
  useEffect(() => {
    if (!lastUpdated) return

    const updateTimeAgo = () => {
      const now = new Date()
      const diffMs = now.getTime() - lastUpdated.getTime()
      const diffSec = Math.floor(diffMs / 1000)

      if (diffSec < 10) {
        setTimeAgo('just now')
      } else if (diffSec < 60) {
        setTimeAgo(`${diffSec} seconds ago`)
      } else if (diffSec < 3600) {
        const diffMin = Math.floor(diffSec / 60)
        setTimeAgo(`${diffMin} minute${diffMin > 1 ? 's' : ''} ago`)
      } else {
        const diffHour = Math.floor(diffSec / 3600)
        setTimeAgo(`${diffHour} hour${diffHour > 1 ? 's' : ''} ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 10000)
    return () => clearInterval(interval)
  }, [lastUpdated])

  // Generate historical data for the chart
  const priceHistory = useMemo(() => {
    // Usar um valor fixo para evitar problemas de hidratação
    const basePrice = 65000; // Valor fixo para evitar diferenças entre servidor e cliente
    const volatility = 0.02; // 2% volatility

    // Use a seed fixa para garantir que os valores sejam os mesmos no servidor e no cliente
    const seed = 12345; // Seed fixa
    const pseudoRandom = (index: number) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 24 }, (_, i) => {
      const hourAgo = 24 - i;
      const randomFactor = 1 + (pseudoRandom(i) * volatility * 2 - volatility);
      const price = basePrice * randomFactor;
      return {
        time: `${hourAgo}h ago`,
        price: price
      };
    }).reverse();
  }, []); // Remover dependência para evitar recálculos diferentes

  // Calculate additional metrics
  const hourlyChange = useMemo(() => {
    if (priceHistory.length < 2) return 0;
    const current = priceHistory[priceHistory.length - 1].price;
    const previous = priceHistory[priceHistory.length - 2].price;
    return ((current - previous) / previous) * 100;
  }, [priceHistory]);

  return (
    <DashboardCard title="Bitcoin Real-Time Analytics" className="bg-gradient-to-br from-[#1A1A3A] to-[#2A2A5A] border-none shadow-xl">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <RiCoinLine className="w-6 h-6 text-yellow-500 mr-2" />
            <div className="flex items-center">
              {marketData.isLoading ? (
                <>
                  <p className="text-3xl font-bold text-white opacity-50">
                    {mounted && marketData?.btcPrice
                      ? `$${(marketData.btcPrice).toLocaleString()}`
                      : "$64,200.00" /* Valor fixo para SSR */
                    }
                  </p>
                  <RiRefreshLine className="w-5 h-5 text-blue-400 ml-2 animate-spin" />
                </>
              ) : (
                <p className="text-3xl font-bold text-white">
                  {mounted
                    ? `$${(marketData?.btcPrice ?? 0).toLocaleString()}`
                    : "$64,200.00" /* Valor fixo para SSR */
                  }
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center mt-1">
            <DeltaIcon className={`w-4 h-4 ${changeColor}`} />
            <span className={`${changeColor} font-medium mr-2`}>
              {mounted
                ? (marketData?.btcChange24h ?? 0).toFixed(2)
                : "0.00" /* Valor fixo para SSR */
              }%
            </span>
            <span className="text-xs text-gray-300">(24h)</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-1 animate-ping"></div>
            <span className="px-2 py-1 rounded bg-blue-500/30 text-xs font-bold text-white border border-blue-400">
              CoinMarketCap API
            </span>
          </div>
          <div className="flex items-center mt-1">
            <RiTimeLine className="w-3 h-3 text-gray-400 mr-1" />
            <p className="text-xs text-gray-300">Updated {mounted ? timeAgo : "just now"}</p>
          </div>
        </div>
      </div>

      {/* Price chart visualization (simplified) */}
      <div className="mt-4 h-20 flex items-end">
        {priceHistory.map((point, index) => {
          const height = `${(point.price / (marketData?.btcPrice || 65000)) * 100}%`;
          const isPositive = index > 0 && point.price >= priceHistory[index - 1].price;
          return (
            <div
              key={index}
              className="flex-1"
              title={`${point.time}: $${point.price.toLocaleString()}`}
            >
              <div
                className={`w-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'} rounded-sm mx-px`}
                style={{ height: mounted ? `${Math.min(Math.abs(hourlyChange) * 10, 100)}%` : "5%" }}
              ></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-indigo-500/10 p-3 rounded border border-indigo-500/20">
          <div className="flex items-center">
            <RiExchangeDollarLine className="w-4 h-4 text-indigo-400 mr-2" />
            <p className="text-xs text-indigo-300">24h Volume</p>
          </div>
          <p className="text-sm font-medium text-white mt-1">
            {mounted
              ? `$${(marketData?.volume24h ?? 0).toLocaleString()}`
              : "$45,678,901,234" /* Valor fixo para SSR */
            }
          </p>
        </div>
        <div className="bg-violet-500/10 p-3 rounded border border-violet-500/20">
          <div className="flex items-center">
            <RiLineChartLine className="w-4 h-4 text-violet-400 mr-2" />
            <p className="text-xs text-violet-300">Market Cap</p>
          </div>
          <p className="text-sm font-medium text-white mt-1">
            {mounted
              ? `$${(marketData?.marketCap ?? 0).toLocaleString()}`
              : "$1,234,567,890,123" /* Valor fixo para SSR */
            }
          </p>
        </div>
      </div>

      <div className="mt-4 bg-blue-500/10 p-3 rounded border border-blue-500/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <p className="text-xs text-blue-300">Hourly Change</p>
          </div>
          <div className="flex items-center">
            {hourlyChange >= 0 ? (
              <RiArrowUpSLine className="w-3 h-3 text-emerald-400" />
            ) : (
              <RiArrowDownSLine className="w-3 h-3 text-rose-400" />
            )}
            <span className={hourlyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {mounted
                ? Math.abs(hourlyChange).toFixed(2)
                : "0.05" /* Valor fixo para SSR */
              }%
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-700 h-1 mt-2 rounded-full">
          <div
            className={`h-1 rounded-full ${hourlyChange >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
            style={{ width: mounted ? `${Math.min(Math.abs(hourlyChange) * 10, 100)}%` : "5%" }}
          ></div>
        </div>
      </div>
    </DashboardCard>
  )
}
