'use client'

import { DashboardCard } from '@/components/dashboard-card'
import { useOrdinalsStats } from '@/hooks/useOrdinalsStats'
import { RiArrowUpSLine, RiArrowDownSLine, RiLineChartLine, RiPieChartLine, RiDatabase2Line, RiStackLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'

export function OrdinalsStatsCard() {
  const [mounted, setMounted] = useState(false)
  const { data: ordinalsData, isLoading, isError } = useOrdinalsStats()

  // Evitar hidratação usando useEffect para renderizar apenas no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate a mock growth percentage for demonstration
  const inscriptionGrowth = 2.8;
  const volumeGrowth = 5.2;
  const floorPriceGrowth = -1.3;
  const collectionsGrowth = 1.5;

  if (isLoading) {
    return (
      <DashboardCard title="Ordinals Analytics" className="bg-gradient-to-br from-[#1A1A3A] to-[#2A2A5A] border-none shadow-xl">
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
              <RiDatabase2Line className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-indigo-300">Total Inscriptions</p>
              <div className="h-8 w-32 bg-indigo-500/20 rounded mt-1" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
              <RiStackLine className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-purple-300">Total Collections</p>
              <div className="h-8 w-32 bg-purple-500/20 rounded mt-1" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
              <RiLineChartLine className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-300">24h Volume</p>
              <div className="h-8 w-32 bg-blue-500/20 rounded mt-1" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
              <RiPieChartLine className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-emerald-300">Floor Price</p>
              <div className="h-8 w-32 bg-emerald-500/20 rounded mt-1" />
            </div>
          </div>
        </div>
      </DashboardCard>
    )
  }

  if (isError) {
    return (
      <DashboardCard title="Ordinals Analytics" className="bg-gradient-to-br from-[#1A1A3A] to-[#2A2A5A] border-none shadow-xl">
        <div className="space-y-4">
          <p className="text-sm text-rose-400">Failed to load data</p>
          <p className="text-xs text-indigo-300">Please try again later</p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard title="Ordinals Analytics" className="bg-gradient-to-br from-[#1A1A3A] to-[#2A2A5A] border-none shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
              <RiDatabase2Line className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-indigo-300">Total Inscriptions</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-white">
                  {mounted
                    ? (ordinalsData?.total_inscriptions?.toLocaleString() || '0')
                    : "12,345,678" /* Valor fixo para SSR */
                  }
                </p>
                <div className="flex items-center ml-2">
                  {inscriptionGrowth >= 0 ? (
                    <RiArrowUpSLine className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <RiArrowDownSLine className="w-4 h-4 text-rose-400" />
                  )}
                  <span className={`text-xs font-medium ${inscriptionGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {mounted
                      ? Math.abs(inscriptionGrowth).toFixed(1)
                      : "2.8" /* Valor fixo para SSR */
                    }%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-indigo-500 text-xs font-bold animate-pulse text-white">Real-time Updates</span>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
            <RiStackLine className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-purple-300">Total Collections</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-white">
                {mounted
                  ? (ordinalsData?.total_collections?.toLocaleString() || '0')
                  : "1,234" /* Valor fixo para SSR */
                }
              </p>
              <div className="flex items-center ml-2">
                {collectionsGrowth >= 0 ? (
                  <RiArrowUpSLine className="w-4 h-4 text-emerald-400" />
                ) : (
                  <RiArrowDownSLine className="w-4 h-4 text-rose-400" />
                )}
                <span className={`text-xs font-medium ${collectionsGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {mounted
                    ? Math.abs(collectionsGrowth).toFixed(1)
                    : "1.5" /* Valor fixo para SSR */
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
            <RiLineChartLine className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-blue-300">24h Volume</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-white">
                ${mounted
                  ? (ordinalsData?.volume_24h?.toLocaleString() || '0')
                  : "9,876,543" /* Valor fixo para SSR */
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
                    : "5.2" /* Valor fixo para SSR */
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
            <RiPieChartLine className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-emerald-300">Floor Price</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-white">
                ${mounted
                  ? (ordinalsData?.floor_price?.toLocaleString() || '0')
                  : "1,234" /* Valor fixo para SSR */
                }
              </p>
              <div className="flex items-center ml-2">
                {floorPriceGrowth >= 0 ? (
                  <RiArrowUpSLine className="w-4 h-4 text-emerald-400" />
                ) : (
                  <RiArrowDownSLine className="w-4 h-4 text-rose-400" />
                )}
                <span className={`text-xs font-medium ${floorPriceGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {mounted
                    ? Math.abs(floorPriceGrowth).toFixed(1)
                    : "1.3" /* Valor fixo para SSR */
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        {ordinalsData?.popular_collections?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-indigo-500/20">
            <p className="text-sm text-indigo-300 mb-2">Top Collections</p>
            <ul className="space-y-2">
              {ordinalsData.popular_collections.slice(0, 3).map((collection: any, index: number) => (
                <li key={index} className="flex justify-between items-center text-xs bg-indigo-500/10 p-2 rounded">
                  <span className="font-medium text-white">{collection.name}</span>
                  <div className="flex items-center">
                    <span className="text-emerald-400 mr-2">${(Math.random() * 0.1).toFixed(4)}</span>
                    <span className="text-indigo-300">{collection.item_count?.toLocaleString() || 0} items</span>
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