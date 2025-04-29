import { NextResponse } from 'next/server'
import type { MempoolState } from '@/types/store'

export async function GET() {
  try {
    // Fetch mempool statistics
    const mempoolStatsRes = await fetch('https://mempool.space/api/mempool')
    const mempoolStats = await mempoolStatsRes.json()
    
    // Fetch recommended fee rates
    const feeRatesRes = await fetch('https://mempool.space/api/v1/fees/recommended')
    const feeRates = await feeRatesRes.json()
    
    // Fetch recent blocks
    const blocksRes = await fetch('https://mempool.space/api/blocks/tip/height')
    const currentHeight = await blocksRes.text()
    
    // Fetch recent transactions (just the count for now)
    const recentTxsRes = await fetch('https://mempool.space/api/mempool/recent')
    const recentTxs = await recentTxsRes.json()

    // Format the data according to our application's state structure
    const mempoolData: MempoolState = {
      pendingTransactions: mempoolStats.count || 0,
      averageFeeRate: Math.round(feeRates.hourFee || 0),
      mempoolSize: Math.round(mempoolStats.vsize / 1000) || 0, // Convert to KB
      lastUpdated: new Date().toISOString(),
      transactions: recentTxs.slice(0, 10) || [], // Just keep the 10 most recent transactions
      feeRates: {
        low: feeRates.economyFee || 1,
        medium: feeRates.hourFee || 5,
        high: feeRates.fastestFee || 10
      },
      blocks: [
        {
          height: parseInt(currentHeight) || 0,
          hash: '',
          timestamp: Date.now(),
          size: 0,
          weight: 0
        }
      ]
    }

    return NextResponse.json(mempoolData)
  } catch (error) {
    console.error('Error fetching mempool data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mempool data' },
      { status: 500 }
    )
  }
}
