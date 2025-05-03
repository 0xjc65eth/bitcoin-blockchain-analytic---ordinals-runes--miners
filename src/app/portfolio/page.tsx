"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import PortfolioSummary from '@/components/portfolio/PortfolioSummary'
import InvestorProfile from '@/components/portfolio/InvestorProfile'
import Questionnaire from '@/components/portfolio/Questionnaire'
import OpportunitiesList from '@/components/portfolio/OpportunitiesList'
import PortfolioSettings from '@/components/portfolio/PortfolioSettings'
import { useWallet } from '@/hooks/useWallet'

export default function PortfolioPage() {
  const { toast } = useToast()
  const { isConnected, connect, address } = useWallet()
  const [activeTab, setActiveTab] = useState("portfolio")

  const handleConnect = async () => {
    console.log("Connecting wallet...")
    try {
      await connect()
      console.log("Wallet connected successfully")

      // Show toast notification
      toast({
        title: "Wallet connected",
        description: "Your wallet has been connected successfully.",
        variant: "success",
      })
    } catch (error) {
      console.error("Wallet connection error:", error)

      // Show toast notification
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Portfolio Analysis</CardTitle>
            <CardDescription>
              Connect your wallet to analyze your Bitcoin portfolio including Ordinals, Runes, and Rare Sats.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="mb-6 text-center">
              <p className="text-lg mb-4">
                Get personalized insights and recommendations based on your holdings.
              </p>
              <ul className="text-left list-disc pl-6 mb-6 space-y-2">
                <li>Analyze your Bitcoin, Ordinals, Runes and Rare Sats</li>
                <li>Get your investor profile classification</li>
                <li>Receive personalized investment recommendations</li>
                <li>Execute transactions directly from the dashboard</li>
              </ul>
            </div>
            <Button
              size="lg"
              onClick={() => {
                console.log("Connect button clicked")
                handleConnect()
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Portfolio Analysis</CardTitle>
          <CardDescription>
            Analyze your Bitcoin portfolio including Ordinals, Runes, and Rare Sats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="portfolio" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="portfolio" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <PortfolioSummary address={address} />
                </div>
                <div className="md:col-span-1">
                  <InvestorProfile address={address} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="questionnaire" className="mt-6">
              <Questionnaire
                onComplete={() => {
                  setActiveTab("portfolio")
                  toast({
                    title: "Questionnaire completed",
                    description: "Your investor profile has been updated based on your answers.",
                    variant: "success",
                  })
                }}
              />
            </TabsContent>
            <TabsContent value="opportunities" className="mt-6">
              <OpportunitiesList address={address} />
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
              <PortfolioSettings address={address} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
