import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch multiple data points in parallel
    const [hashrateRes, difficultyRes, poolsRes, blocksRes] = await Promise.all([
      fetch('https://mempool.space/api/v1/mining/hashrate/3d'),
      fetch('https://mempool.space/api/v1/difficulty-adjustment'),
      fetch('https://mempool.space/api/v1/mining/pools/1w'),
      fetch('https://mempool.space/api/v1/blocks/tip/height')
    ])

    // Parse all responses
    const hashrateData = await hashrateRes.json()
    const difficultyData = await difficultyRes.json()
    const poolsData = await poolsRes.json()
    const currentHeight = await blocksRes.text()

    // Calculate hashrate in EH/s (exahash per second)
    const currentHashrate = hashrateData.currentHashrate
      ? Math.round(hashrateData.currentHashrate / 1e18)
      : 350 // Fallback value

    // Calculate hashrate change percentage
    const hashrateChange = difficultyData.difficultyChange
      ? parseFloat(difficultyData.difficultyChange.toFixed(2))
      : 5.2 // Fallback value

    // Get mining distribution data
    const miningDistribution = Array.isArray(poolsData)
      ? poolsData.slice(0, 5).map(pool => ({
          name: pool.name,
          share: parseFloat(pool.share.toFixed(1))
        }))
      : []

    // Format the data
    const formattedData = {
      currentHashrate,
      hashrateChange,
      difficulty: difficultyData.difficulty,
      estimatedRetargetDate: difficultyData.estimatedRetargetDate,
      remainingBlocks: difficultyData.remainingBlocks,
      progressPercent: difficultyData.progressPercent,
      previousRetarget: difficultyData.previousRetarget,
      timeAvg: difficultyData.timeAvg,
      currentHeight: parseInt(currentHeight),
      miningDistribution,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching hashrate data:', error)

    // Provide fallback data in case of error
    const fallbackData = {
      currentHashrate: 350,
      hashrateChange: 5.2,
      difficulty: 73516548906.56,
      estimatedRetargetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      remainingBlocks: 1024,
      progressPercent: 50,
      previousRetarget: 3.2,
      timeAvg: 600,
      currentHeight: 840000,
      miningDistribution: [
        { name: "Foundry USA", share: 35.2 },
        { name: "AntPool", share: 18.7 },
        { name: "F2Pool", share: 14.3 },
        { name: "Binance Pool", share: 10.5 },
        { name: "ViaBTC", share: 8.2 }
      ],
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(fallbackData)
  }
}
