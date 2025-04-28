'use client'
import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'
import { OrdinalsStatsCard } from '@/components/ordinals/ordinals-stats-card'
import { useTopOrdinals } from '@/hooks/useTopOrdinals'
import { useMemo } from 'react'

export default function OrdinalsPage() {
  const { data, isLoading, error } = useTopOrdinals()

  // Log para depuração do formato da resposta
  console.log('Ordinals API data:', data)

  // Ajuste para usar data.data se necessário
  const ordinalsArray = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])

  // Exemplo de cálculo de risco/retorno e arbitragem (mock)
  const tableData = useMemo(() => {
    return ordinalsArray.map((item: any, idx: number) => ({
      ...item,
      riskReturn: ((item.volume_24h / (item.floor_price || 1)) * Math.random()).toFixed(2),
      arbitrage: Math.random() > 0.8 ? `Sim (+${(Math.random()*5).toFixed(2)}%)` : 'Não',
      rank: idx + 1,
    }))
  }, [ordinalsArray])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">ORDINALS</h1>
        <h2 className="text-lg text-muted-foreground mb-6">TOP 100 ORDINALS (Atualização em tempo real)</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <OrdinalsStatsCard />
          <RecentInscriptionsCard />
        </div>
        <DashboardCard title="Top 100 Ordinals">
          {isLoading && <p className="text-muted-foreground">Carregando...</p>}
          {error && <p className="text-rose-500">Erro ao carregar dados.</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pr-2">#</th>
                  <th className="pr-4">Nome</th>
                  <th className="pr-4">Volume 24h</th>
                  <th className="pr-4">Preço Compra</th>
                  <th className="pr-4">Preço Venda</th>
                  <th className="pr-4">Floor</th>
                  <th className="pr-4">Market Cap</th>
                  <th className="pr-4">Holders</th>
                  <th className="pr-4">Liquidez</th>
                  <th className="pr-4">Risco/Retorno</th>
                  <th className="pr-4">Arbitragem</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-900 transition">
                    <td className="pr-2 font-bold text-gray-300">{item.rank}</td>
                    <td className="pr-4 font-bold text-emerald-300">{item.name}</td>
                    <td className="pr-4">{item.volume_24h?.toLocaleString('en-US')}</td>
                    <td className="pr-4">{item.buy_price ? `$${item.buy_price}` : '-'}</td>
                    <td className="pr-4">{item.sell_price ? `$${item.sell_price}` : '-'}</td>
                    <td className="pr-4">{item.floor_price ? `$${item.floor_price}` : '-'}</td>
                    <td className="pr-4">{item.market_cap ? `$${item.market_cap}` : '-'}</td>
                    <td className="pr-4">{item.holders || '-'}</td>
                    <td className="pr-4">{item.liquidity ? `$${item.liquidity}` : '-'}</td>
                    <td className="pr-4 font-bold text-blue-400">{item.riskReturn}</td>
                    <td className={`pr-4 font-bold ${item.arbitrage.startsWith('Sim') ? 'text-green-400' : 'text-gray-400'}`}>{item.arbitrage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
    </main>
  )
}

function RecentInscriptionsCard() {
  return (
    <DashboardCard title="Recent Inscriptions">
      <div className="space-y-4">
        <p className="text-muted-foreground">Recent inscriptions will be displayed here.</p>
        <p className="text-sm">Under Development</p>
      </div>
    </DashboardCard>
  )
} 