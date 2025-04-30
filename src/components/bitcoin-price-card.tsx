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
    <DashboardCard
      title="Bitcoin Real-Time Analytics"
      subtitle="Live price and market data"
      colorScheme="orange"
      className="shadow-xl"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mr-3">
              <RiCoinLine className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center">
              {marketData.isLoading ? (
                <>
                  <div className="flex flex-col">
                    <p className="text-3xl font-bold text-white opacity-50">
                      {mounted && marketData?.btcPrice
                        ? `$${(marketData.btcPrice).toLocaleString()}`
                        : "$64,200.00" /* Valor fixo para SSR */
                      }
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-300 flex items-center gap-1.5">
                        <RiRefreshLine className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        Loading latest data...
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <p className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text">
                    {mounted
                      ? `$${(marketData?.btcPrice ?? 0).toLocaleString()}`
                      : "$64,200.00" /* Valor fixo para SSR */
                    }
                  </p>
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
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              CoinMarketCap API
            </span>
          </div>
          <div className="flex items-center mt-2">
            <RiTimeLine className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <p className="text-xs text-gray-300">Updated {mounted ? timeAgo : "just now"}</p>
          </div>
        </div>
      </div>

      {/* Price chart visualization (improved) */}
      <div className="mt-6 h-24 flex items-end bg-slate-800/30 rounded-lg p-2 border border-slate-700/30">
        {priceHistory.map((point, index) => {
          const height = `${(point.price / (marketData?.btcPrice || 65000)) * 100}%`;
          const isPositive = index > 0 && point.price >= priceHistory[index - 1].price;

          // Create gradient effect for bars
          const gradientClass = isPositive
            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
            : 'bg-gradient-to-t from-rose-600 to-rose-400';

          return (
            <div
              key={index}
              className="flex-1 px-0.5"
              title={`${point.time}: $${point.price.toLocaleString()}`}
            >
              <div
                className={`w-full ${gradientClass} rounded-t-sm shadow-lg`}
                style={{
                  height: mounted ? `${Math.max(Math.min((point.price / (marketData?.btcPrice || 65000)) * 100, 100), 5)}%` : "5%",
                  filter: 'brightness(1.1)'
                }}
              >
                <div className="w-full h-full bg-white/10 rounded-t-sm"></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-4 rounded-xl border border-indigo-500/30 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
              <RiExchangeDollarLine className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xs text-indigo-300 font-medium">24h Volume</p>
          </div>
          <p className="text-lg font-bold text-white">
            {mounted
              ? `$${(marketData?.volume24h ?? 0).toLocaleString()}`
              : "$45,678,901,234" /* Valor fixo para SSR */
            }
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 p-4 rounded-xl border border-purple-500/30 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
              <RiLineChartLine className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xs text-purple-300 font-medium">Market Cap</p>
          </div>
          <p className="text-lg font-bold text-white">
            {mounted
              ? `$${(marketData?.marketCap ?? 0).toLocaleString()}`
              : "$1,234,567,890,123" /* Valor fixo para SSR */
            }
          </p>
        </div>
      </div>

      <div className="mt-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 rounded-xl border border-blue-500/30 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-sm text-blue-300 font-medium">Hourly Change</p>
          </div>
          <div className="flex items-center">
            {hourlyChange >= 0 ? (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <RiArrowUpSLine className="w-3.5 h-3.5" />
                <span className="font-medium">
                  {mounted
                    ? Math.abs(hourlyChange).toFixed(2)
                    : "0.05" /* Valor fixo para SSR */
                  }%
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400">
                <RiArrowDownSLine className="w-3.5 h-3.5" />
                <span className="font-medium">
                  {mounted
                    ? Math.abs(hourlyChange).toFixed(2)
                    : "0.05" /* Valor fixo para SSR */
                  }%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-slate-800/50 h-2.5 mt-2 rounded-full p-0.5">
          <div
            className={`h-1.5 rounded-full ${hourlyChange >= 0 ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-rose-500 to-red-500'}`}
            style={{ width: mounted ? `${Math.min(Math.abs(hourlyChange) * 10, 100)}%` : "5%" }}
          >
            <div className="w-full h-full bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-700/30 text-xs text-gray-300 flex justify-between items-center">
        <span className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Real-time price data
        </span>
        <span className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Atualizado: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </DashboardCard>
  )
}
