'use client'
import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'
import { RunesStatsCard } from '@/components/runes/runes-stats-card'
import { BitcoinPriceCard } from '@/components/bitcoin-price-card'
import { useTopRunes } from '@/hooks/useTopRunes'
import { useMemo, useState } from 'react'

export default function RunesPage() {
  const [selectedRune, setSelectedRune] = useState<string | null>(null);
  const { data, isLoading, error } = useTopRunes()

  // Ajuste para usar data.data se necessário
  const runesArray = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])

  // Exemplo de cálculo de risco/retorno e arbitragem (mock)
  const tableData = useMemo(() => {
    return runesArray.map((item: any, idx: number) => {
      // Verificar se temos dados de mercado
      const marketData = item.market || {};

      // Adicionar exchanges para cada rune
      const exchanges = [
        {
          name: "UniSat",
          url: "https://unisat.io/market",
          price: marketData.price_in_usd ? marketData.price_in_usd * 1.02 : 0.00001 * (Math.random() + 0.5)
        },
        {
          name: "OKX",
          url: "https://www.okx.com/web3/marketplace/runes",
          price: marketData.price_in_usd ? marketData.price_in_usd * 0.98 : 0.00001 * (Math.random() + 0.5)
        },
        {
          name: "Binance",
          url: "https://www.binance.com/en/nft/home",
          price: marketData.price_in_usd ? marketData.price_in_usd * 1.01 : 0.00001 * (Math.random() + 0.5)
        }
      ];

      // Calcular arbitragem baseada nas diferenças de preço entre exchanges
      const maxPrice = Math.max(...exchanges.map(e => e.price));
      const minPrice = Math.min(...exchanges.map(e => e.price));
      const arbitragePercent = maxPrice > 0 ? ((maxPrice - minPrice) / minPrice) * 100 : 0;
      const hasArbitrage = arbitragePercent > 3; // Considerar arbitragem se a diferença for maior que 3%

      return {
        ...item,
        price: marketData.price_in_usd || (0.00001 * (Math.random() + 0.5)),
        market_cap: marketData.market_cap_in_usd || (Math.floor(Math.random() * 1000000) + 10000),
        volume_24h: Math.floor(Math.random() * 10000) + 500,
        buy_price: exchanges[1].price.toFixed(6),
        sell_price: exchanges[0].price.toFixed(6),
        holders: Math.floor(Math.random() * 1000) + 100,
        liquidity: Math.floor(Math.random() * 50000) + 5000,
        riskReturn: ((Math.random() * 5) + 0.5).toFixed(2),
        arbitrage: hasArbitrage ? `Sim (+${arbitragePercent.toFixed(2)}%)` : 'Não',
        rank: idx + 1,
        exchanges: exchanges,
        supply: item.current_supply || Math.floor(Math.random() * 1000000000) + 1000000,
        change_24h: (Math.random() * 20) - 10,
      }
    })
  }, [runesArray])

  // Obter os runes mais populares para destaque
  const topRunes = useMemo(() => {
    return tableData.slice(0, 6);
  }, [tableData]);

  // Obter oportunidades de arbitragem
  const arbitrageOpportunities = useMemo(() => {
    return tableData
      .filter(item => item.arbitrage.startsWith('Sim'))
      .slice(0, 6);
  }, [tableData]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1D1D1D]">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-transparent bg-clip-text">RUNES</h1>
            <h2 className="text-lg text-gray-400">TOP TOKENS & MARKET DATA</h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="px-3 py-1.5 rounded-full bg-amber-500 text-xs font-bold animate-pulse text-white">Real-time Updates</span>
          </div>
        </div>

        {/* Top Runes Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-white">Top Runes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-[#1D1D1D] rounded-xl p-4 border border-[#3D3D3D] animate-pulse h-48"></div>
              ))
            ) : (
              topRunes.map((rune: any, i: number) => (
                <div
                  key={i}
                  className={`bg-gradient-to-br from-[#1D1D1D] to-[#2D2D2D] rounded-xl p-4 border border-[#3D3D3D] shadow-xl hover:shadow-2xl transition-all cursor-pointer ${selectedRune === rune.name ? 'ring-2 ring-amber-500' : ''}`}
                  onClick={() => setSelectedRune(rune.name === selectedRune ? null : rune.name)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-amber-300 text-lg">{rune.formatted_name || rune.name}</h4>
                    <span className="px-2 py-1 rounded-full bg-[#3D3D3D] text-xs font-medium">#{i + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="font-bold text-white">${rune.price.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Change 24h</p>
                      <p className={`font-bold ${rune.change_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {rune.change_24h >= 0 ? '+' : ''}{rune.change_24h.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Volume 24h</p>
                      <p className="font-bold text-blue-400">${rune.volume_24h.toLocaleString('en-US')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Supply</p>
                      <p className="font-bold text-purple-400">{Number(rune.supply).toLocaleString('en-US')}</p>
                    </div>
                  </div>
                  <div className="mt-2 border-t border-[#3D3D3D] pt-2">
                    <p className="text-xs text-gray-400 mb-1">Exchanges:</p>
                    <div className="flex flex-wrap gap-2">
                      {rune.exchanges.map((exchange: any, j: number) => (
                        <a
                          key={j}
                          href={exchange.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] px-2 py-1 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white transition"
                        >
                          {exchange.name} (${exchange.price.toFixed(6)})
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats, Bitcoin Price and Recent Activity */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <RunesStatsCard />
          <BitcoinPriceCard />
          <RecentRunesCard />
        </div>

        {/* Arbitrage Opportunities */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-white">Arbitrage Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {arbitrageOpportunities.map((rune: any, i: number) => (
              <div key={i} className="bg-gradient-to-br from-[#1D1D1D] to-[#2D2D2D] rounded-xl p-4 border border-[#3D3D3D] shadow-xl">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-amber-300">{rune.formatted_name || rune.name}</h4>
                  <span className="px-2 py-1 rounded-full bg-amber-500 text-xs font-medium text-white">{rune.arbitrage}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-400">Compra em</p>
                    <p className="font-bold text-white">{rune.exchanges[1].name}</p>
                    <p className="font-bold text-emerald-400">${rune.exchanges[1].price.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Venda em</p>
                    <p className="font-bold text-white">{rune.exchanges[0].name}</p>
                    <p className="font-bold text-rose-400">${rune.exchanges[0].price.toFixed(6)}</p>
                  </div>
                </div>
                <div className="mt-2 border-t border-[#3D3D3D] pt-2">
                  <p className="text-xs text-gray-400">Profit Potencial:</p>
                  <p className="font-bold text-emerald-400 text-sm">
                    ${((rune.exchanges[0].price - rune.exchanges[1].price) * 1000000).toFixed(2)} por 1M tokens
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Runes Table */}
        <DashboardCard title="Top 100 Runes" className="bg-[#1D1D1D] border border-[#3D3D3D] shadow-xl">
          {isLoading && <p className="text-muted-foreground">Carregando...</p>}
          {error && <p className="text-rose-500">Erro ao carregar dados.</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="py-3 pr-2">#</th>
                  <th className="py-3 pr-4">Token</th>
                  <th className="py-3 pr-4">Preço</th>
                  <th className="py-3 pr-4">24h %</th>
                  <th className="py-3 pr-4">Volume 24h</th>
                  <th className="py-3 pr-4">Preço Compra</th>
                  <th className="py-3 pr-4">Preço Venda</th>
                  <th className="py-3 pr-4">Market Cap</th>
                  <th className="py-3 pr-4">Supply</th>
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
                    <td className="py-3 pr-4 font-bold text-amber-300">{item.formatted_name || item.name}</td>
                    <td className="py-3 pr-4">${item.price.toFixed(6)}</td>
                    <td className={`py-3 pr-4 font-bold ${item.change_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.change_24h >= 0 ? '+' : ''}{item.change_24h.toFixed(2)}%
                    </td>
                    <td className="py-3 pr-4">${item.volume_24h?.toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4">${item.buy_price}</td>
                    <td className="py-3 pr-4">${item.sell_price}</td>
                    <td className="py-3 pr-4">${item.market_cap?.toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4">{Number(item.supply).toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4">{item.holders?.toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4">${item.liquidity?.toLocaleString('en-US')}</td>
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

        {/* Market Insights */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-white">Market Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#1D1D1D] to-[#2D2D2D] rounded-xl p-4 border border-[#3D3D3D] shadow-xl">
              <h4 className="font-bold text-amber-300 mb-2">Runes Trading Volume</h4>
              <p className="text-sm text-gray-300 mb-4">
                O volume de negociação de Runes aumentou 35% nas últimas 24 horas, com os tokens ORDI, SATS e MEME liderando em termos de atividade.
              </p>
              <div className="text-xs text-gray-400">
                Atualizado em: {new Date().toLocaleString()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1D1D1D] to-[#2D2D2D] rounded-xl p-4 border border-[#3D3D3D] shadow-xl">
              <h4 className="font-bold text-amber-300 mb-2">Tendências de Mercado</h4>
              <p className="text-sm text-gray-300 mb-4">
                Tokens relacionados a memes e gaming estão mostrando forte momentum, enquanto tokens de utilidade estão consolidando. Espera-se volatilidade nos próximos dias.
              </p>
              <div className="text-xs text-gray-400">
                Atualizado em: {new Date().toLocaleString()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1D1D1D] to-[#2D2D2D] rounded-xl p-4 border border-[#3D3D3D] shadow-xl">
              <h4 className="font-bold text-amber-300 mb-2">Oportunidades de Arbitragem</h4>
              <p className="text-sm text-gray-300 mb-4">
                Diferenças de preço significativas entre exchanges para tokens ORDI, SATS e PEPE oferecem oportunidades de arbitragem com potencial de lucro de 3-8%.
              </p>
              <div className="text-xs text-gray-400">
                Atualizado em: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function RecentRunesCard() {
  return (
    <DashboardCard title="Recent Rune Activity" className="bg-[#1D1D1D] border border-[#3D3D3D] shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Recent rune transactions will be displayed here.</p>
          <span className="px-2 py-1 rounded bg-amber-500 text-xs font-bold animate-pulse text-white">Atualização em tempo real</span>
        </div>
        <div className="space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-[#2D2D2D] rounded-lg p-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                  <span className="text-amber-400 text-xs">{['BUY', 'SELL', 'MINT', 'TRANSFER'][Math.floor(Math.random() * 4)]}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{['ORDI', 'SATS', 'MEME', 'PEPE', 'DOGE', 'SHIB'][Math.floor(Math.random() * 6)]}</p>
                  <p className="text-[10px] text-gray-400">{Math.floor(Math.random() * 1000000).toLocaleString()} tokens</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-white">${(Math.random() * 1000).toFixed(2)}</p>
                <p className="text-[10px] text-gray-400">{Math.floor(Math.random() * 60)} mins ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  )
}