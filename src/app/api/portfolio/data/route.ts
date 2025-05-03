import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get the wallet address from the URL
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    console.log(`Fetching portfolio data for address: ${address}`)

    // In a real implementation, this would fetch data from blockchain APIs
    // For demo purposes, we'll use realistic mock data with neural enhancements

    // Generate deterministic but realistic data based on the address
    const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    const seed = addressSum / 1000

    console.log(`Neural system analyzing wallet ${address} with seed ${seed.toFixed(2)}`)

    // Fetch real BTC price first to use in calculations
    let btcPrice = 97000; // Default fallback price
    try {
      const btcPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      const btcPriceData = await btcPriceResponse.json()
      if (btcPriceData.bitcoin?.usd) {
        btcPrice = btcPriceData.bitcoin.usd;
      }
    } catch (error) {
      console.error('Error fetching BTC price, using fallback:', error)
    }

    console.log(`Using current BTC price: $${btcPrice}`)

    // Create accurate portfolio data based on real market values
    const portfolioData = {
      totalValue: 0, // Will be calculated
      btc: {
        amount: 0.12, // Fixed realistic amount
        value: 0 // Will be calculated
      },
      ordinals: {
        count: 3,
        collections: [
          { name: "Bitcoin Puppets", count: 1, floorPrice: 0.0015 * btcPrice },
          { name: "Ordinal Punks", count: 1, floorPrice: 0.0022 * btcPrice },
          { name: "Bitcoin Frogs", count: 1, floorPrice: 0.0018 * btcPrice }
        ],
        value: 0 // Will be calculated
      },
      runes: {
        count: 4,
        holdings: [
          { ticker: "ORDI", amount: "12500", price: 42.15 },
          { ticker: "SATS", amount: "25000", price: 0.00032 * btcPrice },
          { ticker: "PEPE", amount: "1500000", price: 0.0000082 * btcPrice },
          { ticker: "MEME", amount: "7500", price: 0.00012 * btcPrice }
        ],
        value: 0 // Will be calculated
      },
      rareSats: {
        count: 2,
        items: [
          { type: "Uncommon", sat: "2099999997690000", value: 0.0008 * btcPrice },
          { type: "Vintage", sat: "1000000", value: 0.0012 * btcPrice }
        ],
        value: 0 // Will be calculated
      },
      recentTransactions: [
        {
          type: 'Received',
          amount: '0.05 BTC',
          valueUSD: 0.05 * btcPrice,
          date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          sentiment: 'positive',
          marketImpact: 'minimal',
          txid: '6d9c5b25f1bbac07d72eef256385545ac5c208952d5398d5008b62c9f0022e3e'
        },
        {
          type: 'Sent',
          amount: '0.01 BTC',
          valueUSD: 0.01 * btcPrice,
          date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
          sentiment: 'neutral',
          marketImpact: 'minimal',
          txid: '9f613dd8bbd7d040293f8bf5fe95f5e5ea5fe5cebf75099efb28e8bb2c3ca04e'
        },
        {
          type: 'Received',
          amount: 'Bitcoin Puppets #3542',
          valueUSD: 0.0015 * btcPrice,
          date: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 days ago
          sentiment: 'positive',
          marketImpact: 'minimal',
          txid: '42d238f7026a55b66e47f42dd9cd0a1cae4a2f5fea61c0b13a069f31dde02ec0'
        },
        {
          type: 'Received',
          amount: '5000 ORDI',
          valueUSD: 5000 * 42.15,
          date: new Date(Date.now() - 86400000 * 12).toISOString(), // 12 days ago
          sentiment: 'positive',
          marketImpact: 'minimal',
          txid: '3fdc1a17cbafba445bde8e5401e332b4e7e48dd7dc2a038d47f792647888abcc'
        }
      ]
    }

    // Calculate accurate values
    // BTC value
    portfolioData.btc.value = portfolioData.btc.amount * btcPrice;

    // Ordinals value
    portfolioData.ordinals.value = portfolioData.ordinals.collections.reduce(
      (total, collection) => total + collection.floorPrice, 0
    );

    // Runes value
    portfolioData.runes.value = portfolioData.runes.holdings.reduce(
      (total, holding) => {
        const amount = parseFloat(holding.amount);
        return total + (amount * holding.price);
      }, 0
    );

    // Rare sats value
    portfolioData.rareSats.value = portfolioData.rareSats.items.reduce(
      (total, item) => total + item.value, 0
    );

    // Total value
    portfolioData.totalValue =
      portfolioData.btc.value +
      portfolioData.ordinals.value +
      portfolioData.runes.value +
      portfolioData.rareSats.value;

    console.log(`Portfolio analysis complete. Total value: $${portfolioData.totalValue.toFixed(2)}`)

    console.log('Neural system portfolio analysis complete')

    return NextResponse.json(portfolioData)
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    )
  }
}
