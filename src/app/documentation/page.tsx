import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'
export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">DOCUMENTATION</h1>
        <h2 className="text-lg text-muted-foreground mb-6">PLATFORM GUIDE</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <GettingStartedCard />
          <APIDocumentationCard />
        </div>
      </div>
    </main>
  )
}
function GettingStartedCard() {
  return (
    <DashboardCard title="Getting Started">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Account Setup</p>
          <p className="text-sm text-muted-foreground">Learn how to create and verify your account.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Trading Basics</p>
          <p className="text-sm text-muted-foreground">Understand the fundamentals of trading.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Security Guide</p>
          <p className="text-sm text-muted-foreground">Best practices for account security.</p>
        </div>
      </div>
    </DashboardCard>
  )
}
function APIDocumentationCard() {
  return (
    <DashboardCard title="API Documentation">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Authentication</p>
          <p className="text-sm text-muted-foreground">API key generation and authentication.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Endpoints</p>
          <p className="text-sm text-muted-foreground">Available API endpoints and usage.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Webhooks</p>
          <p className="text-sm text-muted-foreground">Setting up and using webhooks.</p>
        </div>
      </div>
    </DashboardCard>
  )
} 