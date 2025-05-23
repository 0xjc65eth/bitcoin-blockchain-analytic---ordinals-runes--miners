'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { 
  AreaChart, 
  BarChart, 
  LineChart,
  Card,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  Grid,
  Col,
  Metric,
  Flex,
  ProgressBar,
  BadgeDelta,
  DeltaType,
  DonutChart,
  Legend,
  Color,
  BarList
} from '@tremor/react'
import { useMarketData } from '@/hooks/useMarketData'
import { useMempoolData } from '@/hooks/useMempoolData'
import { useMiningData } from '@/hooks/useMiningData'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import Image from 'next/image'

const timeframes = ['24H', '7D', '30D', 'ALL']

const colors: Record<string, Color> = {
  primary: 'purple',
  secondary: 'violet',
  accent: 'indigo',
  neutral: 'slate',
  success: 'emerald',
  warning: 'amber',
  danger: 'rose'
} as const

const neuralInsights = [
  { name: 'Bullish Signal', value: 0.82, color: 'emerald' },
  { name: 'Bearish Signal', value: 0.18, color: 'rose' },
]

const smcAnalysis = [
  { name: 'Support', value: 63500, color: 'emerald' },
  { name: 'Resistance', value: 67000, color: 'rose' },
  { name: 'Pivot', value: 65000, color: 'violet' },
]

const inflowOutflow = [
  { date: '2024-04-01', inflow: 1200, outflow: 900 },
  { date: '2024-04-02', inflow: 1500, outflow: 1100 },
  { date: '2024-04-03', inflow: 900, outflow: 1300 },
  { date: '2024-04-04', inflow: 1700, outflow: 1400 },
]

const premiumBenefits = [
  'Advanced analytics & neural signals',
  'SMC & on-chain insights',
  'Unlimited alerts & notifications',
  'Priority support',
  'Exclusive premium content',
  'Early access to new features',
]

const premiumPlans = [
  {
    name: 'Basic',
    price: 19,
    color: 'from-[#34d399] to-[#10b981]',
    btc: 0.00028,
    features: [
      'Access to basic analytics',
      'Standard alerts',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: 55,
    color: 'from-[#6366F1] to-[#8B5CF6]',
    btc: 0.0008,
    features: [
      'Advanced analytics & neural signals',
      'SMC & on-chain insights',
      'Unlimited alerts & notifications',
      'Priority support',
      'Exclusive premium content',
      'Early access to new features',
    ],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    color: 'from-[#f59e42] to-[#fbbf24]',
    btc: 0.0029,
    features: [
      'All Pro features',
      'Dedicated account manager',
      'Custom integrations',
      'API access',
      'White-glove onboarding',
    ],
  },
]

const marketVariables = [
  { label: 'RSI', value: '62.3', color: 'violet' },
  { label: 'MACD', value: '+0.012', color: 'emerald' },
  { label: 'Fear & Greed', value: 'Greed', color: 'amber' },
  { label: 'Whale Activity', value: 'High', color: 'rose' },
  { label: 'Volume', value: '$2.1B', color: 'blue' },
  { label: 'Volatility', value: '3.8%', color: 'cyan' },
  { label: 'Liquidity', value: '$1.5B', color: 'indigo' },
]

const ordinalsOverview = {
  volume: 12000,
  topCollection: 'OCM Genesis',
  topSale: 8.2,
  marketCap: 320000,
  trend: '+12.5%',
}

const runesOverview = {
  volume: 8500,
  topToken: 'ORDI',
  topSale: 2.7,
  marketCap: 210000,
  trend: '+8.9%',
}

const ordinalsMarket = {
  volume: 14500,
  marketCap: 420000,
  topCollection: 'OCM Genesis',
  topSale: 12.3,
  holders: 3200,
  liquidity: 18000,
  trend: '+15.2%',
  neuralSignal: 'Long',
  confidence: 'High',
  rationale: 'Strong inflow, whale accumulation, and positive social sentiment detected by neural engine.',
  topCollections: [
    { name: 'OCM Genesis', volume: 4200, sales: 120, floor: 2.1 },
    { name: 'Bitcoin Frogs', volume: 3100, sales: 98, floor: 1.7 },
    { name: 'Ordinal Maxi Biz', volume: 2500, sales: 80, floor: 1.2 },
  ],
  salesHistory: [
    { date: '2024-04-01', sales: 80 },
    { date: '2024-04-02', sales: 95 },
    { date: '2024-04-03', sales: 110 },
    { date: '2024-04-04', sales: 120 },
  ],
  heatmap: [
    { hour: '00h', volume: 1200 },
    { hour: '06h', volume: 1800 },
    { hour: '12h', volume: 3200 },
    { hour: '18h', volume: 4300 },
  ],
  tradeOpportunities: [
    { signal: 'Buy', collection: 'OCM Genesis', confidence: 'High', rationale: 'Volume spike and strong neural buy signal.' },
    { signal: 'Watch', collection: 'Bitcoin Frogs', confidence: 'Medium', rationale: 'Increasing liquidity, but sentiment is mixed.' },
  ],
}

const runesMarket = {
  volume: 9800,
  marketCap: 250000,
  topToken: 'ORDI',
  topSale: 3.1,
  holders: 2100,
  liquidity: 12000,
  trend: '+9.8%',
  neuralSignal: 'Wait',
  confidence: 'Medium',
  rationale: 'Mixed on-chain signals, moderate inflow, and neutral sentiment.',
  topTokens: [
    { name: 'ORDI', volume: 4200, trades: 120, price: 0.0008 },
    { name: 'DOGI', volume: 2100, trades: 80, price: 0.0003 },
    { name: 'PEPE', volume: 1500, trades: 60, price: 0.0002 },
  ],
  tradesHistory: [
    { date: '2024-04-01', trades: 60 },
    { date: '2024-04-02', trades: 75 },
    { date: '2024-04-03', trades: 90 },
    { date: '2024-04-04', trades: 110 },
  ],
  heatmap: [
    { hour: '00h', volume: 800 },
    { hour: '06h', volume: 1200 },
    { hour: '12h', volume: 2100 },
    { hour: '18h', volume: 3200 },
  ],
  tradeOpportunities: [
    { signal: 'Buy', token: 'ORDI', confidence: 'High', rationale: 'Neural system detects strong inflow and positive momentum.' },
    { signal: 'Sell', token: 'DOGI', confidence: 'Medium', rationale: 'Decreasing volume and negative sentiment.' },
  ],
}

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H')
  const { data: miningData = {
    hashRate: 0,
    blockTime: 0,
    difficulty: 0
  } } = useMiningData()
  
  const { data: marketData = {
    btcPrice: 0,
    btcChange24h: 0,
    volume24h: 0,
    marketCap: 0
  } } = useMarketData()
  
  const { data: mempoolData = {
    pendingTransactions: 0
  } } = useMempoolData()

  const deltaType: DeltaType = (marketData?.btcChange24h ?? 0) >= 0 ? "increase" : "decrease"
  const DeltaIcon = (marketData?.btcChange24h ?? 0) >= 0 ? RiArrowUpSLine : RiArrowDownSLine

  return (
    <main className="min-h-screen bg-[#121212]">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">
              DASHBOARD
            </h1>
            <h2 className="text-lg text-gray-400">Real-time Market Analysis</h2>
          </div>
          <TabGroup>
            <TabList variant="solid" className="bg-[#2D2D2D] p-1 rounded-xl">
              {timeframes.map((tf) => (
                <Tab 
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className="px-6 py-2 text-sm font-medium"
                >
                  {tf}
                </Tab>
              ))}
            </TabList>
          </TabGroup>
        </div>

        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mb-6">
          <Col>
            <Card className="bg-[#1D1D1D] border border-[#3D3D3D] shadow-xl">
              <Flex alignItems="start">
                <div>
                  <Text className="text-gray-400">Bitcoin Price</Text>
                  <Metric className="text-white">${(marketData?.btcPrice ?? 0).toLocaleString()}</Metric>
                </div>
                <BadgeDelta deltaType={deltaType} className="flex items-center">
                  <DeltaIcon className="w-4 h-4 mr-1" />
                  {(marketData?.btcChange24h ?? 0).toFixed(2)}%
                </BadgeDelta>
              </Flex>
              <AreaChart
                className="h-48 mt-6"
                data={[
                  { date: '2024-01', value: 42000 },
                  { date: '2024-02', value: 45000 },
                  { date: '2024-03', value: 68000 },
                  { date: '2024-04', value: 65000 },
                ]}
                index="date"
                categories={['value']}
                colors={[colors.primary]}
                showAnimation
                showLegend={false}
                showGridLines={false}
                showXAxis={true}
                showYAxis={true}
                yAxisWidth={65}
                curveType="natural"
                valueFormatter={(value) => `$${value.toLocaleString()}`}
              />
            </Card>
          </Col>

          <Col>
            <Card className="bg-[#1D1D1D] border border-[#3D3D3D] shadow-xl">
              <Title className="text-white">Mempool Analysis</Title>
              <Flex className="mt-4">
                <Text className="text-gray-400">Pending Transactions</Text>
                <Text className="text-white font-medium">{(mempoolData?.pendingTransactions ?? 0).toLocaleString()}</Text>
              </Flex>
              <ProgressBar 
                value={75} 
                color={colors.secondary}
                className="mt-2" 
              />
              <DonutChart
                className="h-48 mt-6"
                data={[
                  { name: '1-2 sat/vB', value: 150 },
                  { name: '2-5 sat/vB', value: 300 },
                  { name: '5-10 sat/vB', value: 200 },
                  { name: '10+ sat/vB', value: 100 },
                ]}
                category="value"
                index="name"
                colors={[colors.primary, colors.secondary, colors.accent, colors.neutral]}
                showAnimation
                showTooltip
                valueFormatter={(value) => `${value} txs`}
              />
              <Legend 
                className="mt-3"
                categories={['1-2 sat/vB', '2-5 sat/vB', '5-10 sat/vB', '10+ sat/vB']}
                colors={[colors.primary, colors.secondary, colors.accent, colors.neutral]}
              />
            </Card>
          </Col>

          <Col>
            <Card className="bg-[#1D1D1D] border border-[#3D3D3D] shadow-xl">
              <Title className="text-white">Network Hash Rate</Title>
              <Flex className="mt-4">
                <div>
                  <Text className="text-gray-400">Current Hash Rate</Text>
                  <Metric className="text-white">{(miningData?.hashRate ?? 0).toLocaleString()} EH/s</Metric>
                </div>
                <BadgeDelta deltaType="increase" className="self-end">
                  +5.2%
                </BadgeDelta>
              </Flex>
              <LineChart
                className="h-48 mt-6"
                data={[
                  { date: '2024-01', hashrate: 400 },
                  { date: '2024-02', hashrate: 420 },
                  { date: '2024-03', hashrate: 450 },
                  { date: '2024-04', hashrate: 470 },
                ]}
                index="date"
                categories={['hashrate']}
                colors={[colors.primary]}
                showAnimation
                showLegend={false}
                showGridLines={false}
                curveType="monotone"
                valueFormatter={(value) => `${value} EH/s`}
              />
            </Card>
          </Col>
        </Grid>

        <Grid numItems={1} numItemsSm={2} className="gap-6 mt-6">
          <Col>
            <Card className="bg-[#181F3A] border-none shadow-xl">
              <Title className="text-white">Neural Network Insights</Title>
              <BarList data={neuralInsights} className="mt-4" />
              <Text className="mt-4 text-sm text-white/80">Our neural engine currently detects a <b>bullish</b> bias. Signals are updated in real time based on on-chain and market data.</Text>
            </Card>
          </Col>
          <Col>
            <Card className="bg-[#1A2A2F] border-none shadow-xl">
              <Title className="text-white">SMC Analysis</Title>
              <BarList data={smcAnalysis} className="mt-4" />
              <Text className="mt-4 text-sm text-white/80">Key support, resistance, and pivot levels for strategic trading decisions.</Text>
            </Card>
          </Col>
          <Col>
            <Card className="bg-[#1F2937] border-none shadow-xl">
              <Title className="text-white">Inflow / Outflow</Title>
              <BarChart
                className="h-48 mt-4"
                data={inflowOutflow}
                index="date"
                categories={["inflow", "outflow"]}
                colors={["emerald", "rose"]}
                showAnimation
                showLegend
                showGridLines={false}
              />
              <Text className="mt-4 text-sm text-white/80">Track exchange inflows and outflows to anticipate market moves.</Text>
            </Card>
          </Col>
          <Col>
            <Card className="bg-[#23272F] border-none shadow-xl">
              <Title className="text-white">Decision Variables & Insights</Title>
              <ul className="mt-4 space-y-2 text-white/90 text-sm">
                <li>Funding Rate: <span className="text-emerald-400">+0.012%</span></li>
                <li>Open Interest: <span className="text-emerald-400">$1.2B</span></li>
                <li>Long/Short Ratio: <span className="text-rose-400">1.8</span></li>
                <li>Volatility Index: <span className="text-violet-400">3.2%</span></li>
                <li>Social Sentiment: <span className="text-emerald-400">Positive</span></li>
                <li>Network Health: <span className="text-emerald-400">Strong</span></li>
              </ul>
              <Text className="mt-4 text-xs text-white/70">These variables help you make smarter, data-driven trading decisions.</Text>
            </Card>
          </Col>
        </Grid>

        <Grid numItems={1} numItemsSm={2} className="gap-6">
          <Col>
            <Card className="bg-[#1D1D1D] border border-[#3D3D3D] shadow-xl">
              <Title className="text-white">Market Analysis</Title>
              <Grid numItems={2} className="gap-4 mt-4">
                <Card className="bg-[#2D2D2D] border-none">
                  <Text className="text-gray-400">24h Volume</Text>
                  <Metric className="text-white">${(marketData?.volume24h ?? 0).toLocaleString()}</Metric>
                </Card>
                <Card className="bg-[#2D2D2D] border-none">
                  <Text className="text-gray-400">Market Cap</Text>
                  <Metric className="text-white">${(marketData?.marketCap ?? 0).toLocaleString()}</Metric>
                </Card>
              </Grid>
              <AreaChart
                className="h-64 mt-6"
                data={[
                  { date: '2024-01', volume: 30000000000 },
                  { date: '2024-02', volume: 35000000000 },
                  { date: '2024-03', volume: 40000000000 },
                  { date: '2024-04', volume: 38000000000 },
                ]}
                index="date"
                categories={['volume']}
                colors={[colors.primary]}
                showAnimation
                showLegend={false}
                showGridLines={false}
                valueFormatter={(number) => 
                  `$${Intl.NumberFormat('us').format(number).toString()}B`
                }
              />
            </Card>
          </Col>

          <Col>
            <Card className="bg-[#1D1D1D] border border-[#3D3D3D] shadow-xl">
              <Title className="text-white">Network Health</Title>
              <Grid numItems={2} className="gap-4 mt-4">
                <Card className="bg-[#2D2D2D] border-none">
                  <Text className="text-gray-400">Block Time</Text>
                  <Metric className="text-white">{(miningData?.blockTime ?? 0).toLocaleString()} min</Metric>
                </Card>
                <Card className="bg-[#2D2D2D] border-none">
                  <Text className="text-gray-400">Difficulty</Text>
                  <Metric className="text-white">{(miningData?.difficulty ?? 0).toLocaleString()} T</Metric>
                </Card>
              </Grid>
              <LineChart
                className="h-64 mt-6"
                data={[
                  { date: '2024-01', difficulty: 55 },
                  { date: '2024-02', difficulty: 58 },
                  { date: '2024-03', difficulty: 62 },
                  { date: '2024-04', difficulty: 65 },
                ]}
                index="date"
                categories={['difficulty']}
                colors={[colors.primary]}
                showAnimation
                showLegend={false}
                showGridLines={false}
                valueFormatter={(number) => `${number}T`}
              />
            </Card>
          </Col>
        </Grid>

        <Grid numItems={1} numItemsSm={2} className="gap-6 mt-6">
          <Col>
            <Card className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white border-none shadow-xl p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Coluna de métricas principais */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Title className="text-white text-2xl">Ordinals Market</Title>
                    <span className="ml-2 px-2 py-1 rounded bg-emerald-500 text-xs font-bold animate-pulse">Atualização em tempo real</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="block text-xs text-white/70">Volume</span>
                      <span className="text-lg font-bold text-emerald-300">{(ordinalsMarket.volume ?? 0).toLocaleString()} BTC</span>
                    </div>
                    <div>
                      <span className="block text-xs text-white/70">Market Cap</span>
                      <span className="text-lg font-bold text-blue-300">${(ordinalsMarket.marketCap ?? 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-white/70">Holders</span>
                      <span className="text-lg font-bold text-pink-300">{(ordinalsMarket.holders ?? 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-white/70">Liquidity</span>
                      <span className="text-lg font-bold text-cyan-300">{(ordinalsMarket.liquidity ?? 0).toLocaleString()} BTC</span>
                    </div>
                    <div>
                      <span className="block text-xs text-white/70">Trend</span>
                      <span className="text-lg font-bold text-emerald-400">{(ordinalsMarket.trend ?? '')}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-white/70">Top Sale</span>
                      <span className="text-lg font-bold text-amber-300">{(ordinalsMarket.topSale ?? 0).toLocaleString()} BTC</span>
                    </div>
                  </div>
                </div>
                {/* Coluna de gráficos */}
                <div className="flex-1 space-y-4">
                  <BarChart
                    className="h-28"
                    data={ordinalsMarket.topCollections}
                    index="name"
                    categories={["volume"]}
                    colors={["emerald"]}
                    showAnimation
                    showLegend={false}
                    showGridLines={false}
                    valueFormatter={(v) => `${v} BTC`}
                  />
                  <LineChart
                    className="h-24"
                    data={ordinalsMarket.salesHistory}
                    index="date"
                    categories={["sales"]}
                    colors={["amber"]}
                    showAnimation
                    showLegend={false}
                    showGridLines={false}
                  />
                  <BarChart
                    className="h-16"
                    data={ordinalsMarket.heatmap}
                    index="hour"
                    categories={["volume"]}
                    colors={["violet"]}
                    showAnimation
                    showLegend={false}
                    showGridLines={false}
                  />
                </div>
                {/* Coluna de insights neurais */}
                <div className="flex-1 space-y-2">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981]">
                    <span className="font-bold text-lg">Neural Trade Insight:</span>
                    <span className="ml-2 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold">{(ordinalsMarket.neuralSignal ?? '')}</span>
                    <span className="ml-2 px-2 py-1 rounded bg-emerald-400 text-white text-xs">{(ordinalsMarket.confidence ?? '')} Confidence</span>
                    <p className="mt-2 text-white/90 text-sm">{(ordinalsMarket.rationale ?? '')}</p>
                    <ul className="mt-2 space-y-1 text-white/90 text-xs">
                      {ordinalsMarket.tradeOpportunities?.map((op, idx) => (
                        <li key={idx}><b>{op.signal}</b> {op.collection} <span className="text-emerald-200">({op.confidence})</span>: {op.rationale}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col>
            <Card className="bg-gradient-to-br from-[#f59e42] to-[#fbbf24] text-white border-none shadow-xl p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Coluna de métricas principais */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Title className="text-white text-2xl">Runes Market</Title>
                    <span className="ml-2 px-2 py-1 rounded bg-yellow-400 text-xs font-bold animate-pulse">Atualização em tempo real</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="block text-xs text-white/70">Volume</span>
                      <span className="text-lg font-bold text-emerald-300">{(runesMarket.volume ?? 0).toLocaleString()} BTC</span>
                    </div>
                    <div>
                      <span className="block text-xs text-white/70">Market Cap</span>
                      <span className="text-lg font-bold text-blue-300">${(runesMarket.marketCap ?? 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-white/70">Holders</span>
                      <span className="text-lg font-bold text-pink-300">{(runesMarket.holders ?? 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-white/70">Liquidity</span>
                      <span className="text-lg font-bold text-cyan-300">{(runesMarket.liquidity ?? 0).toLocaleString()} BTC</span>
                    </div>
                    <div>
                      <span className="block text-xs text-white/70">Trend</span>
                      <span className="text-lg font-bold text-emerald-400">{(runesMarket.trend ?? '')}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-white/70">Top Sale</span>
                      <span className="text-lg font-bold text-amber-300">{(runesMarket.topSale ?? 0).toLocaleString()} BTC</span>
                    </div>
                  </div>
                </div>
                {/* Coluna de gráficos */}
                <div className="flex-1 space-y-4">
                  <BarChart
                    className="h-28"
                    data={runesMarket.topTokens}
                    index="name"
                    categories={["volume"]}
                    colors={["emerald"]}
                    showAnimation
                    showLegend={false}
                    showGridLines={false}
                    valueFormatter={(v) => `${v} BTC`}
                  />
                  <LineChart
                    className="h-24"
                    data={runesMarket.tradesHistory}
                    index="date"
                    categories={["trades"]}
                    colors={["amber"]}
                    showAnimation
                    showLegend={false}
                    showGridLines={false}
                  />
                  <BarChart
                    className="h-16"
                    data={runesMarket.heatmap}
                    index="hour"
                    categories={["volume"]}
                    colors={["violet"]}
                    showAnimation
                    showLegend={false}
                    showGridLines={false}
                  />
                </div>
                {/* Coluna de insights neurais */}
                <div className="flex-1 space-y-2">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#f43f5e] to-[#fbbf24]">
                    <span className="font-bold text-lg">Neural Trade Insight:</span>
                    <span className="ml-2 px-3 py-1 rounded-full bg-yellow-600 text-white font-bold">{(runesMarket.neuralSignal ?? '')}</span>
                    <span className="ml-2 px-2 py-1 rounded bg-yellow-400 text-white text-xs">{(runesMarket.confidence ?? '')} Confidence</span>
                    <p className="mt-2 text-white/90 text-sm">{(runesMarket.rationale ?? '')}</p>
                    <ul className="mt-2 space-y-1 text-white/90 text-xs">
                      {runesMarket.tradeOpportunities?.map((op, idx) => (
                        <li key={idx}><b>{op.signal}</b> {op.token} <span className="text-yellow-200">({op.confidence})</span>: {op.rationale}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col>
            <Card className="bg-gradient-to-br from-[#f43f5e] to-[#fbbf24] text-white border-none shadow-xl">
              <Title className="text-white">Market Variables</Title>
              <ul className="mt-4 space-y-2 text-white/90 text-sm">
                {marketVariables.map((v, i) => (
                  <li key={i} className={`font-bold text-${v.color}-400`}>{v.label}: <span className={`text-${v.color}-300`}>{(v.value ?? '')}</span></li>
                ))}
              </ul>
              <Text className="mt-4 text-xs text-white/70">Expanded market variables for deeper analysis and smarter decisions.</Text>
            </Card>
          </Col>
        </Grid>
      </div>

      <div className="container mx-auto py-12 px-4 flex flex-col items-center">
        <Title className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">Choose Your Premium Plan</Title>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center">
          {premiumPlans.map((plan, i) => (
            <div
              key={i}
              className={`flex-1 rounded-2xl p-8 shadow-2xl bg-gradient-to-br ${plan.color} ${plan.highlight ? 'scale-105 border-4 border-emerald-400' : ''} transition-all hover:scale-105 hover:shadow-[0_0_32px_rgba(139,92,246,0.5)]`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-extrabold mb-4">${plan.price}<span className="text-lg font-medium">/mo</span></div>
              <div className="text-md font-mono mb-2 text-emerald-100">{plan.btc} BTC</div>
              <ul className="mb-6 space-y-2">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-white"></span>{f}</li>
                ))}
              </ul>
              <a
                href={`bitcoin:bc1q3ghzvpp0l74q3ntu8actyt0qcvl2u273flg5rs?amount=${plan.btc}&label=Cypher%20${plan.name}%20Plan`}
          target="_blank"
          rel="noopener noreferrer"
                className="w-full block py-2 rounded-lg bg-white text-black font-bold text-center hover:bg-opacity-90 transition mt-2 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </a>
            </div>
          ))}
        </div>
    </div>
    </main>
  )
}
