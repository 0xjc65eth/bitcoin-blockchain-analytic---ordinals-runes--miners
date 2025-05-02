'use client'

import { Header } from './components/header'
import { EnhancedArbitrageCard } from './components/enhanced-arbitrage-card'
import { NeuralArbitrageInsights } from '@/components/neural-arbitrage-insights'
import { Grid, Col } from '@tremor/react'

export default function ArbitragePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 21L3 16.5M3 16.5L7.5 12M3 16.5H16.5M16.5 3L21 7.5M21 7.5L16.5 12M21 7.5H7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#10B981] text-transparent bg-clip-text text-center">
            ARBITRAGEM EM TEMPO REAL
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#10B981] rounded-full mb-4"></div>
          <h2 className="text-lg text-gray-300 max-w-2xl text-center">
            Oportunidades de arbitragem entre marketplaces com cálculos precisos de lucro e insights neurais avançados
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <Grid numItemsMd={1} numItemsLg={1} className="gap-6 mb-6">
            <Col>
              <EnhancedArbitrageCard />
            </Col>
          </Grid>

          <Grid numItemsMd={1} numItemsLg={1} className="gap-6 mb-6">
            <Col>
              <NeuralArbitrageInsights />
            </Col>
          </Grid>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Os dados são atualizados em tempo real a partir das APIs do CoinMarketCap, Ordiscan e outras fontes.
            As oportunidades de arbitragem são calculadas considerando as taxas dos marketplaces para mostrar o lucro líquido real.
            O sistema neural analisa continuamente padrões de mercado para identificar as melhores oportunidades.
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <a
              href="https://www.coinmarketcap.com/rankings/exchanges/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-all text-sm font-medium"
            >
              Ranking de Exchanges
            </a>
            <a
              href="https://www.coingecko.com/en/exchanges"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all text-sm font-medium"
            >
              Volumes de Trading
            </a>
            <a
              href="https://mempool.space/runes"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all text-sm font-medium"
            >
              Dados de Runas
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
