import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Fetching Runes list...')
    
    // In a real implementation, we would fetch from a Runes API
    // For now, we'll return realistic mock data
    
    const formattedData = [
      {
        name: 'ORDI',
        formatted_name: 'ORDI',
        volume_24h: 280,
        market: {
          price_in_btc: 0.000085
        },
        unique_holders: 2800
      },
      {
        name: 'SATS',
        formatted_name: 'SATS',
        volume_24h: 210,
        market: {
          price_in_btc: 0.000065
        },
        unique_holders: 2100
      },
      {
        name: 'PEPE',
        formatted_name: 'PEPE',
        volume_24h: 180,
        market: {
          price_in_btc: 0.000045
        },
        unique_holders: 1800
      },
      {
        name: 'MEME',
        formatted_name: 'MEME',
        volume_24h: 150,
        market: {
          price_in_btc: 0.000035
        },
        unique_holders: 1500
      },
      {
        name: 'DOGE',
        formatted_name: 'DOGE',
        volume_24h: 120,
        market: {
          price_in_btc: 0.000025
        },
        unique_holders: 1200
      }
    ]
    
    console.log('Runes list:', formattedData.slice(0, 3))
    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching Runes list:', error)
    
    // Return fallback data
    const fallbackData = [
      {
        name: 'ORDI',
        formatted_name: 'ORDI',
        volume_24h: 280,
        market: {
          price_in_btc: 0.000085
        },
        unique_holders: 2800
      },
      {
        name: 'SATS',
        formatted_name: 'SATS',
        volume_24h: 210,
        market: {
          price_in_btc: 0.000065
        },
        unique_holders: 2100
      },
      {
        name: 'PEPE',
        formatted_name: 'PEPE',
        volume_24h: 180,
        market: {
          price_in_btc: 0.000045
        },
        unique_holders: 1800
      },
      {
        name: 'MEME',
        formatted_name: 'MEME',
        volume_24h: 150,
        market: {
          price_in_btc: 0.000035
        },
        unique_holders: 1500
      },
      {
        name: 'DOGE',
        formatted_name: 'DOGE',
        volume_24h: 120,
        market: {
          price_in_btc: 0.000025
        },
        unique_holders: 1200
      }
    ]
    
    return NextResponse.json(fallbackData)
  }
}
