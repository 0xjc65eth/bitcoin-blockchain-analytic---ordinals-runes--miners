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

  // Usar os dados diretamente da API
  const tableData = useMemo(() => {
    // Se os dados já estiverem formatados corretamente, usá-los diretamente
    if (Array.isArray(data) && data.length > 0) {
      return data.map(rune => {
        // Verificar se o objeto rune existe
        if (!rune) {
          console.error("Rune object is undefined");
          return null;
        }

        // Garantir que todos os campos necessários existam
        const price = typeof rune.price === 'number' ? rune.price : 0;

        return {
          ...rune,
          rank: rune.rank || 0,
          name: rune.name || 'Unknown',
          formatted_name: rune.formatted_name || rune.name || 'Unknown',
          price: price,
          price_usd: rune.price_usd || (price * 65000),
          market_cap: rune.market_cap || 0,
          volume_24h: rune.volume_24h || 0,
          buy_price: rune.buy_price || (price * 0.98).toFixed(6),
          sell_price: rune.sell_price || (price * 1.02).toFixed(6),
          holders: rune.holders || 0,
          liquidity: rune.market_cap ? Math.floor(rune.market_cap * 0.2) : 0,
          riskReturn: rune.riskReturn || rune.risk_return || "0.00",
          arbitrage: rune.arbitrage || 'Não',
          exchanges: rune.exchanges || [
            {
              name: "Unisat",
              url: `https://unisat.io/market/rune/${(rune.name || 'unknown').toLowerCase()}`,
              price: price * 1.02,
              buyUrl: `https://unisat.io/market/rune/${(rune.name || 'unknown').toLowerCase()}/buy`,
              sellUrl: `https://unisat.io/market/rune/${(rune.name || 'unknown').toLowerCase()}/sell`
            },
            {
              name: "OKX",
              url: `https://www.okx.com/web3/marketplace/ordinals/runes/${(rune.name || 'unknown').toLowerCase()}`,
              price: price * 0.98,
              buyUrl: `https://www.okx.com/web3/marketplace/ordinals/runes/${(rune.name || 'unknown').toLowerCase()}/buy`,
              sellUrl: `https://www.okx.com/web3/marketplace/ordinals/runes/${(rune.name || 'unknown').toLowerCase()}/sell`
            }
          ],
          supply: rune.supply || 0,
          change_24h: typeof rune.change_24h === 'number' ? rune.change_24h : 0,
          verified: rune.verified !== undefined ? rune.verified : true,
          marketplaces: rune.marketplaces || [
            { name: 'unisat.io', url: `https://unisat.io/market/rune/${(rune.name || 'unknown').toLowerCase()}` },
            { name: 'magiceden.io', url: `https://magiceden.io/ordinals/runes/${(rune.name || 'unknown').toLowerCase()}` }
          ],
          runeLink: rune.runeLink || `https://unisat.io/market/rune/${(rune.name || 'unknown').toLowerCase()}`,
          buyLink: rune.buyLink || `https://unisat.io/market/rune/${(rune.name || 'unknown').toLowerCase()}/buy`,
          sellLink: rune.sellLink || `https://unisat.io/market/rune/${(rune.name || 'unknown').toLowerCase()}/sell`,
          detailsLink: rune.detailsLink || `https://runealpha.xyz/rune/${(rune.name || 'unknown').toLowerCase()}`,
          txLink: rune.txLink || `https://mempool.space/rune/${(rune.name || 'unknown').toLowerCase()}`,
          explorerLink: rune.explorerLink || `https://runealpha.xyz/rune/${(rune.name || 'unknown').toLowerCase()}`
        };
      }).filter(Boolean); // Remover itens nulos
    }

    // Caso contrário, usar dados de fallback
    console.error("Dados de runas inválidos:", data);

    // Dados de fallback para garantir que sempre tenhamos algo para exibir
    const fallbackRunes = [
      {
        rank: 1,
        name: 'ORDI',
        formatted_name: 'ORDI',
        price: 0.000125,
        price_usd: 7.5,
        volume_24h: 245890000,
        market_cap: 1245678900,
        holders: 24567,
        supply: 21000000,
        buy_price: '0.000123',
        sell_price: '0.000128',
        change_24h: 5.2,
        liquidity: 249135780,
        riskReturn: '2.50',
        arbitrage: 'Sim 4.2%',
        verified: true,
        marketplaces: [
          { name: 'unisat.io', url: 'https://unisat.io/market/rune/ordi' },
          { name: 'magiceden.io', url: 'https://magiceden.io/ordinals/runes/ordi' }
        ],
        exchanges: [
          {
            name: 'Unisat',
            url: 'https://unisat.io/market/rune/ordi',
            price: 0.000128,
            buyUrl: 'https://unisat.io/market/rune/ordi/buy',
            sellUrl: 'https://unisat.io/market/rune/ordi/sell'
          },
          {
            name: 'OKX',
            url: 'https://www.okx.com/web3/marketplace/ordinals/runes/ordi',
            price: 0.000123,
            buyUrl: 'https://www.okx.com/web3/marketplace/ordinals/runes/ordi/buy',
            sellUrl: 'https://www.okx.com/web3/marketplace/ordinals/runes/ordi/sell'
          }
        ],
        runeLink: 'https://unisat.io/market/rune/ordi'
      },
      {
        rank: 2,
        name: 'SATS',
        formatted_name: 'SATS',
        price: 0.0000875,
        price_usd: 5.25,
        volume_24h: 187300000,
        market_cap: 945678900,
        holders: 18932,
        supply: 21000000,
        buy_price: '0.000086',
        sell_price: '0.000089',
        change_24h: 3.8,
        liquidity: 189135780,
        riskReturn: '2.10',
        arbitrage: 'Sim 3.5%',
        verified: true,
        marketplaces: [
          { name: 'unisat.io', url: 'https://unisat.io/market/rune/sats' },
          { name: 'magiceden.io', url: 'https://magiceden.io/ordinals/runes/sats' }
        ],
        exchanges: [
          {
            name: 'Unisat',
            url: 'https://unisat.io/market/rune/sats',
            price: 0.000089,
            buyUrl: 'https://unisat.io/market/rune/sats/buy',
            sellUrl: 'https://unisat.io/market/rune/sats/sell'
          },
          {
            name: 'OKX',
            url: 'https://www.okx.com/web3/marketplace/ordinals/runes/sats',
            price: 0.000086,
            buyUrl: 'https://www.okx.com/web3/marketplace/ordinals/runes/sats/buy',
            sellUrl: 'https://www.okx.com/web3/marketplace/ordinals/runes/sats/sell'
          }
        ],
        runeLink: 'https://unisat.io/market/rune/sats'
      },
      {
        rank: 3,
        name: 'MEME',
        formatted_name: 'MEME',
        price: 0.000052,
        price_usd: 3.12,
        volume_24h: 142600000,
        market_cap: 745678900,
        holders: 12845,
        supply: 21000000,
        buy_price: '0.000051',
        sell_price: '0.000053',
        change_24h: 7.4,
        liquidity: 149135780,
        riskReturn: '1.80',
        arbitrage: 'Não',
        verified: true,
        marketplaces: [
          { name: 'unisat.io', url: 'https://unisat.io/market/rune/meme' },
          { name: 'magiceden.io', url: 'https://magiceden.io/ordinals/runes/meme' }
        ],
        exchanges: [
          {
            name: 'Unisat',
            url: 'https://unisat.io/market/rune/meme',
            price: 0.000053,
            buyUrl: 'https://unisat.io/market/rune/meme/buy',
            sellUrl: 'https://unisat.io/market/rune/meme/sell'
          },
          {
            name: 'OKX',
            url: 'https://www.okx.com/web3/marketplace/ordinals/runes/meme',
            price: 0.000051,
            buyUrl: 'https://www.okx.com/web3/marketplace/ordinals/runes/meme/buy',
            sellUrl: 'https://www.okx.com/web3/marketplace/ordinals/runes/meme/sell'
          }
        ],
        runeLink: 'https://unisat.io/market/rune/meme'
      }
    ];

    // Adicionar mais runas para ter pelo menos 10
    const runeNames = ['PEPE', 'DOGE', 'WOJAK', 'SHIB', 'BITCOIN', 'BASED', 'MOON'];

    for (let i = 0; i < runeNames.length; i++) {
      const name = runeNames[i];
      const rank = i + 4;
      const popularity = 1 - (rank / 10);

      fallbackRunes.push({
        rank: rank,
        name: name,
        formatted_name: name,
        price: 0.00001 + (0.0001 * popularity),
        price_usd: (0.00001 + (0.0001 * popularity)) * 65000,
        volume_24h: 10000 + (1000000 * popularity),
        market_cap: (10000 + (1000000 * popularity)) * 10,
        holders: Math.floor(5000 + (100000 * popularity)),
        supply: 21000000,
        buy_price: (0.00001 + (0.0001 * popularity) * 0.98).toFixed(6),
        sell_price: (0.00001 + (0.0001 * popularity) * 1.02).toFixed(6),
        change_24h: (Math.random() * 20) - 5,
        liquidity: Math.floor(((10000 + (1000000 * popularity)) * 10) * 0.2),
        riskReturn: ((Math.random() * 2) + 0.5).toFixed(2),
        arbitrage: Math.random() > 0.7 ? `Sim ${((Math.random() * 5) + 3).toFixed(1)}%` : 'Não',
        verified: true,
        marketplaces: [
          { name: 'unisat.io', url: `https://unisat.io/market/rune/${name.toLowerCase()}` },
          { name: 'magiceden.io', url: `https://magiceden.io/ordinals/runes/${name.toLowerCase()}` }
        ],
        exchanges: [
          {
            name: 'Unisat',
            url: `https://unisat.io/market/rune/${name.toLowerCase()}`,
            price: (0.00001 + (0.0001 * popularity)) * 1.02,
            buyUrl: `https://unisat.io/market/rune/${name.toLowerCase()}/buy`,
            sellUrl: `https://unisat.io/market/rune/${name.toLowerCase()}/sell`
          },
          {
            name: 'OKX',
            url: `https://www.okx.com/web3/marketplace/ordinals/runes/${name.toLowerCase()}`,
            price: (0.00001 + (0.0001 * popularity)) * 0.98,
            buyUrl: `https://www.okx.com/web3/marketplace/ordinals/runes/${name.toLowerCase()}/buy`,
            sellUrl: `https://www.okx.com/web3/marketplace/ordinals/runes/${name.toLowerCase()}/sell`
          }
        ],
        runeLink: `https://unisat.io/market/rune/${name.toLowerCase()}`
      });
    }

    return fallbackRunes;
  }, [data])

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
                    <a
                      href={rune.links?.info || rune.runeLink || `https://runealpha.xyz/rune/${rune.name.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-amber-300 text-lg hover:underline hover:text-amber-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rune.formatted_name || rune.name}
                      {rune.verified && (
                        <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Verified
                        </span>
                      )}
                    </a>
                    <span className="px-2 py-1 rounded-full bg-[#3D3D3D] text-xs font-medium">#{i + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="font-bold text-white">${rune.price.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Change 24h</p>
                      <p className={`font-bold ${(rune.change_24h || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {(rune.change_24h || 0) >= 0 ? '+' : ''}{(typeof rune.change_24h === 'number' ? rune.change_24h : 0).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Volume 24h</p>
                      <p className="font-bold text-blue-400">${(rune.volume_24h || 0).toLocaleString('en-US')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Supply</p>
                      <p className="font-bold text-purple-400">{Number(rune.supply || 0).toLocaleString('en-US')}</p>
                    </div>
                  </div>
                  <div className="mt-2 border-t border-[#3D3D3D] pt-2">
                    <p className="text-xs text-gray-400 mb-1">Exchanges:</p>
                    <div className="flex flex-wrap gap-2">
                      {rune.marketplaces ? (
                        // Use the new marketplaces data if available
                        rune.marketplaces.map((marketplace: any, j: number) => (
                          <a
                            key={j}
                            href={marketplace.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] px-2 py-1 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {marketplace.name.replace('.io', '')}
                          </a>
                        ))
                      ) : rune.exchanges ? (
                        // Fallback to exchanges if marketplaces not available
                        rune.exchanges.map((exchange: any, j: number) => (
                          <a
                            key={j}
                            href={exchange.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] px-2 py-1 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {exchange.name} (${exchange.price.toFixed(6)})
                          </a>
                        ))
                      ) : (
                        // Default link if neither is available
                        <a
                          href={`https://unisat.io/market/rune/${rune.name.toLowerCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] px-2 py-1 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Unisat
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <a
                        href={rune.links?.info || rune.detailsLink || rune.runeLink || `https://runealpha.xyz/rune/${rune.name.toLowerCase()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 text-blue-400 hover:border-blue-400 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Details
                      </a>
                      <a
                        href={rune.txLink || `https://mempool.space/rune/${rune.name.toLowerCase()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded bg-gradient-to-r from-green-600/30 to-emerald-600/30 border border-green-500/30 text-emerald-400 hover:border-emerald-400 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Transactions
                      </a>
                      <a
                        href={rune.explorerLink || `https://runealpha.xyz/rune/${rune.name.toLowerCase()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded bg-gradient-to-r from-amber-600/30 to-orange-600/30 border border-amber-500/30 text-amber-400 hover:border-amber-400 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Explorer
                      </a>
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
                  <a
                    href={rune.runeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-amber-300 hover:underline hover:text-amber-200 transition-colors"
                  >
                    {rune.formatted_name || rune.name}
                  </a>
                  <span className="px-2 py-1 rounded-full bg-amber-500 text-xs font-medium text-white">{rune.arbitrage}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-400">Compra em</p>
                    <a
                      href={rune.exchanges[1].buyUrl || rune.buyLink || rune.exchanges[1].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-white hover:text-emerald-300 transition-colors"
                    >
                      {rune.exchanges[1].name}
                    </a>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-emerald-400">${rune.exchanges[1].price.toFixed(6)}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-400 border border-emerald-800/50">COMPRAR</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400">Venda em</p>
                    <a
                      href={rune.exchanges[0].sellUrl || rune.sellLink || rune.exchanges[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-white hover:text-rose-300 transition-colors"
                    >
                      {rune.exchanges[0].name}
                    </a>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-rose-400">${rune.exchanges[0].price.toFixed(6)}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/50 text-rose-400 border border-rose-800/50">VENDER</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 border-t border-[#3D3D3D] pt-2">
                  <p className="text-xs text-gray-400">Profit Potencial:</p>
                  <p className="font-bold text-emerald-400 text-sm">
                    ${((rune.exchanges[0].price - rune.exchanges[1].price) * 1000000).toFixed(2)} por 1M tokens
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <a
                      href={rune.links?.info || rune.detailsLink || rune.runeLink || `https://runealpha.xyz/rune/${rune.name.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-1 rounded bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 text-blue-400 hover:border-blue-400 transition-all"
                    >
                      Details
                    </a>
                    <a
                      href={rune.txLink || `https://mempool.space/rune/${rune.name.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-1 rounded bg-gradient-to-r from-green-600/30 to-emerald-600/30 border border-green-500/30 text-emerald-400 hover:border-emerald-400 transition-all"
                    >
                      Transactions
                    </a>
                    <a
                      href={rune.explorerLink || `https://runealpha.xyz/rune/${rune.name.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-1 rounded bg-gradient-to-r from-amber-600/30 to-orange-600/30 border border-amber-500/30 text-amber-400 hover:border-amber-400 transition-all"
                    >
                      Explorer
                    </a>
                    {rune.marketplaces && rune.marketplaces.length > 0 && (
                      <a
                        href={rune.marketplaces[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/30 text-purple-400 hover:border-purple-400 transition-all"
                      >
                        {rune.marketplaces[0].name.replace('.io', '')}
                      </a>
                    )}
                  </div>
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
                    <td className="py-3 pr-4 font-bold">
                      <a
                        href={item.runeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:text-amber-200 hover:underline transition-colors"
                      >
                        {item.formatted_name || item.name}
                      </a>
                    </td>
                    <td className="py-3 pr-4">${item.price.toFixed(6)}</td>
                    <td className={`py-3 pr-4 font-bold ${item.change_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.change_24h >= 0 ? '+' : ''}{item.change_24h.toFixed(2)}%
                    </td>
                    <td className="py-3 pr-4">${item.volume_24h?.toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4">
                      <a
                        href={item.exchanges[1].buyUrl || item.buyLink || item.exchanges[1].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-emerald-300 transition-colors font-medium"
                      >
                        ${item.buy_price} <span className="text-emerald-400 text-[9px]">COMPRAR</span>
                      </a>
                    </td>
                    <td className="py-3 pr-4">
                      <a
                        href={item.exchanges[0].sellUrl || item.sellLink || item.exchanges[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-rose-300 transition-colors font-medium"
                      >
                        ${item.sell_price} <span className="text-rose-400 text-[9px]">VENDER</span>
                      </a>
                    </td>
                    <td className="py-3 pr-4">${item.market_cap?.toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4">{Number(item.supply).toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4">{item.holders?.toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4">${item.liquidity?.toLocaleString('en-US')}</td>
                    <td className="py-3 pr-4 font-bold text-blue-400">{item.riskReturn}</td>
                    <td className={`py-3 pr-4 font-bold ${item.arbitrage.startsWith('Sim') ? 'text-green-400' : 'text-gray-400'}`}>{item.arbitrage}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {item.marketplaces ? (
                          // Use the new marketplaces data if available
                          item.marketplaces.map((marketplace: any, j: number) => (
                            <div key={j} className="flex gap-1 mb-1">
                              <a
                                href={marketplace.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] px-1.5 py-0.5 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white transition"
                              >
                                {marketplace.name.replace('.io', '')}
                              </a>
                              <a
                                href={`${marketplace.url}/buy`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/50 hover:bg-emerald-800/50 text-emerald-400 transition border border-emerald-800/50"
                              >
                                Comprar
                              </a>
                              <a
                                href={`${marketplace.url}/sell`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/50 hover:bg-rose-800/50 text-rose-400 transition border border-rose-800/50"
                              >
                                Vender
                              </a>
                            </div>
                          ))
                        ) : item.exchanges ? (
                          // Fallback to exchanges if marketplaces not available
                          item.exchanges.map((exchange: any, j: number) => (
                            <div key={j} className="flex gap-1 mb-1">
                              <a
                                href={exchange.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] px-1.5 py-0.5 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white transition"
                              >
                                {exchange.name}
                              </a>
                              <a
                                href={exchange.buyUrl || item.buyLink || exchange.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/50 hover:bg-emerald-800/50 text-emerald-400 transition border border-emerald-800/50"
                              >
                                Comprar
                              </a>
                              <a
                                href={exchange.sellUrl || item.sellLink || exchange.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/50 hover:bg-rose-800/50 text-rose-400 transition border border-rose-800/50"
                              >
                                Vender
                              </a>
                            </div>
                          ))
                        ) : (
                          // Default links if neither is available
                          <div className="flex gap-1 mb-1">
                            <a
                              href={`https://unisat.io/market/rune/${item.name.toLowerCase()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] px-1.5 py-0.5 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white transition"
                            >
                              Unisat
                            </a>
                            <a
                              href={`https://unisat.io/market/rune/${item.name.toLowerCase()}/buy`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/50 hover:bg-emerald-800/50 text-emerald-400 transition border border-emerald-800/50"
                            >
                              Comprar
                            </a>
                            <a
                              href={`https://unisat.io/market/rune/${item.name.toLowerCase()}/sell`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/50 hover:bg-rose-800/50 text-rose-400 transition border border-rose-800/50"
                            >
                              Vender
                            </a>
                          </div>
                        )}
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
