import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'

export default function LoadingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">LOADING</h1>
        <h2 className="text-lg text-muted-foreground mb-6">PLEASE WAIT</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <LoadingStatusCard />
          <LoadingTipsCard />
        </div>
      </div>
    </main>
  )
}

function LoadingStatusCard() {
  return (
    <DashboardCard title="Loading Status">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Status</p>
          <p className="text-sm text-muted-foreground">Loading page content</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Estimated Time</p>
          <p className="text-sm text-muted-foreground">A few seconds</p>
        </div>
      </div>
    </DashboardCard>
  )
}

function LoadingTipsCard() {
  return (
    <DashboardCard title="Loading Tips">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Check Connection</p>
          <p className="text-sm text-muted-foreground">Ensure you have a stable internet connection.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Clear Cache</p>
          <p className="text-sm text-muted-foreground">Try clearing your browser cache.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Refresh Page</p>
          <p className="text-sm text-muted-foreground">If loading takes too long, refresh the page.</p>
        </div>
      </div>
    </DashboardCard>
  )
} 