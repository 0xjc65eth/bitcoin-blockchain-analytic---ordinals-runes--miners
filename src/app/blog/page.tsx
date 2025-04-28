import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">BLOG</h1>
        <h2 className="text-lg text-muted-foreground mb-6">LATEST UPDATES</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FeaturedPostsCard />
          <CategoriesCard />
        </div>
      </div>
    </main>
  )
}

function FeaturedPostsCard() {
  return (
    <DashboardCard title="Featured Posts">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Market Analysis: Q1 2024</p>
          <p className="text-sm text-muted-foreground">Comprehensive review of market trends and predictions.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Trading Strategies Guide</p>
          <p className="text-sm text-muted-foreground">Learn effective trading strategies for beginners.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Security Best Practices</p>
          <p className="text-sm text-muted-foreground">Essential security tips for crypto traders.</p>
        </div>
      </div>
    </DashboardCard>
  )
}

function CategoriesCard() {
  return (
    <DashboardCard title="Categories">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Market Analysis</p>
          <p className="text-sm text-muted-foreground">15 articles</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Trading Guides</p>
          <p className="text-sm text-muted-foreground">8 articles</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Security</p>
          <p className="text-sm text-muted-foreground">12 articles</p>
        </div>
      </div>
    </DashboardCard>
  )
} 