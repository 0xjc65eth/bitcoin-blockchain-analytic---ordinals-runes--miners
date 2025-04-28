import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">404</h1>
        <h2 className="text-lg text-muted-foreground mb-6">PAGE NOT FOUND</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <ErrorDetailsCard />
          <NavigationOptionsCard />
        </div>
      </div>
    </main>
  )
}

function ErrorDetailsCard() {
  return (
    <DashboardCard title="Error Details">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Status</p>
          <p className="text-sm text-muted-foreground">404 Not Found</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Description</p>
          <p className="text-sm text-muted-foreground">The page you are looking for does not exist.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Timestamp</p>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
        </div>
      </div>
    </DashboardCard>
  )
}

function NavigationOptionsCard() {
  return (
    <DashboardCard title="Navigation Options">
      <div className="space-y-4">
        <div className="space-y-2">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            Return to Home
          </Link>
        </div>
        <div className="space-y-2">
          <Link href="/help" className="text-sm font-medium text-primary hover:underline">
            Visit Help Center
          </Link>
        </div>
        <div className="space-y-2">
          <Link href="/contact" className="text-sm font-medium text-primary hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </DashboardCard>
  )
} 