'use client'

import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'
import { useOrdiscanData } from '@/hooks/useOrdiscanData'

export default function BRC20Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">BRC-20</h1>
        <h2 className="text-lg text-muted-foreground mb-6">BRC-20 TOKENS OVERVIEW</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <BRC20StatsCard />
          <TopTokensCard />
        </div>
      </div>
    </main>
  )
}

function BRC20StatsCard() {
  const { data: brc20Data } = useOrdiscanData('/brc20')

  return (
    <DashboardCard title="BRC-20 Stats">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Tokens</p>
          <p className="text-2xl font-bold">{brc20Data?.total_tokens?.toLocaleString() || '0'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">24h Volume</p>
          <p className="text-2xl font-bold">${brc20Data?.volume_24h?.toLocaleString() || '0'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Market Cap</p>
          <p className="text-2xl font-bold">${brc20Data?.market_cap?.toLocaleString() || '0'}</p>
        </div>
      </div>
    </DashboardCard>
  )
}

function TopTokensCard() {
  return (
    <DashboardCard title="Top BRC-20 Tokens">
      <div className="space-y-4">
        <p className="text-muted-foreground">Top BRC-20 tokens will be displayed here.</p>
        <p className="text-sm">Under Development</p>
      </div>
    </DashboardCard>
  )
} 