import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'

export default function MarketPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">MARKET</h1>
        <h2 className="text-lg text-muted-foreground mb-6">MARKET OVERVIEW</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <MarketOverviewCard />
          <TopMoversCard />
        </div>
      </div>
    </main>
  )
}

function MarketOverviewCard() {
  return (
    <DashboardCard title="Market Overview">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Total Market Cap</p>
          <p className="text-sm text-muted-foreground">$2.1T</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">24h Volume</p>
          <p className="text-sm text-muted-foreground">$84.5B</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">BTC Dominance</p>
          <p className="text-sm text-muted-foreground">48.2%</p>
        </div>
      </div>
    </DashboardCard>
  )
}

function TopMoversCard() {
  return (
    <DashboardCard title="Top Movers">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Bitcoin (BTC)</p>
          <p className="text-sm text-green-500">+5.2%</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Ethereum (ETH)</p>
          <p className="text-sm text-green-500">+3.8%</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Solana (SOL)</p>
          <p className="text-sm text-red-500">-2.1%</p>
        </div>
      </div>
    </DashboardCard>
  )
} 