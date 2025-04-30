'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { useLaserEyes } from '@omnisat/lasereyes-react'
import { checkPremiumAccess } from '@/services/ordinals-service'
import {
  SocialNeuralAnalysisCard,
  SocialProjectionsCard,
  TopInfluencersCard as EnhancedTopInfluencersCard,
  SocialNewsAnalysisCard
} from '@/components/social'

// Mock data for social metrics
const socialMetricsData = [
  { platform: 'Twitter', followers: '1.2M', engagement: '8.5%', growth: '+12%', sentiment: 'Bullish' },
  { platform: 'Telegram', followers: '850K', engagement: '7.2%', growth: '+15%', sentiment: 'Bullish' },
  { platform: 'Discord', followers: '450K', engagement: '6.8%', growth: '+8%', sentiment: 'Neutral' },
  { platform: 'Reddit', followers: '320K', engagement: '5.5%', growth: '+10%', sentiment: 'Bullish' },
  { platform: 'YouTube', followers: '280K', engagement: '4.9%', growth: '+18%', sentiment: 'Bullish' }
]

const sentimentTrendData = [
  { month: 'Jan', bullish: 65, bearish: 35, neutral: 15 },
  { month: 'Feb', bullish: 58, bearish: 42, neutral: 20 },
  { month: 'Mar', bullish: 72, bearish: 28, neutral: 18 },
  { month: 'Apr', bullish: 80, bearish: 20, neutral: 12 },
  { month: 'May', bullish: 85, bearish: 15, neutral: 10 }
]

const communityGrowthData = [
  { month: 'Jan', total: 500000, active: 350000 },
  { month: 'Feb', total: 750000, active: 520000 },
  { month: 'Mar', total: 1200000, active: 850000 },
  { month: 'Apr', total: 1800000, active: 1200000 },
  { month: 'May', total: 2500000, active: 1800000 }
]

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']

// Mock para hashtags e trends
const hashtagsTrends = [
  { tag: '#Bitcoin', platform: 'Twitter', volume: 1250000, sentiment: 'Bullish', change: '+25%', trending: true },
  { tag: '#Ordinals', platform: 'Twitter', volume: 850000, sentiment: 'Bullish', change: '+42%', trending: true },
  { tag: '#BRC20', platform: 'Twitter', volume: 620000, sentiment: 'Neutral', change: '+15%', trending: true },
  { tag: '#BTCMining', platform: 'Reddit', volume: 450000, sentiment: 'Bullish', change: '+18%', trending: false },
  { tag: '#Runes', platform: 'Telegram', volume: 380000, sentiment: 'Bullish', change: '+55%', trending: true },
  { tag: '#CryptoTrading', platform: 'Twitter', volume: 320000, sentiment: 'Neutral', change: '+8%', trending: false },
  { tag: '#BTCHalving', platform: 'Twitter', volume: 280000, sentiment: 'Bullish', change: '+35%', trending: true },
  { tag: '#BitcoinETF', platform: 'Reddit', volume: 250000, sentiment: 'Bullish', change: '+22%', trending: true }
]

const socialFeed = [
  {
    user: '@BTCWhale',
    platform: 'Twitter',
    content: 'Massive accumulation happening in #Bitcoin. Smart money is positioning for the next leg up. #BTC $35k incoming! 🚀',
    sentiment: 'Bullish',
    time: '2m',
    trending: true,
    engagement: { likes: 2500, retweets: 850, comments: 320 }
  },
  {
    user: '@OrdinalsExpert',
    platform: 'Twitter',
    content: 'New record: Ordinal #12345 just sold for 2.5 BTC! The premium collections market is heating up. #Ordinals',
    sentiment: 'Bullish',
    time: '5m',
    trending: true,
    engagement: { likes: 1800, retweets: 620, comments: 245 }
  },
  {
    user: '@RunesMaster',
    platform: 'Telegram',
    content: 'Technical Analysis: Runes trading volume up 85% in the last 24h. Major protocol updates coming! 📈',
    sentiment: 'Bullish',
    time: '8m',
    trending: true,
    engagement: { reactions: 1200, shares: 450 }
  },
  {
    user: '@CryptoAnalyst',
    platform: 'Reddit',
    content: 'In-depth analysis: Why Bitcoin mining difficulty is reaching ATH and what it means for price action.',
    sentiment: 'Neutral',
    time: '12m',
    trending: false,
    engagement: { upvotes: 950, comments: 285 }
  },
  {
    user: '@BTCTechPro',
    platform: 'Twitter',
    content: 'Lightning Network capacity just hit 5000 BTC! Network effects are exponential. ⚡️',
    sentiment: 'Bullish',
    time: '15m',
    trending: true,
    engagement: { likes: 1500, retweets: 480, comments: 180 }
  }
]

import { PREMIUM_COLLECTIONS, Ordinal } from '@/services/ordinals-service'

// Mapeamento de coleções para URLs
const COLLECTION_URLS = {
  'OCM Genesis': 'https://magiceden.io/ordinals/marketplace/ocm-genesis',
  'OCM Katoshi Classic': 'https://magiceden.io/ordinals/marketplace/katoshi-classic',
  'OCM Katoshi Prime': 'https://magiceden.io/ordinals/marketplace/katoshi-prime',
  'Multiverso Pass': 'https://magiceden.io/ordinals/marketplace/multiverso',
  'Multiverse Pass': 'https://magiceden.io/ordinals/marketplace/multiverso',
  'Seize CTRL': 'https://magiceden.io/ordinals/marketplace/seizectrl',
  'N0 0RDINARY KIND': 'https://magiceden.io/ordinals/marketplace/n0k',
  'Bitcoin Puppets': 'https://magiceden.io/ordinals/marketplace/bitcoin-puppets',
  'The Wizards of Lords': 'https://magiceden.io/ordinals/marketplace/wizards',
  'Yield Hacker Pass': 'https://magiceden.io/ordinals/marketplace/yield-hacker-pass',
  'Stack Sats': 'https://magiceden.io/ordinals/marketplace/stack-sats',
}

// Formatar as coleções para exibição
const PREMIUM_COLLECTION_DISPLAY = PREMIUM_COLLECTIONS
  .filter((name, index, self) => {
    // Remover duplicados (versões maiúsculas/minúsculas)
    const normalizedName = name.toLowerCase().replace(/\s+/g, '');
    return index === self.findIndex(n => n.toLowerCase().replace(/\s+/g, '') === normalizedName);
  })
  .map(name => {
    // Encontrar URL correspondente ou usar URL padrão
    const url = COLLECTION_URLS[name] || 'https://magiceden.io/ordinals/marketplace';
    return { id: name.toLowerCase().replace(/\s+/g, '-'), name, url };
  });

export default function SocialPage() {
  const [timeframe, setTimeframe] = useState('30d')
  const { client } = useLaserEyes()

  // Simplificamos o componente removendo a verificação de carteira e premium
  // Agora todos os usuários têm acesso ao conteúdo
  useEffect(() => {
    // Apenas para registrar quando uma carteira é conectada (para logs)
    if (client && client.$store.get().address) {
      console.log('Carteira conectada:', client.$store.get().address);
    }
  }, [client]);

  return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <Header title="Social Analytics" description="Community Engagement & Sentiment Analysis" />
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <h1 className="text-4xl font-display font-bold mb-2 text-white">Social <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">Analytics</span></h1>
            <h2 className="text-xl text-gray-300 mb-2">Community Engagement & Sentiment Analysis</h2>
          </div>

          <div>
            {/* Enhanced Informational Banner with Neural Insights */}
            <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-purple-500/20 text-white shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-xl text-white">Bitcoin Social <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">Analytics Dashboard</span></h3>
                  <p className="text-xs text-gray-300 mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full">v2.2.1</span>
                    Powered by CypherNeural™ AI Engine
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-full text-xs flex items-center gap-1.5 shadow-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
                    <span className="text-gray-200">Last updated: {new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl mb-5 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-white text-lg">Neural Insight</h4>
                      <span className="px-2 py-0.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 rounded-lg text-xs flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        AI POWERED
                      </span>
                    </div>
                    <p className="text-sm text-gray-200">
                      Our AI detects a <span className="font-bold text-green-400">strongly bullish</span> sentiment pattern forming across social platforms. Bitcoin-related discussions show <span className="font-bold text-green-400">85% positive sentiment</span> with increasing momentum, suggesting potential price movement within 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mb-5 text-sm text-gray-200 px-4 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg shadow-md">
                <span className="font-bold text-blue-400">Explore comprehensive social metrics</span> and sentiment analysis for Bitcoin, Ordinals, and Runes.
                Our neural network analyzes over <span className="font-bold text-blue-400">5 million daily social interactions</span> across major platforms, providing predictive insights with <span className="font-bold text-green-400">87.3% accuracy</span>.
              </p>

              {/* Key Metrics Summary with Impact Analysis */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:border-green-500/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-gray-300">Overall Sentiment</p>
                    <span className="px-2.5 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-lg text-xs font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      STRONG SIGNAL
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">85% <span className="text-green-400">Bullish</span></p>
                      <p className="text-xs text-green-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        12% from last week
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-green-500/20">
                    <p className="text-xs text-gray-300">Impact: <span className="text-green-400 font-medium">High probability of positive price action</span></p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:border-blue-500/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-gray-300">Social Volume</p>
                    <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 rounded-lg text-xs font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                      BULLISH
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">3.8M <span className="text-blue-400">Posts</span></p>
                      <p className="text-xs text-green-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        24% from last week
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-500/20">
                    <p className="text-xs text-gray-300">Impact: <span className="text-blue-400 font-medium">Increased market awareness and liquidity</span></p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:border-purple-500/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-gray-300">Engagement Rate</p>
                    <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 rounded-lg text-xs font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                      POSITIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">7.2<span className="text-purple-400">%</span></p>
                      <p className="text-xs text-green-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        1.5% from last week
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-500/20">
                    <p className="text-xs text-gray-300">Impact: <span className="text-purple-400 font-medium">Growing community involvement</span></p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:border-amber-500/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-gray-300">Trending Topics</p>
                    <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-lg text-xs font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                      NEUTRAL
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">42 <span className="text-amber-400">Topics</span></p>
                      <p className="text-xs text-amber-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        No change
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-500/20">
                    <p className="text-xs text-gray-300">Impact: <span className="text-amber-400 font-medium">Stable market narrative</span></p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <a href="https://twitter.com/search?q=bitcoin" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#1A1A2E] hover:bg-[#1E1E3A] border border-indigo-900/30 rounded-full transition-colors flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Twitter Data
                </a>
                <a href="https://www.reddit.com/r/Bitcoin/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#1A1A2E] hover:bg-[#1E1E3A] border border-indigo-900/30 rounded-full transition-colors flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.43-1.195.031-1.642.459-.451 1.226-.442 1.665.021.441.465.431 1.189-.031 1.642z"/>
                  </svg>
                  Reddit Data
                </a>
                <a href="https://t.me/bitcoin" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#1A1A2E] hover:bg-[#1E1E3A] border border-indigo-900/30 rounded-full transition-colors flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.372-12 12 0 6.627 5.374 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm3.224 17.871c.188.133.43.166.646.085.215-.082.374-.232.463-.438.089-.206.089-.449-.001-.654l-1.893-4.312c-.021-.046-.021-.097 0-.143l1.893-4.312c.09-.205.09-.448.001-.654-.089-.206-.248-.355-.463-.438-.216-.081-.458-.048-.646.085l-7.228 5.136c-.145.104-.232.271-.232.45 0 .179.087.346.232.45l7.228 5.135z"/>
                  </svg>
                  Telegram Data
                </a>
                <a href="https://discord.com/invite/bitcoin" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#1A1A2E] hover:bg-[#1E1E3A] border border-indigo-900/30 rounded-full transition-colors flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                  Discord Data
                </a>
                <span className="px-3 py-1.5 bg-[#1A1A2E] border border-indigo-900/30 rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Data refreshes every 15 minutes</span>
                </span>
              </div>
            </div>

            {/* Neural Analysis Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Neural Network <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">Analysis</span></h2>
                  <p className="text-xs text-gray-400 mt-1">Powered by advanced machine learning algorithms with 87.3% prediction accuracy</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Analysis depth:</span>
                  <div className="flex bg-[#1A1A2E] border border-indigo-900/30 rounded-lg p-1">
                    <button className="px-3 py-1 text-xs rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white">Standard</button>
                    <button className="px-3 py-1 text-xs rounded-md text-gray-300 hover:bg-[#1E1E3A] transition-colors">Advanced</button>
                    <button className="px-3 py-1 text-xs rounded-md text-gray-300 hover:bg-[#1E1E3A] transition-colors">Expert</button>
                  </div>
                </div>
              </div>

              {/* Neural Insight Alert */}
              <div className="p-5 mb-6 bg-[#1A1A2E] border border-indigo-900/30 rounded-xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">Neural Insight Alert</h3>
                      <span className="px-2 py-0.5 bg-indigo-900/30 text-indigo-400 rounded-full text-xs animate-pulse">LIVE</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">
                      Our AI has detected a significant correlation between current social sentiment patterns and historical price movements.
                      The current bullish sentiment (85%) combined with increasing engagement metrics suggests a <span className="text-green-400 font-medium">high probability (78.4%)</span> of
                      positive price action within the next 24-48 hours.
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-[#0F172A] rounded-lg border border-indigo-900/30 hover:border-indigo-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-green-900/30 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-gray-400">Confidence Level</p>
                        </div>
                        <p className="text-white font-medium text-base">High (87.3%)</p>
                      </div>
                      <div className="p-3 bg-[#0F172A] rounded-lg border border-indigo-900/30 hover:border-indigo-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <p className="text-gray-400">Pattern Match</p>
                        </div>
                        <p className="text-white font-medium text-base">Pre-Rally Social Surge</p>
                      </div>
                      <div className="p-3 bg-[#0F172A] rounded-lg border border-indigo-900/30 hover:border-indigo-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <p className="text-gray-400">Historical Accuracy</p>
                        </div>
                        <p className="text-white font-medium text-base">92.1% (30-day)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <SocialNeuralAnalysisCard />
                <SocialProjectionsCard />
              </div>

              {/* Advanced Sentiment Analysis */}
              <div className="mt-6 p-6 rounded-xl bg-[#0F172A] border border-indigo-900/30 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Advanced Sentiment Analysis</h3>
                    <p className="text-xs text-gray-400">Detailed breakdown of market sentiment across platforms</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sentiment Distribution */}
                  <div className="bg-[#1A1A2E] p-5 rounded-xl border border-indigo-900/30 hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-white">Sentiment Distribution</h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Bullish
                          </span>
                          <span className="text-xs text-green-400 font-medium">68%</span>
                        </div>
                        <div className="w-full bg-[#0F172A] rounded-full h-2.5">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            Neutral
                          </span>
                          <span className="text-xs text-yellow-400 font-medium">22%</span>
                        </div>
                        <div className="w-full bg-[#0F172A] rounded-full h-2.5">
                          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2.5 rounded-full" style={{ width: '22%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            Bearish
                          </span>
                          <span className="text-xs text-rose-400 font-medium">10%</span>
                        </div>
                        <div className="w-full bg-[#0F172A] rounded-full h-2.5">
                          <div className="bg-gradient-to-r from-rose-500 to-rose-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-indigo-900/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400">Fear & Greed Index:</span>
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium">72 - Greed</span>
                      </div>
                      <p className="text-xs text-gray-500">Impact: <span className="text-green-400">Strong buying pressure expected</span></p>
                    </div>
                  </div>

                  {/* Key Influencers */}
                  <div className="bg-[#1A1A2E] p-5 rounded-xl border border-indigo-900/30 hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-white">Key Influencers Impact</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="p-2 bg-[#0F172A] rounded-lg border border-indigo-900/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">M</div>
                          <div>
                            <a href="https://twitter.com/MicroStrategy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">@MicroStrategy</a>
                            <p className="text-[10px] text-gray-500">Michael Saylor</p>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-green-900/20 text-green-400 rounded-lg text-xs font-medium">+12.4%</div>
                      </div>

                      <div className="p-2 bg-[#0F172A] rounded-lg border border-indigo-900/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-xs font-bold text-white">E</div>
                          <div>
                            <a href="https://twitter.com/elonmusk" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">@elonmusk</a>
                            <p className="text-[10px] text-gray-500">Elon Musk</p>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-green-900/20 text-green-400 rounded-lg text-xs font-medium">+8.7%</div>
                      </div>

                      <div className="p-2 bg-[#0F172A] rounded-lg border border-indigo-900/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">B</div>
                          <div>
                            <a href="https://twitter.com/BitcoinMagazine" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">@BitcoinMagazine</a>
                            <p className="text-[10px] text-gray-500">Bitcoin Magazine</p>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-green-900/20 text-green-400 rounded-lg text-xs font-medium">+5.2%</div>
                      </div>

                      <div className="p-2 bg-[#0F172A] rounded-lg border border-indigo-900/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-xs font-bold text-white">G</div>
                          <div>
                            <a href="https://twitter.com/GaryGensler" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">@GaryGensler</a>
                            <p className="text-[10px] text-gray-500">SEC Chairman</p>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-rose-900/20 text-rose-400 rounded-lg text-xs font-medium">-4.1%</div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-indigo-900/10">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">Impact: <span className="text-green-400">Net positive influence from key figures</span></p>
                        <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                          View all
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Triggers */}
                  <div className="bg-[#1A1A2E] p-5 rounded-xl border border-indigo-900/30 hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-white">Sentiment Triggers</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-[#0F172A] border-l-4 border-green-500 border border-indigo-900/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-900/30 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-green-400">ETF Inflows</span>
                          </div>
                          <a href="https://www.bloomberg.com/news/articles/2024-04-10/bitcoin-etfs-see-245-million-of-inflows-on-tuesday" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Source</a>
                        </div>
                        <p className="text-xs text-gray-300 ml-8">BlackRock's IBIT saw $245M in inflows yesterday, contributing to positive sentiment.</p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#0F172A] border-l-4 border-green-500 border border-indigo-900/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-900/30 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-green-400">Institutional Adoption</span>
                          </div>
                          <a href="https://www.microstrategy.com/en/investor-relations/press/microstrategy-acquires-additional-250m-in-bitcoin" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Source</a>
                        </div>
                        <p className="text-xs text-gray-300 ml-8">MicroStrategy announced additional $250M BTC purchase, boosting market confidence.</p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#0F172A] border-l-4 border-rose-500 border border-indigo-900/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-rose-900/30 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-rose-400">Regulatory Concerns</span>
                          </div>
                          <a href="https://www.sec.gov/news/press-release/2024-45" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Source</a>
                        </div>
                        <p className="text-xs text-gray-300 ml-8">SEC comments on crypto regulation created temporary uncertainty in markets.</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-indigo-900/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400">Sentiment momentum:</span>
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-900/20 text-green-400 rounded-lg text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span>Increasing</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Impact: <span className="text-green-400">Positive news outweighing negative</span></p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#0F172A] rounded-xl border border-indigo-900/30 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Analysis powered by <span className="text-indigo-400 font-medium">CypherNeural™ AI Engine v2.2.1</span></p>
                      <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleString()}</p>
                    </div>
                  </div>
                  <a href="#" className="px-3 py-2 bg-[#1A1A2E] hover:bg-[#1E1E3A] border border-indigo-900/30 rounded-lg text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Download detailed sentiment report (PDF)
                  </a>
                </div>
              </div>
            </div>

            {/* Social Data Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Social Metrics & <span className="bg-gradient-to-r from-indigo-400 to-blue-400 text-transparent bg-clip-text">Trends</span></h2>
                  <p className="text-xs text-gray-400 mt-1">Comprehensive analysis of social engagement across major platforms</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Time period:</span>
                  <div className="flex bg-[#1A1A2E] border border-indigo-900/30 rounded-lg p-1">
                    <button className="px-3 py-1 text-xs rounded-md text-gray-300 hover:bg-[#1E1E3A] transition-colors">24h</button>
                    <button className="px-3 py-1 text-xs rounded-md text-gray-300 hover:bg-[#1E1E3A] transition-colors">7d</button>
                    <button className="px-3 py-1 text-xs rounded-md bg-gradient-to-r from-indigo-500 to-blue-500 text-white">30d</button>
                    <button className="px-3 py-1 text-xs rounded-md text-gray-300 hover:bg-[#1E1E3A] transition-colors">90d</button>
                  </div>
                </div>
              </div>

              {/* Platform Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#1A1A1A] border border-[#3D3D3D] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-300">Twitter</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-white">2.4M</p>
                  <p className="text-xs text-gray-400">Mentions</p>
                  <div className="mt-2 flex items-center text-xs text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    18% from last period
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Impact: <span className="text-green-400">High visibility</span></p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#3D3D3D] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-300">Reddit</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-white">845K</p>
                  <p className="text-xs text-gray-400">Discussions</p>
                  <div className="mt-2 flex items-center text-xs text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    12% from last period
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Impact: <span className="text-green-400">Strong community</span></p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#3D3D3D] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-300">Telegram</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-white">1.2M</p>
                  <p className="text-xs text-gray-400">Messages</p>
                  <div className="mt-2 flex items-center text-xs text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    22% from last period
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Impact: <span className="text-green-400">Rapid information flow</span></p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#3D3D3D] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-300">Discord</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-white">680K</p>
                  <p className="text-xs text-gray-400">Interactions</p>
                  <div className="mt-2 flex items-center text-xs text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    15% from last period
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Impact: <span className="text-green-400">Engaged developers</span></p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SocialMetricsCard data={socialMetricsData} />
                <TopHashtagsTrendsCard data={hashtagsTrends} />
                <SentimentTrendCard data={sentimentTrendData} />
                <CommunityGrowthCard data={communityGrowthData} />
                <SocialFeedCard data={socialFeed} />
                <EnhancedTopInfluencersCard />
              </div>
            </div>

            {/* News & Engagement Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">News & Engagement Analysis</h2>
                  <p className="text-xs text-gray-400 mt-1">Impact assessment of news events and community engagement</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-[#1A1A1A] border border-[#3D3D3D] rounded-full text-xs flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1"></div>
                    <span className="text-gray-400">Live updates</span>
                  </div>
                  <button className="p-1 bg-[#1A1A1A] border border-[#3D3D3D] rounded-full hover:bg-[#2D2D2D] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Breaking News Alert */}
              <div className="p-4 mb-6 bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">Breaking News Alert</h3>
                      <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 rounded-full text-xs font-medium animate-pulse">LIVE</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 mt-1">
                      <a href="https://www.coindesk.com/business/2024/04/10/bitcoin-etfs-see-245m-of-inflows-on-tuesday/" target="_blank" rel="noopener noreferrer" className="text-[#8B5CF6] hover:text-[#6366F1] transition-colors">
                        Bitcoin ETFs See $245M of Inflows on Tuesday
                      </a> - Our neural analysis detects a <span className="text-green-400 font-medium">strongly positive</span> market reaction to this news, with sentiment scores increasing by 12.4% in the last 3 hours.
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-2 bg-[#0F172A] rounded border border-purple-900/30">
                        <p className="text-gray-400 mb-1">Social Impact</p>
                        <p className="text-white font-medium">High (8.7/10)</p>
                      </div>
                      <div className="p-2 bg-[#0F172A] rounded border border-purple-900/30">
                        <p className="text-gray-400 mb-1">Market Correlation</p>
                        <p className="text-white font-medium">Strong (92%)</p>
                      </div>
                      <div className="p-2 bg-[#0F172A] rounded border border-purple-900/30">
                        <p className="text-gray-400 mb-1">Projected Price Impact</p>
                        <p className="text-green-400 font-medium">+1.2% (24h)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <DashboardCard
                    title="News Impact Analysis"
                    subtitle="Real-time assessment of news events and their market impact"
                    headerRight={
                      <div className="flex items-center gap-2">
                        <select className="text-xs bg-[#1A1A1A] border border-[#3D3D3D] rounded px-2 py-1 text-gray-300">
                          <option value="all">All Sources</option>
                          <option value="major">Major Publications</option>
                          <option value="crypto">Crypto Media</option>
                        </select>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      <div className="p-3 bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg hover:bg-[#2D2D2D] transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">CD</div>
                            <div>
                              <a
                                href="https://www.coindesk.com/business/2024/04/10/bitcoin-etfs-see-245m-of-inflows-on-tuesday/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-[#8B5CF6] hover:text-[#6366F1] transition-colors"
                              >
                                Bitcoin ETFs See $245M of Inflows on Tuesday
                              </a>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>CoinDesk</span>
                                <span>•</span>
                                <span>2 hours ago</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">
                            +8.4% Impact
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">
                          Bitcoin exchange-traded funds (ETFs) saw $245 million of inflows on Tuesday, with BlackRock's IBIT leading the way.
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>24.5K views</span>
                            </span>
                            <span className="flex items-center gap-1 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              <span>342 shares</span>
                            </span>
                          </div>
                          <div className="text-gray-400">
                            Sentiment: <span className="text-green-400">Bullish</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg hover:bg-[#2D2D2D] transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold">BB</div>
                            <div>
                              <a
                                href="https://www.bloomberg.com/news/articles/2024-04-10/microstrategy-buys-more-bitcoin-for-250-million"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-[#8B5CF6] hover:text-[#6366F1] transition-colors"
                              >
                                MicroStrategy Buys More Bitcoin for $250 Million
                              </a>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>Bloomberg</span>
                                <span>•</span>
                                <span>5 hours ago</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">
                            +6.2% Impact
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">
                          MicroStrategy Inc. purchased about 5,445 Bitcoins for $250 million in cash during the period between March 11 and April 10.
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>18.7K views</span>
                            </span>
                            <span className="flex items-center gap-1 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              <span>287 shares</span>
                            </span>
                          </div>
                          <div className="text-gray-400">
                            Sentiment: <span className="text-green-400">Bullish</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg hover:bg-[#2D2D2D] transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">R</div>
                            <div>
                              <a
                                href="https://www.reuters.com/technology/crypto/sec-chair-gensler-says-agency-will-continue-pursue-crypto-cases-2024-04-10/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-[#8B5CF6] hover:text-[#6366F1] transition-colors"
                              >
                                SEC Chair Gensler Says Agency Will Continue to Pursue Crypto Cases
                              </a>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>Reuters</span>
                                <span>•</span>
                                <span>12 hours ago</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-2 py-1 bg-rose-900/30 text-rose-400 rounded-full text-xs">
                            -3.8% Impact
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">
                          U.S. Securities and Exchange Commission Chair Gary Gensler said on Wednesday the agency will continue to pursue cases against crypto firms.
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>15.2K views</span>
                            </span>
                            <span className="flex items-center gap-1 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              <span>198 shares</span>
                            </span>
                          </div>
                          <div className="text-gray-400">
                            Sentiment: <span className="text-rose-400">Bearish</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                      <button className="px-4 py-2 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] rounded-md transition-colors text-sm font-medium">
                        View all news articles
                      </button>
                    </div>
                  </DashboardCard>
                </div>
                <div className="lg:col-span-1">
                  <div className="grid gap-6">
                    <DashboardCard
                      title="Content Performance"
                      subtitle="Analysis of top-performing content types"
                      headerRight={
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      }
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-white">Technical Analysis</p>
                            <p className="text-xs text-gray-400">15K engagements</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-400">4.5% CTR</p>
                            <p className="text-xs text-gray-400">High performing</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500">Impact: <span className="text-green-400">Strong influence on trading decisions</span></p>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-white">Market Updates</p>
                            <p className="text-xs text-gray-400">12K engagements</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-400">3.8% CTR</p>
                            <p className="text-xs text-gray-400">Medium performing</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500">Impact: <span className="text-green-400">Moderate influence on market sentiment</span></p>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-white">Community News</p>
                            <p className="text-xs text-gray-400">10K engagements</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-yellow-400">3.2% CTR</p>
                            <p className="text-xs text-gray-400">Medium performing</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500">Impact: <span className="text-yellow-400">Builds community awareness</span></p>
                      </div>
                    </DashboardCard>

                    <DashboardCard
                      title="Engagement Metrics"
                      subtitle="Community interaction and response metrics"
                      headerRight={
                        <div className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full text-xs">
                          +12% WoW
                        </div>
                      }
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-white">Average Response Time</p>
                            <p className="text-xs text-gray-400">2 hours</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-400">95% satisfaction</p>
                            <p className="text-xs text-gray-400">Excellent</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500">Impact: <span className="text-green-400">High community trust</span></p>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-white">Community Events</p>
                            <p className="text-xs text-gray-400">85% attendance</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-400">4.8/5 rating</p>
                            <p className="text-xs text-gray-400">Very good</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500">Impact: <span className="text-green-400">Strong community cohesion</span></p>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-white">Support Tickets</p>
                            <p className="text-xs text-gray-400">98% resolved</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-400">4.9/5 rating</p>
                            <p className="text-xs text-gray-400">Excellent</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500">Impact: <span className="text-green-400">Exceptional user satisfaction</span></p>
                      </div>
                    </DashboardCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Rodapé com as coleções premium */}
          <footer className="mt-12 text-xs">
            <div className="p-4 rounded bg-[#2D2D2D] border border-[#3D3D3D] mb-4">
              <h3 className="text-sm font-bold text-white mb-2">Premium Access Information</h3>
              <p className="text-gray-300 mb-2">
                Holders of the following NFT collections will receive enhanced analytics, real-time alerts, and exclusive insights when wallet connection is enabled.
              </p>
              <div className="mb-2 mt-4 text-gray-400">Premium collections:</div>
              <div className="flex flex-wrap gap-2">
                {PREMIUM_COLLECTION_DISPLAY.map((c) => (
                  <a
                    key={c.id}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-[#3D3D3D] border border-[#4D4D4D] rounded-full text-[#8B5CF6] hover:text-[#6366F1] hover:bg-[#4D4D4D] transition-colors"
                  >
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </main>
  )
}

function SocialMetricsCard({ data }: { data: any[] }) {
  return (
    <DashboardCard title="Platform Metrics">
      <div className="space-y-4">
        {data.map((platform, index) => (
          <div key={platform.platform} className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{platform.platform}</p>
              <p className="text-xs text-gray-400">
                {platform.followers || platform.members || platform.subscribers} members
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{platform.engagement}% engagement</p>
              <p className="text-xs text-gray-400">{platform.sentiment}% sentiment</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

function SentimentTrendCard({ data }: { data: any[] }) {
  return (
    <DashboardCard title="Sentiment Trend">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }} />
            <Line type="monotone" dataKey="bullish" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="bearish" stroke="#F59E0B" strokeWidth={2} />
            <Line type="monotone" dataKey="neutral" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}

function CommunityGrowthCard({ data }: { data: any[] }) {
  return (
    <DashboardCard title="Community Growth">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }} />
            <Bar dataKey="total" fill="#8B5CF6" />
            <Bar dataKey="active" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}

function TopInfluencersCard() {
  return (
    <DashboardCard title="Top Influencers">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">@BitcoinExpert</p>
            <p className="text-xs text-gray-400">500K followers</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">98% sentiment</p>
            <p className="text-xs text-gray-400">High impact</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">@CryptoAnalyst</p>
            <p className="text-xs text-gray-400">300K followers</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">95% sentiment</p>
            <p className="text-xs text-gray-400">Medium impact</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">@OrdinalsPro</p>
            <p className="text-xs text-gray-400">200K followers</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">92% sentiment</p>
            <p className="text-xs text-gray-400">Medium impact</p>
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

function ContentPerformanceCard() {
  return (
    <DashboardCard title="Content Performance">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Technical Analysis</p>
            <p className="text-xs text-gray-400">15K engagements</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">4.5% CTR</p>
            <p className="text-xs text-gray-400">High performing</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Market Updates</p>
            <p className="text-xs text-gray-400">12K engagements</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">3.8% CTR</p>
            <p className="text-xs text-gray-400">Medium performing</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Community News</p>
            <p className="text-xs text-gray-400">10K engagements</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">3.2% CTR</p>
            <p className="text-xs text-gray-400">Medium performing</p>
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

function EngagementMetricsCard() {
  return (
    <DashboardCard title="Engagement Metrics">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Average Response Time</p>
            <p className="text-xs text-gray-400">2 hours</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">95% satisfaction</p>
            <p className="text-xs text-gray-400">Excellent</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Community Events</p>
            <p className="text-xs text-gray-400">85% attendance</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">4.8/5 rating</p>
            <p className="text-xs text-gray-400">Very good</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Support Tickets</p>
            <p className="text-xs text-gray-400">98% resolved</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">4.9/5 rating</p>
            <p className="text-xs text-gray-400">Excellent</p>
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

function TopHashtagsTrendsCard({ data }: { data: any[] }) {
  return (
    <DashboardCard
      title="Top Hashtags & Trends"
      subtitle="Real-time analysis of trending topics across platforms"
      headerRight={
        <div className="flex items-center gap-2">
          <select className="text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-300">
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
            <option value="30d">Last 30d</option>
          </select>
        </div>
      }
      footer={
        <div className="flex justify-between items-center">
          <span>Data from 12+ social platforms</span>
          <span>Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      }
    >
      <div className="overflow-x-auto scrollbar-thin">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="pr-2 pb-2">#</th>
              <th className="pr-4 pb-2">Hashtag/Topic</th>
              <th className="pr-4 pb-2">Platform</th>
              <th className="pr-4 pb-2">Volume</th>
              <th className="pr-4 pb-2">Sentiment</th>
              <th className="pr-4 pb-2">Change</th>
              <th className="pr-4 pb-2">Status</th>
              <th className="pr-4 pb-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition">
                <td className="pr-2 py-3 font-bold text-gray-300">{i + 1}</td>
                <td className="pr-4 py-3">
                  <a
                    href={`https://twitter.com/search?q=${encodeURIComponent(item.tag)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#8B5CF6] hover:text-[#6366F1] transition-colors"
                  >
                    {item.tag}
                  </a>
                </td>
                <td className="pr-4 py-3">
                  <span className="px-2 py-1 bg-gray-800 rounded-full text-gray-300">
                    {item.platform}
                  </span>
                </td>
                <td className="pr-4 py-3 font-medium">{item.volume.toLocaleString('en-US')}</td>
                <td className="pr-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.sentiment === 'Bullish' ? 'bg-green-900/50 text-green-400' :
                    item.sentiment === 'Bearish' ? 'bg-rose-900/50 text-rose-400' :
                    'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {item.sentiment}
                  </span>
                </td>
                <td className={`pr-4 py-3 font-medium ${
                  item.change.startsWith('+') ? 'text-green-400' : 'text-rose-400'
                }`}>
                  {item.change}
                </td>
                <td className="pr-4 py-3">
                  {item.trending ?
                    <span className="px-2 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-xs font-bold flex items-center gap-1 w-fit">
                      <span className="animate-pulse">🔥</span> Trending
                    </span>
                    :
                    <span className="px-2 py-1 rounded-full bg-gray-800 text-xs text-gray-400 w-fit">
                      Normal
                    </span>
                  }
                </td>
                <td className="pr-4 py-3">
                  <button className="text-[#8B5CF6] hover:text-[#6366F1] transition-colors">
                    View Analysis
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
          <span>Bullish</span>
          <span className="w-3 h-3 rounded-full bg-yellow-400 ml-2"></span>
          <span>Neutral</span>
          <span className="w-3 h-3 rounded-full bg-rose-400 ml-2"></span>
          <span>Bearish</span>
        </div>
        <button className="text-[#8B5CF6] hover:text-[#6366F1] transition-colors">
          View all trends →
        </button>
      </div>
    </DashboardCard>
  )
}

function SocialFeedCard({ data }: { data: any[] }) {
  return (
    <DashboardCard title="Social Feed (Realtime)"
      headerRight={
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Refreshed every 60s</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      }
    >
      <div className="space-y-6">
        {data.map((post, i) => (
          <div key={i} className="flex items-start gap-4 border-b border-gray-800 pb-6 hover:bg-gray-900/30 p-3 rounded-lg transition-colors">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center font-bold text-lg shadow-md">
              {post.user[1]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <a
                  href={`https://${post.platform.toLowerCase()}.com/${post.user.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  {post.user}
                </a>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-300">{post.platform}</span>
                {post.trending && (
                  <span className="px-2 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-xs font-bold flex items-center gap-1">
                    <span className="animate-pulse">🔥</span> Trending
                  </span>
                )}
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  post.sentiment === 'Bullish' ? 'bg-green-900/50 text-green-400' :
                  post.sentiment === 'Bearish' ? 'bg-rose-900/50 text-rose-400' :
                  'bg-yellow-900/50 text-yellow-400'
                }`}>{post.sentiment}</span>
                <span className="text-xs text-gray-500">{post.time} ago</span>
              </div>

              <div className="text-sm text-white mt-3 leading-relaxed">
                {post.content.split(/(#[a-zA-Z0-9_]+|\$[A-Z]+)/).map((part, index) => {
                  if (part.startsWith('#')) {
                    return (
                      <a
                        key={index}
                        href={`https://twitter.com/search?q=${encodeURIComponent(part)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8B5CF6] hover:text-[#6366F1] transition-colors"
                      >
                        {part}
                      </a>
                    );
                  } else if (part.startsWith('$')) {
                    return (
                      <a
                        key={index}
                        href={`https://www.coingecko.com/en/coins/${part.substring(1).toLowerCase()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        {part}
                      </a>
                    );
                  } else {
                    return part;
                  }
                })}
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-xs">
                {post.engagement.likes && (
                  <span className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                    <span className="text-red-400">❤️</span> {post.engagement.likes.toLocaleString()}
                  </span>
                )}
                {post.engagement.retweets && (
                  <span className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                    <span className="text-green-400">🔄</span> {post.engagement.retweets.toLocaleString()}
                  </span>
                )}
                {post.engagement.comments && (
                  <span className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                    <span className="text-blue-400">💬</span> {post.engagement.comments.toLocaleString()}
                  </span>
                )}
                {post.engagement.upvotes && (
                  <span className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                    <span className="text-orange-400">⬆️</span> {post.engagement.upvotes.toLocaleString()}
                  </span>
                )}
                {post.engagement.reactions && (
                  <span className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                    <span className="text-yellow-400">👍</span> {post.engagement.reactions.toLocaleString()}
                  </span>
                )}

                {/* Link to original post */}
                <a
                  href={post.url || `https://${post.platform.toLowerCase()}.com/${post.user.replace('@', '')}/status/${Date.now().toString(36)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-[#8B5CF6] hover:text-[#6366F1] transition-colors"
                >
                  View original post →
                </a>
              </div>

              {/* Additional metrics */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-800/50 p-2 rounded">
                  <span className="text-gray-400">Reach:</span> <span className="text-white">{(post.engagement.likes * 7).toLocaleString()}</span>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <span className="text-gray-400">Influence Score:</span> <span className="text-white">{(Math.random() * 10).toFixed(1)}/10</span>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <span className="text-gray-400">Market Impact:</span> <span className={post.sentiment === 'Bullish' ? 'text-green-400' : 'text-red-400'}>
                    {post.sentiment === 'Bullish' ? '+' : '-'}{(Math.random() * 0.5).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center">
          <button className="px-4 py-2 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] rounded-md transition-colors text-sm font-medium">
            Load more posts
          </button>
        </div>
      </div>
    </DashboardCard>
  )
}