'use client'
import { Header } from '@/components/header'
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
    <main className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1D1D1D]">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">ORDINALS</h1>
            <h2 className="text-lg text-gray-400">TOP COLLECTIONS & INSCRIPTIONS</h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-xs font-bold animate-pulse text-white">Real-time Updates</span>
          </div>
        </div>

        {/* Top Collections Section - Moved to the top */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-white">Top Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoadingCollections ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-[#1D1D1D] rounded-xl p-4 border border-[#3D3D3D] animate-pulse h-48"></div>
              ))
            ) : (
              collectionsArray.slice(0, 8).map((collection: any, i: number) => (
                <div
                  key={i}
                  className={`bg-gradient-to-br from-[#1D1D1D] to-[#2D2D2D] rounded-xl p-4 border border-[#3D3D3D] shadow-xl hover:shadow-2xl transition-all cursor-pointer ${selectedCollection === collection.slug ? 'ring-2 ring-emerald-500' : ''}`}
                  onClick={() => setSelectedCollection(collection.slug === selectedCollection ? null : collection.slug)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-emerald-300 text-lg">{collection.name}</h4>
                    <span className="px-2 py-1 rounded-full bg-[#3D3D3D] text-xs font-medium">#{i + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <p className="text-gray-400">Items</p>
                      <p className="font-bold text-white">{collection.item_count?.toLocaleString('en-US')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Volume 24h</p>
                      <p className="font-bold text-emerald-400">${collection.volume_24h?.toLocaleString('en-US')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Floor Price</p>
                      <p className="font-bold text-blue-400">${collection.floor_price}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Market Cap</p>
                      <p className="font-bold text-purple-400">${(collection.market_cap / 1000000).toFixed(2)}M</p>
                    </div>
                  </div>
                  {collection.exchanges && (
                    <div className="mt-2 border-t border-[#3D3D3D] pt-2">
                      <p className="text-xs text-gray-400 mb-1">Exchanges:</p>
                      <div className="flex flex-wrap gap-2">
                        {collection.exchanges.map((exchange: any, j: number) => (
                          <a
                            key={j}
                            href={exchange.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] px-2 py-1 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white transition"
                          >
                            {exchange.name} (${exchange.price.toFixed(4)})
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
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
        <DashboardCard title="Top Inscriptions" className="bg-[#1D1D1D] border border-[#3D3D3D] shadow-xl">
          {isLoading && <p className="text-muted-foreground">Carregando...</p>}
          {error && <p className="text-rose-500">Erro ao carregar dados.</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="py-3 pr-2">#</th>
                  <th className="py-3 pr-4">Nome</th>
                  <th className="py-3 pr-4">Número</th>
                  <th className="py-3 pr-4">Volume 24h</th>
                  <th className="py-3 pr-4">Preço Compra</th>
                  <th className="py-3 pr-4">Preço Venda</th>
                  <th className="py-3 pr-4">Floor</th>
                  <th className="py-3 pr-4">Market Cap</th>
                  <th className="py-3 pr-4">Holders</th>
                  <th className="py-3 pr-4">Liquidez</th>
                  <th className="py-3 pr-4">Risco/Retorno</th>
                  <th className="py-3 pr-4">Arbitragem</th>
                  <th className="py-3 pr-4">Exchanges</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-900 transition">
                    <td className="py-3 pr-2 font-bold text-gray-300">{item.rank}</td>
                    <td className="py-3 pr-4 font-bold text-emerald-300">{item.name}</td>
                    <td className="py-3 pr-4">{item.inscription_number?.toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4">{item.volume_24h?.toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4">{item.buy_price ? `$${item.buy_price}` : '-'}</td>
                    <td className="py-3 pr-4">{item.sell_price ? `$${item.sell_price}` : '-'}</td>
                    <td className="py-3 pr-4">{item.floor_price ? `$${item.floor_price}` : '-'}</td>
                    <td className="py-3 pr-4">{item.market_cap ? `$${item.market_cap.toLocaleString('en-US')}` : '-'}</td>
                    <td className="py-3 pr-4">{item.holders?.toLocaleString('en-US') || '-'}</td>
                    <td className="py-3 pr-4">{item.liquidity ? `$${item.liquidity.toLocaleString('en-US')}` : '-'}</td>
                    <td className="py-3 pr-4 font-bold text-blue-400">{item.riskReturn}</td>
                    <td className={`py-3 pr-4 font-bold ${item.arbitrage.startsWith('Sim') ? 'text-green-400' : 'text-gray-400'}`}>{item.arbitrage}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {item.exchanges?.map((exchange: any, j: number) => (
                          <a
                            key={j}
                            href={exchange.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] px-1.5 py-0.5 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white transition"
                          >
                            {exchange.name}
                          </a>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        {/* Arbitrage Opportunities */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-white">Arbitrage Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tableData
              .filter((item: any) => item.arbitrage.startsWith('Sim'))
              .slice(0, 6)
              .map((item: any, i: number) => (
                <div key={i} className="bg-gradient-to-br from-[#1D1D1D] to-[#2D2D2D] rounded-xl p-4 border border-[#3D3D3D] shadow-xl">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-emerald-300">{item.name}</h4>
                    <span className="px-2 py-1 rounded-full bg-emerald-500 text-xs font-medium text-white">{item.arbitrage}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <p className="text-gray-400">Compra em</p>
                      <p className="font-bold text-white">{item.exchanges[1].name}</p>
                      <p className="font-bold text-emerald-400">${item.exchanges[1].price.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Venda em</p>
                      <p className="font-bold text-white">{item.exchanges[0].name}</p>
                      <p className="font-bold text-rose-400">${item.exchanges[0].price.toFixed(4)}</p>
                    </div>
                  </div>
                  <div className="mt-2 border-t border-[#3D3D3D] pt-2">
                    <p className="text-xs text-gray-400">Profit Potencial:</p>
                    <p className="font-bold text-emerald-400 text-sm">
                      ${((item.exchanges[0].price - item.exchanges[1].price) * 100).toFixed(2)} por 100 items
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function RecentInscriptionsCard() {
  return (
    <DashboardCard title="Recent Inscriptions" className="bg-[#1D1D1D] border border-[#3D3D3D] shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Recent inscriptions will be displayed here.</p>
          <span className="px-2 py-1 rounded bg-emerald-500 text-xs font-bold animate-pulse text-white">Atualização em tempo real</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-[#2D2D2D] rounded-lg p-2 h-16 flex items-center justify-center text-xs text-gray-400">
              #{Math.floor(Math.random() * 1000000)}
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  )
}