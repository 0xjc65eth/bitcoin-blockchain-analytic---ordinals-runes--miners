'use client'

import { Header } from './components/header'
import { Navbar } from './components/navbar'
import { EnhancedMiningCard } from './components/enhanced-mining-card'
import { Grid, Col } from '@tremor/react'

export default function MinersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#F7931A] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-[#F7931A]/20">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#F7931A] via-[#F9A826] to-[#F7931A] text-transparent bg-clip-text text-center">
            BITCOIN MINERS & NETWORK HEALTH
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#F7931A] via-[#F9A826] to-[#F7931A] rounded-full mb-4"></div>
          <h2 className="text-lg text-gray-300 max-w-2xl text-center">
            Real-time analysis of Bitcoin mining, network decentralization, and mining pool statistics
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <EnhancedMiningCard />
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Data is updated in real-time from the mempool.space API.
            Support Bitcoin network decentralization by mining with smaller pools or setting up your own node.
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <a
              href="https://mempool.space/mining"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#F7931A]/20 text-[#F7931A] rounded-lg border border-[#F7931A]/30 hover:bg-[#F7931A]/30 transition-all text-sm font-medium"
            >
              Mining Statistics
            </a>
            <a
              href="https://braiins.com/pool"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all text-sm font-medium"
            >
              Decentralized Pools
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}