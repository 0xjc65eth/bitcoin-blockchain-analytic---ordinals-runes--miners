'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { Button } from '@/components/ui/button'
import { WalletProvider } from '@/components/WalletProvider'
import { ConnectWalletModal } from '@/components/ConnectWalletModal'

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

const PREMIUM_COLLECTIONS = [
  { id: 'ocm-genesis', name: 'OCM Genesis', url: 'https://magiceden.io/ordinals/marketplace/ocm-genesis' },
  { id: 'katoshi-classic', name: 'Katoshi Classic', url: 'https://magiceden.io/ordinals/marketplace/katoshi-classic' },
  { id: 'katoshi-prime', name: 'Katoshi Prime', url: 'https://magiceden.io/ordinals/marketplace/katoshi-prime' },
  { id: 'multiverso', name: 'Multiverso', url: 'https://magiceden.io/ordinals/marketplace/multiverso' },
  { id: 'seizectrl', name: 'SeizeCTRL', url: 'https://magiceden.io/ordinals/marketplace/seizectrl' },
  { id: 'n0k', name: 'N0K', url: 'https://magiceden.io/ordinals/marketplace/n0k' },
  { id: 'wizards', name: 'Wizards', url: 'https://magiceden.io/ordinals/marketplace/wizards' },
  { id: 'bitcoin-puppets', name: 'Bitcoin Puppets', url: 'https://magiceden.io/ordinals/marketplace/bitcoin-puppets' },
]

export default function SocialPage() {
  const [timeframe, setTimeframe] = useState('30d')
  const [modalOpen, setModalOpen] = useState(false)
  const [hasPremium, setHasPremium] = useState(false)
  const [userNFTs, setUserNFTs] = useState<any[]>([])

  function handleAccessChange(hasAccess: boolean, nfts: any[]) {
    setHasPremium(hasAccess)
    setUserNFTs(nfts)
  }

  return (
    <WalletProvider>
      <main className="min-h-screen bg-[#1A1A1A] text-white">
        <Header title="Social Analytics" description="Community Engagement & Sentiment Analysis" />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 text-[#8B5CF6]">Social Analytics</h1>
              <h2 className="text-xl text-gray-300 mb-2">Community Engagement & Sentiment Analysis</h2>
            </div>
            <button
              className="bg-[#8B5CF6] hover:bg-[#7C4DFF] text-white px-4 py-2 rounded font-bold"
              onClick={() => setModalOpen(true)}
            >
              Connect Wallet
            </button>
          </div>
          <ConnectWalletModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            premiumCollections={PREMIUM_COLLECTIONS.map(c => c.id)}
            onAccessChange={handleAccessChange}
          />
          {hasPremium ? (
            <div>
              {/* Premium access granted message */}
              <div className="mb-4 p-4 rounded bg-gradient-to-r from-emerald-700 to-purple-700 text-white font-bold text-lg shadow">
                Thank you for believing in our platform! 🚀
                <br />
                Your trust and support empower us to keep building and innovating for the community. Together, we are shaping the future of Ordinals, Runes, and Bitcoin.
                <br />
                Keep exploring, sharing, and growing with us. The best is yet to come!
              </div>
              {/* ...restante do conteúdo premium... */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SocialMetricsCard data={socialMetricsData} />
                <TopHashtagsTrendsCard data={hashtagsTrends} />
                <SentimentTrendCard data={sentimentTrendData} />
                <CommunityGrowthCard data={communityGrowthData} />
                <SocialFeedCard data={socialFeed} />
                <TopInfluencersCard />
                <ContentPerformanceCard />
                <EngagementMetricsCard />
              </div>
            </div>
          ) : (
            <div className="mb-6 text-yellow-400">Conecte uma carteira com NFT premium para acessar conteúdos exclusivos.</div>
          )}
          {/* Rodapé com as coleções premium */}
          <footer className="mt-12 text-xs text-gray-400">
            Coleções premium:&nbsp;
            {PREMIUM_COLLECTIONS.map((c, i) => (
              <span key={c.id}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline text-emerald-300 hover:text-emerald-400">{c.name}</a>
                {i < PREMIUM_COLLECTIONS.length - 1 && ', '}
              </span>
            ))}
          </footer>
        </div>
      </main>
    </WalletProvider>
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
    <DashboardCard title="Top Hashtags & Trends">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pr-2">#</th>
              <th className="pr-4">Hashtag/Tópico</th>
              <th className="pr-4">Plataforma</th>
              <th className="pr-4">Volume</th>
              <th className="pr-4">Sentimento</th>
              <th className="pr-4">Variação</th>
              <th className="pr-4">Trending</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-gray-900 transition">
                <td className="pr-2 font-bold text-gray-300">{i + 1}</td>
                <td className="pr-4 font-bold text-emerald-300">{item.tag}</td>
                <td className="pr-4">{item.platform}</td>
                <td className="pr-4">{item.volume.toLocaleString('en-US')}</td>
                <td className={`pr-4 font-bold ${item.sentiment === 'Bullish' ? 'text-green-400' : item.sentiment === 'Bearish' ? 'text-rose-400' : 'text-yellow-400'}`}>{item.sentiment}</td>
                <td className="pr-4">{item.change}</td>
                <td className="pr-4">{item.trending ? <span className="px-2 py-1 rounded bg-emerald-600 text-xs font-bold">🔥 Trending</span> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}

function SocialFeedCard({ data }: { data: any[] }) {
  return (
    <DashboardCard title="Social Feed (Realtime)">
      <div className="space-y-4">
        {data.map((post, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-gray-800 pb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center font-bold text-lg">
              {post.user[1]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-emerald-300">{post.user}</span>
                <span className="text-xs text-gray-400">{post.platform}</span>
                {post.trending && <span className="px-2 py-1 rounded bg-emerald-600 text-xs font-bold">🔥 Trending</span>}
                <span className={`text-xs font-bold ${
                  post.sentiment === 'Bullish' ? 'text-green-400' : 
                  post.sentiment === 'Bearish' ? 'text-rose-400' : 
                  'text-yellow-400'
                }`}>{post.sentiment}</span>
                <span className="text-xs text-gray-500">{post.time} ago</span>
              </div>
              <div className="text-sm text-white mt-2">{post.content}</div>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                {post.engagement.likes && (
                  <span>❤️ {post.engagement.likes.toLocaleString()}</span>
                )}
                {post.engagement.retweets && (
                  <span>🔄 {post.engagement.retweets.toLocaleString()}</span>
                )}
                {post.engagement.comments && (
                  <span>💬 {post.engagement.comments.toLocaleString()}</span>
                )}
                {post.engagement.upvotes && (
                  <span>⬆️ {post.engagement.upvotes.toLocaleString()}</span>
                )}
                {post.engagement.reactions && (
                  <span>👍 {post.engagement.reactions.toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
} 