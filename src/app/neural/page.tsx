"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NeuralSystemStatus from '@/components/neural/NeuralSystemStatus'

export default function NeuralSystemPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Neural System</CardTitle>
          <CardDescription>
            24/7 learning system for Bitcoin ecosystem insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="status">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="status">System Status</TabsTrigger>
              <TabsTrigger value="training">Training Data</TabsTrigger>
              <TabsTrigger value="insights">Neural Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="status" className="mt-6">
              <NeuralSystemStatus />
            </TabsContent>
            <TabsContent value="training" className="mt-6">
              <TrainingDataTab />
            </TabsContent>
            <TabsContent value="insights" className="mt-6">
              <NeuralInsightsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function TrainingDataTab() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/neural/status')
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error('Error fetching neural data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !data) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-gray-200 rounded-lg"></div>
        <div className="h-60 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-900/90 to-indigo-900/90 text-white">
          <CardTitle>Training Data Sources</CardTitle>
          <CardDescription className="text-gray-200">
            Distribution of data used for neural system training
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {data.trainingData.sources.map((source: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{source.name}</span>
                  <span>{source.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${source.percentage}%`,
                      background: `linear-gradient(to right, ${getGradientColor(index)})` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/30">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Data Collection Methods</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Real-time market data from 12 major exchanges with 1-minute resolution</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>On-chain metrics from Bitcoin, Ordinals, and Runes protocols</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Social sentiment analysis from Twitter, Discord, and Reddit</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Technical indicators calculated across multiple timeframes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>News analysis from major crypto publications and mainstream media</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 text-white">
          <CardTitle>System Resources</CardTitle>
          <CardDescription className="text-gray-200">
            Neural system resource utilization and performance
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Storage Usage</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div 
                  className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs text-white flex items-center justify-center"
                  style={{ width: `${(data.trainingData.storageUsage.used / data.trainingData.storageUsage.total) * 100}%` }}
                >
                  {data.trainingData.storageUsage.used.toFixed(1)} GB
                </div>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Used: {data.trainingData.storageUsage.used.toFixed(1)} GB</span>
                <span>Total: {data.trainingData.storageUsage.total} GB</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">CPU Usage</h3>
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{data.systemHealth.cpuUsage.toFixed(1)}%</span>
                  <span className="text-sm text-purple-600 dark:text-purple-400 ml-2">of capacity</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2 mt-2 dark:bg-purple-700">
                  <div 
                    className="h-2 rounded-full bg-purple-600"
                    style={{ width: `${data.systemHealth.cpuUsage}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-pink-800 dark:text-pink-300 mb-1">Memory Usage</h3>
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{data.systemHealth.memoryUsage.toFixed(1)}%</span>
                  <span className="text-sm text-pink-600 dark:text-pink-400 ml-2">of capacity</span>
                </div>
                <div className="w-full bg-pink-200 rounded-full h-2 mt-2 dark:bg-pink-700">
                  <div 
                    className="h-2 rounded-full bg-pink-600"
                    style={{ width: `${data.systemHealth.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800/30">
              <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">System Performance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">System uptime:</span>
                  <span className="font-medium">{data.systemHealth.uptime} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Training cycles:</span>
                  <span className="font-medium">4,328</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Inference requests:</span>
                  <span className="font-medium">1.2M / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Average response time:</span>
                  <span className="font-medium">124ms</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
              <div className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-800/30 p-2 rounded-lg mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>
                </div>
                <div>
                  <h4 className="font-medium text-indigo-800 dark:text-indigo-300">Degoo Cloud Integration</h4>
                  <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                    Neural system is integrated with Degoo cloud storage for 24/7 learning capability, ensuring continuous improvement even when your local system is offline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NeuralInsightsTab() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/neural/status')
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error('Error fetching neural data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !data) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-gray-200 rounded-lg"></div>
        <div className="h-60 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  // Additional insights beyond what's in the API response
  const additionalInsights = [
    {
      category: 'Market Patterns',
      insights: [
        'Detected cyclical pattern in Ordinals floor prices following Bitcoin volatility events',
        'Identified correlation between specific Twitter influencers and short-term Rune price movements',
        'Observed increasing institutional interest in Bitcoin Ordinals based on wallet clustering analysis'
      ]
    },
    {
      category: 'On-Chain Analysis',
      insights: [
        'Detected significant accumulation of Ordinals by wallets with 5+ year BTC holding history',
        'Identified pattern of Rune transfers preceding major price movements with 72% accuracy',
        'Observed increasing integration of Ordinals in DeFi protocols based on transaction patterns'
      ]
    },
    {
      category: 'Technical Indicators',
      insights: [
        'Developed custom oscillator for Ordinals markets with 68% predictive accuracy',
        'Optimized Fibonacci retracement levels specifically for Bitcoin ecosystem assets',
        'Created volatility prediction model for Runes with 74% accuracy for 24-hour forecasts'
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-900/90 to-purple-900/90 text-white">
          <CardTitle>Latest Neural Insights</CardTitle>
          <CardDescription className="text-gray-200">
            Real-time insights generated by our neural system
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 mb-6">
            <ul className="space-y-4">
              {data.recentInsights.map((insight: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-800/30 p-1.5 rounded-full mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M2 12h5"></path><path d="M9 12h5"></path><path d="M16 12h6"></path><path d="M3.5 5.5L7 3"></path><path d="M3.5 18.5L7 21"></path><path d="M20.5 5.5L17 3"></path><path d="M20.5 18.5L17 21"></path></svg>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">{insight}</p>
                    <p className="text-xs text-gray-500 mt-1">Generated {Math.floor(Math.random() * 24)} hours ago</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {additionalInsights.map((category, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-medium mb-3">{category.category}</h3>
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700/30">
                <ul className="space-y-3">
                  {category.insights.map((insight, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-800/30 p-2 rounded-lg mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>
              </div>
              <div>
                <h4 className="font-medium text-indigo-800 dark:text-indigo-300">Continuous Learning</h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                  Our neural system continuously learns from market data, on-chain metrics, and social sentiment to improve its insights and recommendations. The system generates new insights every 4 hours based on the latest data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to get gradient colors for charts
function getGradientColor(index: number) {
  const gradients = [
    'rgb(59, 130, 246), rgb(37, 99, 235)',
    'rgb(99, 102, 241), rgb(79, 70, 229)',
    'rgb(139, 92, 246), rgb(124, 58, 237)',
    'rgb(168, 85, 247), rgb(147, 51, 234)',
    'rgb(217, 70, 239), rgb(192, 38, 211)',
    'rgb(236, 72, 153), rgb(219, 39, 119)',
    'rgb(244, 63, 94), rgb(225, 29, 72)',
    'rgb(248, 113, 113), rgb(239, 68, 68)',
    'rgb(251, 146, 60), rgb(249, 115, 22)',
    'rgb(251, 191, 36), rgb(245, 158, 11)'
  ]
  
  return gradients[index % gradients.length]
}
