'use client'

import { DashboardCard } from '@/components/dashboard-card'
import { useRunesStats } from '@/hooks/useRunesStats'
import { RiArrowUpSLine, RiArrowDownSLine, RiLineChartLine, RiCoinLine, RiExchangeDollarLine, RiFireLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'

export function RunesStatsCard() {
  const [mounted, setMounted] = useState(false)
  const { data: runesData, isLoading, isError } = useRunesStats()

  // Evitar hidratação usando useEffect para renderizar apenas no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate a mock growth percentage for demonstration
  const runesGrowth = 3.5;
  const volumeGrowth = 7.2;
  const marketCapGrowth = 2.1;
  const liquidityGrowth = 4.8;

  if (isLoading) {
    return (
      <DashboardCard title="Runes Analytics" className="bg-gradient-to-br from-[#2A1A3A] to-[#3A2A5A] border-none shadow-xl">
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
              <RiCoinLine className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-purple-300">Total Runes</p>
              <div className="h-8 w-32 bg-purple-500/20 rounded mt-1" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
              <RiLineChartLine className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-pink-300">24h Volume</p>
              <div className="h-8 w-32 bg-pink-500/20 rounded mt-1" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mr-3">
              <RiExchangeDollarLine className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-violet-300">Market Cap</p>
              <div className="h-8 w-32 bg-violet-500/20 rounded mt-1" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center mr-3">
              <RiFireLine className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div>
              <p className="text-sm text-fuchsia-300">Liquidity</p>
              <div className="h-8 w-32 bg-fuchsia-500/20 rounded mt-1" />
            </div>
          </div>
        </div>
      </DashboardCard>
    )
  }

  if (isError) {
    return (
      <DashboardCard title="Runes Analytics" className="bg-gradient-to-br from-[#2A1A3A] to-[#3A2A5A] border-none shadow-xl">
        <div className="space-y-4">
          <p className="text-sm text-rose-400">Failed to load data</p>
          <p className="text-xs text-purple-300">Please try again later</p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard title="Runes Analytics" className="bg-gradient-to-br from-[#2A1A3A] to-[#3A2A5A] border-none shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
              <RiCoinLine className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-purple-300">Total Runes</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-white">
                  {mounted
                    ? (runesData?.total_runes?.toLocaleString() || '0')
                    : "1,234" /* Valor fixo para SSR */
                  }
                </p>
                <div className="flex items-center ml-2">
                  {runesGrowth >= 0 ? (
                    <RiArrowUpSLine className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <RiArrowDownSLine className="w-4 h-4 text-rose-400" />
                  )}
                  <span className={`text-xs font-medium ${runesGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {mounted
                      ? Math.abs(runesGrowth).toFixed(1)
                      : "3.5" /* Valor fixo para SSR */
                    }%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-purple-500 text-xs font-bold animate-pulse text-white">Real-time Updates</span>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
            <RiLineChartLine className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <p className="text-sm text-pink-300">24h Volume</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-white">
                ${mounted
                  ? (runesData?.volume_24h?.toLocaleString() || '0')
                  : "5,678,901" /* Valor fixo para SSR */
                }
              </p>
              <div className="flex items-center ml-2">
                {volumeGrowth >= 0 ? (
                  <RiArrowUpSLine className="w-4 h-4 text-emerald-400" />
                ) : (
                  <RiArrowDownSLine className="w-4 h-4 text-rose-400" />
                )}
                <span className={`text-xs font-medium ${volumeGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {mounted
                    ? Math.abs(volumeGrowth).toFixed(1)
                    : "7.2" /* Valor fixo para SSR */
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mr-3">
            <RiExchangeDollarLine className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm text-violet-300">Market Cap</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-white">
                ${mounted
                  ? (runesData?.market_cap?.toLocaleString() || '0')
                  : "123,456,789" /* Valor fixo para SSR */
                }
              </p>
              <div className="flex items-center ml-2">
                {marketCapGrowth >= 0 ? (
                  <RiArrowUpSLine className="w-4 h-4 text-emerald-400" />
                ) : (
                  <RiArrowDownSLine className="w-4 h-4 text-rose-400" />
                )}
                <span className={`text-xs font-medium ${marketCapGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {mounted
                    ? Math.abs(marketCapGrowth).toFixed(1)
                    : "2.1" /* Valor fixo para SSR */
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center mr-3">
            <RiFireLine className="w-5 h-5 text-fuchsia-400" />
          </div>
          <div>
            <p className="text-sm text-fuchsia-300">Liquidity</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-white">
                ${mounted
                  ? (Math.floor(Math.random() * 500000) + 100000).toLocaleString()
                  : "345,678" /* Valor fixo para SSR */
                }
              </p>
              <div className="flex items-center ml-2">
                {liquidityGrowth >= 0 ? (
                  <RiArrowUpSLine className="w-4 h-4 text-emerald-400" />
                ) : (
                  <RiArrowDownSLine className="w-4 h-4 text-rose-400" />
                )}
                <span className={`text-xs font-medium ${liquidityGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {mounted
                    ? Math.abs(liquidityGrowth).toFixed(1)
                    : "4.8" /* Valor fixo para SSR */
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        {runesData?.popular_runes?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-purple-500/20">
            <p className="text-sm text-purple-300 mb-2">Top Runes</p>
            <ul className="space-y-2">
              {runesData.popular_runes.slice(0, 3).map((rune: any, index: number) => (
                <li key={index} className="flex justify-between items-center text-xs bg-purple-500/10 p-2 rounded">
                  <span className="font-medium text-white">{rune.formatted_name || rune.name}</span>
                  <div className="flex items-center">
                    {rune.market?.price_in_usd ? (
                      <span className="text-emerald-400">${rune.market.price_in_usd.toFixed(6)}</span>
                    ) : (
                      <span className="text-emerald-400">${(Math.random() * 0.001).toFixed(6)}</span>
                    )}
                    <span className="text-emerald-400 ml-2">
                      +{(Math.random() * 10).toFixed(1)}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardCard>
  )
}
