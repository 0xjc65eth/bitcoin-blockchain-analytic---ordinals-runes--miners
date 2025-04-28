import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">ANALYTICS</h1>
        <h2 className="text-lg text-muted-foreground mb-6">PERFORMANCE METRICS</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <PerformanceMetricsCard />
          <RiskMetricsCard />
        </div>
      </div>
    </main>
  )
}

function PerformanceMetricsCard() {
  return (
    <DashboardCard title="Performance Metrics">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Total Return</p>
          <p className="text-sm text-green-500">+24.5%</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Sharpe Ratio</p>
          <p className="text-sm text-muted-foreground">1.8</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Max Drawdown</p>
          <p className="text-sm text-red-500">-12.3%</p>
        </div>
      </div>
    </DashboardCard>
  )
}

function RiskMetricsCard() {
  return (
    <DashboardCard title="Risk Metrics">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Volatility</p>
          <p className="text-sm text-muted-foreground">15.2%</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Beta</p>
          <p className="text-sm text-muted-foreground">1.1</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Value at Risk (95%)</p>
          <p className="text-sm text-muted-foreground">$2,500</p>
        </div>
      </div>
    </DashboardCard>
  )
} 