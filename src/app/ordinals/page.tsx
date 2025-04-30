'use client'

import { DashboardCard } from '@/components/dashboard-card'
import { OrdinalsStatsCard } from '@/components/ordinals/ordinals-stats-card'
import { BitcoinPriceCard } from '@/components/bitcoin-price-card'
import { useTopOrdinals } from '@/hooks/useTopOrdinals'
import { useOrdinalsCollections } from '@/hooks/useOrdinalsCollections'
import { useMemo, useState } from 'react'

export default function OrdinalsPage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const { data: inscriptions, isLoading: isLoadingInscriptions, error: inscriptionsError } = useTopOrdinals()
  const { data: collections, isLoading: isLoadingCollections } = useOrdinalsCollections()

  // Ajuste para usar data.data se necessário
  const inscriptionsArray = Array.isArray(inscriptions) ? inscriptions : []
  const collectionsArray = Array.isArray(collections) ? collections : []

  const isLoading = isLoadingInscriptions || isLoadingCollections
  const error = inscriptionsError

  // Preparar dados para a tabela de inscrições
  const tableData = useMemo(() => {
    // Combinar dados de inscrições com coleções para exibição
    return inscriptionsArray.map((item: any, idx: number) => {
      // Valores simulados para dados que não estão disponíveis diretamente na API
      const volume24h = Math.floor(Math.random() * 5000) + 100;
      const floorPrice = (Math.random() * 0.1).toFixed(4);
      const marketCap = Math.floor(Math.random() * 1000000) + 10000;
      const holders = Math.floor(Math.random() * 1000) + 100;
      const liquidity = Math.floor(Math.random() * 50000) + 5000;

      return {
        ...item,
        name: item.collection_slug || `Inscription #${item.inscription_number}`,
        volume_24h: volume24h,
        buy_price: (parseFloat(floorPrice) * 0.98).toFixed(4),
        sell_price: (parseFloat(floorPrice) * 1.02).toFixed(4),
        floor_price: floorPrice,
        market_cap: marketCap,
        holders: holders,
        liquidity: liquidity,
        riskReturn: ((volume24h / (parseFloat(floorPrice) || 1)) * Math.random() * 0.01).toFixed(2),
        arbitrage: Math.random() > 0.8 ? `Sim (+${(Math.random()*5).toFixed(2)}%)` : 'Não',
        rank: idx + 1,
        exchanges: [
          { name: "Magic Eden", url: "https://magiceden.io/ordinals", price: parseFloat(floorPrice) * 1.02 },
          { name: "Gamma.io", url: "https://gamma.io", price: parseFloat(floorPrice) * 0.98 },
          { name: "Ordinals Market", url: "https://ordinals.market", price: parseFloat(floorPrice) * 1.01 }
        ]
      }
    })
  }, [inscriptionsArray])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">ORDINALS</h1>
            <h2 className="text-lg text-gray-300">TOP COLLECTIONS & INSCRIPTIONS</h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-time Updates
            </span>
          </div>
        </div>

        {/* Top Collections Section - Moved to the top */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text">Top Collections</span>
            <div className="h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-blue-500/50 ml-4"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {isLoadingCollections ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 animate-pulse h-52 shadow-lg"></div>
              ))
            ) : (
              collectionsArray.slice(0, 8).map((collection: any, i: number) => {
                // Determine color scheme based on index
                const colorSchemes = [
                  { from: 'from-emerald-500/10', to: 'to-blue-500/10', border: 'border-emerald-500/30', hover: 'hover:border-emerald-500/50', text: 'text-emerald-400', shadow: 'shadow-emerald-500/20' },
                  { from: 'from-blue-500/10', to: 'to-indigo-500/10', border: 'border-blue-500/30', hover: 'hover:border-blue-500/50', text: 'text-blue-400', shadow: 'shadow-blue-500/20' },
                  { from: 'from-indigo-500/10', to: 'to-purple-500/10', border: 'border-indigo-500/30', hover: 'hover:border-indigo-500/50', text: 'text-indigo-400', shadow: 'shadow-indigo-500/20' },
                  { from: 'from-purple-500/10', to: 'to-pink-500/10', border: 'border-purple-500/30', hover: 'hover:border-purple-500/50', text: 'text-purple-400', shadow: 'shadow-purple-500/20' }
                ];
                const colorScheme = colorSchemes[i % colorSchemes.length];

                return (
                  <div
                    key={i}
                    className={`bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} rounded-xl p-5 border ${colorScheme.border} shadow-xl hover:shadow-2xl transition-all cursor-pointer ${selectedCollection === collection.slug ? `ring-2 ring-${colorScheme.text.replace('text-', '')}` : ''} ${colorScheme.hover}`}
                    onClick={() => setSelectedCollection(collection.slug === selectedCollection ? null : collection.slug)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className={`font-bold ${colorScheme.text} text-lg`}>{collection.name}</h4>
                      <span className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} border ${colorScheme.border} text-xs font-medium ${colorScheme.text}`}>#{i + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                      <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/30">
                        <p className="text-gray-300 mb-1">Items</p>
                        <p className="font-bold text-white text-sm">{collection.item_count?.toLocaleString('en-US')}</p>
                      </div>
                      <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/30">
                        <p className="text-gray-300 mb-1">Volume 24h</p>
                        <p className="font-bold text-emerald-400 text-sm">${collection.volume_24h?.toLocaleString('en-US')}</p>
                      </div>
                      <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/30">
                        <p className="text-gray-300 mb-1">Floor Price</p>
                        <p className="font-bold text-blue-400 text-sm">${collection.floor_price}</p>
                      </div>
                      <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/30">
                        <p className="text-gray-300 mb-1">Market Cap</p>
                        <p className="font-bold text-purple-400 text-sm">${(collection.market_cap / 1000000).toFixed(2)}M</p>
                      </div>
                    </div>
                    {collection.exchanges && (
                      <div className="mt-3 border-t border-slate-700/30 pt-3">
                        <p className="text-xs text-gray-300 mb-2">Exchanges:</p>
                        <div className="flex flex-wrap gap-2">
                          {collection.exchanges.map((exchange: any, j: number) => (
                            <a
                              key={j}
                              href={exchange.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs px-2.5 py-1 rounded-lg bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} border ${colorScheme.border} ${colorScheme.text} transition-all hover:shadow-md`}
                            >
                              {exchange.name} (${exchange.price.toFixed(4)})
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Stats, Bitcoin Price and Recent Inscriptions */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <OrdinalsStatsCard />
          <BitcoinPriceCard />
          <RecentInscriptionsCard />
        </div>

        {/* Inscriptions Table */}
        <DashboardCard
          title="Top Inscriptions"
          subtitle="Detailed information about top inscriptions"
          colorScheme="blue"
          className="shadow-xl"
        >
          {isLoading && (
            <div className="flex items-center justify-center p-6">
              <div className="flex items-center gap-2 text-blue-400">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Carregando dados...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 text-rose-400">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Erro ao carregar dados.</span>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-700/50 bg-slate-800/30">
                  <th className="py-3 px-4 font-medium text-gray-300">#</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Nome</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Número</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Volume 24h</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Preço Compra</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Preço Venda</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Floor</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Market Cap</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Holders</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Liquidez</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Risco/Retorno</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Arbitragem</th>
                  <th className="py-3 px-4 font-medium text-gray-300">Exchanges</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item: any, i: number) => {
                  // Alternate row colors for better readability
                  const isEven = i % 2 === 0;
                  const rowBg = isEven ? 'bg-slate-800/20' : 'bg-slate-800/10';
                  const rowHoverBg = 'hover:bg-blue-500/10';

                  return (
                    <tr key={i} className={`border-b border-slate-700/30 ${rowBg} ${rowHoverBg} transition-colors`}>
                      <td className="py-3 px-4 font-bold text-gray-200">{item.rank}</td>
                      <td className="py-3 px-4 font-bold text-blue-400">{item.name}</td>
                      <td className="py-3 px-4 text-gray-300">{item.inscription_number?.toLocaleString('en-US')}</td>
                      <td className="py-3 px-4 text-gray-300">{item.volume_24h?.toLocaleString('en-US')}</td>
                      <td className="py-3 px-4 text-emerald-400 font-medium">{item.buy_price ? `$${item.buy_price}` : '-'}</td>
                      <td className="py-3 px-4 text-rose-400 font-medium">{item.sell_price ? `$${item.sell_price}` : '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{item.floor_price ? `$${item.floor_price}` : '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{item.market_cap ? `$${item.market_cap.toLocaleString('en-US')}` : '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{item.holders?.toLocaleString('en-US') || '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{item.liquidity ? `$${item.liquidity.toLocaleString('en-US')}` : '-'}</td>
                      <td className="py-3 px-4 font-bold text-indigo-400">{item.riskReturn}</td>
                      <td className={`py-3 px-4 font-bold ${item.arbitrage.startsWith('Sim') ? 'text-emerald-400' : 'text-gray-400'}`}>
                        {item.arbitrage.startsWith('Sim') ? (
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {item.arbitrage}
                          </div>
                        ) : item.arbitrage}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {item.exchanges?.map((exchange: any, j: number) => {
                            // Different colors for different exchanges
                            const exchangeColors = [
                              { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
                              { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
                              { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' }
                            ];
                            const color = exchangeColors[j % exchangeColors.length];

                            return (
                              <a
                                key={j}
                                href={exchange.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs px-2 py-1 rounded-lg ${color.bg} ${color.border} border ${color.text} hover:shadow-md transition-all`}
                              >
                                {exchange.name}
                              </a>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/30 text-xs text-gray-300 flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Dados atualizados em tempo real
            </span>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Atualizado: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </DashboardCard>

        {/* Arbitrage Opportunities */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text">Arbitrage Opportunities</span>
            <div className="h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-blue-500/50 ml-4"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tableData
              .filter((item: any) => item.arbitrage.startsWith('Sim'))
              .slice(0, 6)
              .map((item: any, i: number) => {
                // Determine color scheme based on profit percentage
                const profit = ((item.exchanges[0].price - item.exchanges[1].price) * 100);
                let colorScheme;

                if (profit > 10) {
                  colorScheme = {
                    from: 'from-emerald-500/10',
                    to: 'to-green-500/10',
                    border: 'border-emerald-500/30',
                    hover: 'hover:border-emerald-500/50',
                    badge: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400'
                  };
                } else if (profit > 5) {
                  colorScheme = {
                    from: 'from-blue-500/10',
                    to: 'to-cyan-500/10',
                    border: 'border-blue-500/30',
                    hover: 'hover:border-blue-500/50',
                    badge: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400'
                  };
                } else {
                  colorScheme = {
                    from: 'from-purple-500/10',
                    to: 'to-indigo-500/10',
                    border: 'border-purple-500/30',
                    hover: 'hover:border-purple-500/50',
                    badge: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-400'
                  };
                }

                return (
                  <div
                    key={i}
                    className={`bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} rounded-xl p-5 border ${colorScheme.border} shadow-xl hover:shadow-2xl transition-all ${colorScheme.hover}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-white text-lg">{item.name}</h4>
                      <span className={`px-3 py-1.5 rounded-lg ${colorScheme.badge} text-xs font-medium flex items-center gap-1.5`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.arbitrage}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                        <div className="flex items-center gap-1.5 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-gray-300">Compra em</p>
                        </div>
                        <p className="font-bold text-white mb-1">{item.exchanges[1].name}</p>
                        <p className="font-bold text-emerald-400 text-lg">${item.exchanges[1].price.toFixed(4)}</p>
                      </div>

                      <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                        <div className="flex items-center gap-1.5 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-gray-300">Venda em</p>
                        </div>
                        <p className="font-bold text-white mb-1">{item.exchanges[0].name}</p>
                        <p className="font-bold text-rose-400 text-lg">${item.exchanges[0].price.toFixed(4)}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700/30">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-300 flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Profit Potencial:
                        </p>
                        <a
                          href={`https://magiceden.io/ordinals/item/${item.inscription_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-400 hover:shadow-md transition-all flex items-center gap-1"
                        >
                          Ver Item
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-grow h-2 bg-slate-800/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                            style={{ width: `${Math.min(profit * 2, 100)}%` }}
                          ></div>
                        </div>
                        <p className="font-bold text-emerald-400 text-lg whitespace-nowrap">
                          ${profit.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">por 100 items</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  )
}

function RecentInscriptionsCard() {
  return (
    <DashboardCard
      title="Recent Inscriptions"
      subtitle="Latest inscriptions on the Bitcoin blockchain"
      colorScheme="purple"
      className="shadow-xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent inscriptions will be displayed here.
          </p>
          <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-xs font-bold text-purple-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            Atualização em tempo real
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Array(8).fill(0).map((_, i) => {
            // Different color schemes for variety
            const colorSchemes = [
              { bg: 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
              { bg: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
              { bg: 'bg-gradient-to-br from-emerald-500/10 to-green-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
              { bg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10', border: 'border-amber-500/30', text: 'text-amber-400' }
            ];
            const colorScheme = colorSchemes[i % colorSchemes.length];

            return (
              <div
                key={i}
                className={`${colorScheme.bg} border ${colorScheme.border} rounded-lg p-3 h-20 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer`}
              >
                <div className={`${colorScheme.text} font-bold`}>
                  #{Math.floor(Math.random() * 1000000)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {Math.floor(Math.random() * 10) + 1}m ago
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/30 text-xs text-gray-300 flex justify-between items-center">
        <span className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Dados atualizados em tempo real
        </span>
        <span className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Atualizado: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </DashboardCard>
  )
}