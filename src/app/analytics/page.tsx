import { Header } from '@/components/header'
import { NeuralInsightsAdvanced } from '@/components/neural/neural-insights-advanced'
import { CryptoNewsCard } from '@/components/news/crypto-news-card'
import { MarketOverviewCard } from '@/components/market/market-overview-card'
import { TopMoversCard } from '@/components/market/top-movers-card'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import('@/components/charts/trading-view-widget'),
  { ssr: false }
)

const TechnicalAnalysisCard = dynamic(
  () => import('@/components/analytics/technical-analysis-card'),
  { ssr: false }
)

const OnChainMetricsCard = dynamic(
  () => import('@/components/analytics/onchain-metrics-card'),
  { ssr: false }
)

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">ANALYTICS</h1>
        <h2 className="text-lg text-muted-foreground mb-6">COMPREHENSIVE MARKET ANALYSIS & INSIGHTS</h2>

        {/* Price Chart & Market Overview */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl rounded-xl overflow-hidden h-[400px]">
              <TradingViewWidget symbol="BITSTAMP:BTCUSD" />
            </div>
          </div>
          <div>
            <MarketOverviewCard />
          </div>
        </div>

        {/* Technical Analysis */}
        <div className="mb-6">
          <TechnicalAnalysisCard />
        </div>

        {/* On-Chain Metrics */}
        <div className="mb-6">
          <OnChainMetricsCard />
        </div>

        {/* Neural Insights & Top Movers */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div className="lg:col-span-2">
            <NeuralInsightsAdvanced />
          </div>
          <div>
            <TopMoversCard />
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