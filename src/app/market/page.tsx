import { Header } from '@/components/header'
import { MarketOverviewCard } from '@/components/market/market-overview-card'
import { TopMoversCard } from '@/components/market/top-movers-card'
import { NeuralInsightsAdvanced } from '@/components/neural/neural-insights-advanced'
import { CryptoNewsCard } from '@/components/news/crypto-news-card'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import('@/components/charts/trading-view-widget'),
  { ssr: false }
)

const OrdinalsRunesMarketCard = dynamic(
  () => import('@/components/market/ordinals-runes-market-card'),
  { ssr: false }
)

const ArbitrageOpportunitiesCard = dynamic(
  () => import('@/components/market/arbitrage-opportunities-card'),
  { ssr: false }
)

export default function MarketPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">MARKET</h1>
        <h2 className="text-lg text-muted-foreground mb-6">COMPREHENSIVE MARKET DATA & TRADING OPPORTUNITIES</h2>

        {/* Global Market Cap & Overview */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl rounded-xl overflow-hidden h-[400px]">
              <TradingViewWidget symbol="CRYPTOCAP:TOTAL" />
            </div>
          </div>
          <div>
            <MarketOverviewCard />
          </div>
        </div>

        {/* Ordinals & Runes Market */}
        <div className="mb-6">
          <OrdinalsRunesMarketCard />
        </div>

        {/* Arbitrage Opportunities */}
        <div className="mb-6">
          <ArbitrageOpportunitiesCard />
        </div>

        {/* Top Movers & Neural Insights */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div>
            <TopMoversCard />
          </div>
          <div className="lg:col-span-2">
            <NeuralInsightsAdvanced />
          </div>
        </div>

        {/* News */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <CryptoNewsCard />
          </div>
        </div>
      </div>
    </main>
  )
}