"use client"

import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'
import Link from 'next/link'

export default function ErrorPage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <Header title="Error" description="An unexpected error occurred" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ErrorDetailsCard />
        <TroubleshootingCard />
      </div>
    </main>
  )
}

function ErrorDetailsCard() {
  return (
    <DashboardCard title="Error Details">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Status</h3>
          <p className="text-red-500">500 Internal Server Error</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Description</h3>
          <p>An unexpected error occurred on our servers. Our team has been notified and is working to resolve the issue.</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Timestamp</h3>
          <p>{new Date().toLocaleString()}</p>
        </div>
      </div>
    </DashboardCard>
  )
}

function TroubleshootingCard() {
  return (
    <DashboardCard title="Troubleshooting">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Try these steps:</h3>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Refresh the page</li>
            <li>Check our <Link href="/status" className="text-blue-500 hover:underline">system status</Link></li>
            <li>Clear your browser cache</li>
            <li>Try again in a few minutes</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium">Need help?</h3>
          <p className="mt-2">If the problem persists, please <Link href="/contact" className="text-blue-500 hover:underline">contact our support team</Link>.</p>
        </div>
      </div>
    </DashboardCard>
  )
} 