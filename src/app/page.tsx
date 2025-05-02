'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { NeuralInsightsCard } from '@/components/neural-insights-card'
import { SmcAnalysisCard } from '@/components/smc-analysis-card'
import { MarketInsightsCard } from '@/components/market-insights-card'
import { BitcoinPriceCard } from '@/components/bitcoin-price-card'
import { MempoolAnalysisCard } from '@/components/mempool-analysis-card'
import { NetworkHashRateCard } from '@/components/network-hash-rate-card'
import { RunesMarketCard } from '@/components/runes-market-card'
import { OrdinalsMarketCard } from '@/components/ordinals-market-card'
import { NeuralLearningStatusCard } from '@/components/neural-learning-status-card'
import { NeuralSmcCard } from '@/components/neural-smc-card'
import { NeuralArbitrageCard } from '@/components/neural-arbitrage-card'
import { NeuralOrdinalsRunesCard } from '@/components/neural-ordinals-runes-card'

import { EnhancedBitcoinEcosystemCard } from '@/components/enhanced-bitcoin-ecosystem-card'


import { DecisionVariablesCard } from '@/components/decision-variables-card'
import { InflowOutflowChartCard } from '@/components/inflow-outflow-chart-card'
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
import { useOrdinalsMarket } from '@/hooks/useOrdinalsMarket'
import { useRunesMarket } from '@/hooks/useRunesMarket'
import { useInflowOutflow } from '@/hooks/useInflowOutflow'
import { useDecisionVariables } from '@/hooks/useDecisionVariables'
import { useMarketAnalysis } from '@/hooks/useMarketAnalysis'
import { useNetworkHealth } from '@/hooks/useNetworkHealth'
import { RiArrowUpSLine, RiArrowDownSLine, RiRefreshLine } from 'react-icons/ri'

type DeltaType = 'increase' | 'decrease' | 'moderateIncrease' | 'moderateDecrease';

const timeframes = ['24H', '7D', '30D', '90D', 'ALL'];

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H')
  const [isLoaded, setIsLoaded] = useState(false)

  // Obter dados reais de mineração diretamente do hook
  const miningData = useMiningData();

  // Obter dados reais do Bitcoin diretamente do hook
  const marketData = useMarketData();

  // Obter dados reais do mempool diretamente do hook
  const mempoolData = useMempoolData();

  // Obter dados reais do mercado de Ordinals
  const { data: ordinalsMarketData, isLoading: isLoadingOrdinals } = useOrdinalsMarket();

  // Obter dados reais do mercado de Runes
  const { data: runesMarketData, isLoading: isLoadingRunes } = useRunesMarket();

  // Obter dados reais de inflow/outflow
  const { data: inflowOutflowData, isLoading: isLoadingInflowOutflow } = useInflowOutflow();

  // Obter dados reais de variáveis de decisão
  const { data: decisionVariablesData, isLoading: isLoadingDecisionVariables } = useDecisionVariables();

  // Obter dados reais de análise de mercado
  const { data: marketAnalysisData, isLoading: isLoadingMarketAnalysis } = useMarketAnalysis();

  // Obter dados reais de saúde da rede
  const { data: networkHealthData, isLoading: isLoadingNetworkHealth } = useNetworkHealth();

  const deltaType: DeltaType = (marketData?.btcChange24h ?? 0) >= 0 ? "increase" : "decrease";
  const DeltaIcon = (marketData?.btcChange24h ?? 0) >= 0 ? RiArrowUpSLine : RiArrowDownSLine;

  // Estado para controlar a animação de entrada (pré-carregado para evitar problemas)
  useEffect(() => {
    // Pequeno atraso para garantir que a animação seja suave
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] dashboard-theme">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className={`flex flex-col md:flex-row justify-between items-center mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">
              BITCOIN ANALYTICS DASHBOARD
            </h1>
            <h2 className="text-lg text-gray-300 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              Real-time Market Analysis & Insights
            </h2>
          </div>
          <div>
            <TabGroup>
              <TabList variant="solid" className="bg-[#1E293B] p-1 rounded-xl border border-indigo-500/20 shadow-lg">
                {timeframes.map((tf) => (
                  <Tab
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className="px-6 py-2 text-sm font-medium transition-all duration-200"
                  >
                    {tf}
                  </Tab>
                ))}
              </TabList>
            </TabGroup>
          </div>
        </div>

        <div className="bg-[#111936]/50 p-4 rounded-xl border border-indigo-500/20 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Market Overview</h3>
                <p className="text-xs text-gray-400">Real-time data from multiple sources</p>
              </div>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 text-xs font-bold text-indigo-400 flex items-center gap-1.5 mr-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                Live Data
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span>Updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Cards Row */}
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mb-6">
          <Col className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <BitcoinPriceCard />
          </Col>

          <Col className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <MempoolAnalysisCard />
          </Col>

          <Col className={`transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <NetworkHashRateCard />
          </Col>
        </Grid>

        {/* Main Dashboard Components */}
        <Grid numItems={1} numItemsSm={2} className="gap-6 mt-6">
          <Col className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <NeuralInsightsCard />
          </Col>
          <Col className={`transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <SmcAnalysisCard />
          </Col>



          <Col className={`transition-all duration-700 delay-650 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <InflowOutflowChartCard />
          </Col>
          <Col className={`transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <DecisionVariablesCard />
          </Col>
          <Col className={`transition-all duration-700 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <MarketInsightsCard />
          </Col>
          <Col className={`transition-all duration-700 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <EnhancedBitcoinEcosystemCard />
          </Col>
          <Col className={`transition-all duration-700 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <RunesMarketCard />
          </Col>
          <Col className={`transition-all duration-700 delay-1050 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <OrdinalsMarketCard />
          </Col>

          <Col className={`transition-all duration-700 delay-1100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card className="bg-gradient-to-br from-[#1A1A3A] to-[#2A2A5A] border border-blue-500/20 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <Title className="text-white font-bold">Market Trends</Title>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  Real-time Data
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/30 to-slate-700/20 rounded-xl p-4 border border-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-blue-300 font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Price Comparison
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-xs text-blue-300">BTC</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-xs text-amber-300">ORDI</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-xs text-emerald-300">RUNE</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-indigo-500/10 rounded-lg"></div>
                  <AreaChart
                    className="h-64"
                    data={[
                      { date: "Jan 22", BTC: 42000, ORDI: 80, RUNE: 20 },
                      { date: "Feb 22", BTC: 45000, ORDI: 100, RUNE: 30 },
                      { date: "Mar 22", BTC: 47000, ORDI: 120, RUNE: 40 },
                      { date: "Apr 22", BTC: 51000, ORDI: 150, RUNE: 60 },
                      { date: "May 22", BTC: 53000, ORDI: 200, RUNE: 80 },
                      { date: "Jun 22", BTC: 57000, ORDI: 220, RUNE: 100 },
                      { date: "Jul 22", BTC: 62000, ORDI: 250, RUNE: 120 },
                      { date: "Aug 22", BTC: 67000, ORDI: 280, RUNE: 140 },
                    ]}
                    index="date"
                    categories={["BTC", "ORDI", "RUNE"]}
                    colors={["blue", "amber", "emerald"]}
                    showLegend={false}
                    showAnimation={true}
                    showGridLines={false}
                    curveType="monotone"
                    valueFormatter={(number, info) =>
                      info?.category === 'BTC'
                        ? `$${Intl.NumberFormat('us').format(number).toString()}`
                        : `${Intl.NumberFormat('us').format(number).toString()}`
                    }
                    customTooltip={(props) => {
                      if (!props.payload || !props.payload.length) return null;

                      const date = props.payload[0].payload.date;
                      const btc = props.payload.find(p => p.name === 'BTC')?.value;
                      const ordi = props.payload.find(p => p.name === 'ORDI')?.value;
                      const rune = props.payload.find(p => p.name === 'RUNE')?.value;

                      return (
                        <div className="bg-slate-800 p-2 border border-slate-700 rounded-lg shadow-lg">
                          <div className="text-xs font-medium text-white mb-1">{date}</div>
                          {btc !== undefined && (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              <span className="text-blue-300">BTC:</span>
                              <span className="text-white">${Intl.NumberFormat('us').format(btc)}</span>
                            </div>
                          )}
                          {ordi !== undefined && (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              <span className="text-amber-300">ORDI:</span>
                              <span className="text-white">${Intl.NumberFormat('us').format(ordi)}</span>
                            </div>
                          )}
                          {rune !== undefined && (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span className="text-emerald-300">RUNE:</span>
                              <span className="text-white">${Intl.NumberFormat('us').format(rune)}</span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/30 text-xs text-gray-300 flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Data from multiple sources
                </span>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </Card>
          </Col>
        </Grid>

        <div className="mt-8 mb-4 bg-[#111936]/50 p-4 rounded-xl border border-indigo-500/20 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Data Disclaimer</h3>
                <p className="text-xs text-gray-400">All metrics and insights are updated continuously for the most accurate analysis.</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span>Bitcoin</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <span>Ordinals</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span>Runes</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <span>Neural Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
