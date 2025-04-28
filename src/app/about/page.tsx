import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">ABOUT</h1>
        <h2 className="text-lg text-muted-foreground mb-6">OUR STORY</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <CompanyInfoCard />
          <TeamCard />
        </div>
      </div>
    </main>
  )
}

function CompanyInfoCard() {
  return (
    <DashboardCard title="Company Information">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Founded</p>
          <p className="text-sm text-muted-foreground">2024</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Mission</p>
          <p className="text-sm text-muted-foreground">To revolutionize digital asset trading</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Location</p>
          <p className="text-sm text-muted-foreground">Global</p>
        </div>
      </div>
    </DashboardCard>
  )
}

function TeamCard() {
  return (
    <DashboardCard title="Our Team">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Leadership</p>
          <p className="text-sm text-muted-foreground">Experienced professionals</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Development</p>
          <p className="text-sm text-muted-foreground">Expert engineers</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Support</p>
          <p className="text-sm text-muted-foreground">Dedicated team</p>
        </div>
      </div>
    </DashboardCard>
  )
} 