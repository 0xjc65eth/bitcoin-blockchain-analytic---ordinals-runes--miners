import axios from 'axios'

declare global {
  interface Date {
    toRelativeTimeString(): string;
  }
}

// API Endpoints
const MEMPOOL_API = 'https://mempool.space/api'
const MAGIC_EDEN_API = 'https://api-mainnet.magiceden.dev/v2/ord'
const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const CRYPTOQUANT_API = process.env.CRYPTOQUANT_API_URL
const HIRO_API = 'https://api.hiro.so'
const ORDINALS_API = 'https://ordinals.com'

// Interfaces
export interface MinerData {
  id: string
  hashrate: number
  networkPercentage: number
  lastBlock: number
  decentralizationIndex?: number
}

export interface Transaction {
  txid: string
  fee: number
  size: number
  type: 'ordinal' | 'rune' | 'regular'
  value: number
  timestamp: string
  status: {
    confirmed: boolean
    block_height?: number
    block_hash?: string
    block_time?: number
  }
}

export interface Ordinal {
  id: string
  inscription: string
  content: string
  owner: string
  value: number
}

export interface Inscription {
  id: string
  number: number
  content: string
  contentType: string
  timestamp: string
  owner: string
  size: number
}

export interface Collection {
  id: string
  name: string
  description: string
  floorPrice: number
  volume24h: number
  totalSupply: number
  holders: number
  verified: boolean
  imageUrl: string
  bannerUrl?: string
  benefits?: string[]
  runeInfo?: RuneInfo
  trendingScore?: number
  sentiment?: 'positive' | 'neutral' | 'negative'
}

export interface RuneInfo {
  symbol: string
  supply: number
  holders: number
  price: number
  marketCap: number
  volume24h: number
  transactions24h: number
}

export interface MarketData {
  id: string
  name: string
  price: number
  change24h: number
  volume: number
  marketCap: number
  lastTrade: string
  highestSale: number
  totalVolume: number
  listedCount: number
  uniqueHolders: number
}

export interface WhaleAlert {
  id: string
  type: 'sale' | 'mint' | 'transfer' | 'hashrate_shift' | 'inscription_fee'
  collection?: string
  price?: number
  from: string
  to: string
  timestamp: string
  txHash: string
  details: string
}

export interface Signal {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  timestamp: string
  data: any
}

// API Functions
export const fetchMinerData = async (): Promise<MinerData[]> => {
  try {
    const response = await axios.get(`${MEMPOOL_API}/v1/mining/hashrate/1d`)
    return response.data.map((miner: any) => ({
      id: miner.pool,
      hashrate: miner.hashrate,
      networkPercentage: miner.share,
      lastBlock: miner.lastBlock,
      decentralizationIndex: calculateDecentralizationIndex(miner.share)
    }))
  } catch (error) {
    console.error('Error fetching miner data:', error)
    return []
  }
}

export const fetchRecentTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${MEMPOOL_API}/v1/mempool/recent`)
    const data = await response.json()
    return data.map((tx: any) => ({
      txid: tx.txid,
      fee: tx.fee,
      size: tx.size,
      weight: tx.weight,
      status: {
        confirmed: tx.status.confirmed,
        block_height: tx.status.block_height,
        block_hash: tx.status.block_hash,
        block_time: tx.status.block_time,
      },
    }))
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

export const fetchOrdinalsByAddress = async (address: string): Promise<Ordinal[]> => {
  try {
    const response = await fetch(`${ORDINALS_API}/inscriptions/address/${address}`)
    const data = await response.json()
    return data.map((ordinal: any) => ({
      id: ordinal.id,
      inscription: ordinal.inscription,
      content: ordinal.content,
      owner: ordinal.owner,
      value: ordinal.value,
    }))
  } catch (error) {
    console.error('Error fetching ordinals:', error)
    return []
  }
}

export const fetchLatestInscriptions = async (): Promise<Inscription[]> => {
  try {
    const response = await fetch(`${HIRO_API}/ordinals/v1/inscriptions?limit=20`)
    const data = await response.json()
    return data.results.map((inscription: any) => ({
      id: inscription.id,
      number: inscription.number,
      content: `${ORDINALS_API}/content/${inscription.id}`,
      contentType: inscription.content_type,
      timestamp: new Date(inscription.timestamp).toRelativeTimeString(),
      owner: inscription.address,
      size: inscription.content_length
    }))
  } catch (error) {
    console.error('Error fetching inscriptions:', error)
    return []
  }
}

export const fetchCollections = async (): Promise<Collection[]> => {
  try {
    const response = await axios.get(`${MAGIC_EDEN_API}/collections`)
    const collections = response.data

    // Add our special collections with benefits
    const specialCollections = [
      {
        name: 'SEIZE CTRL',
        benefits: ['Early Access to New Features', 'Exclusive Airdrops', 'Community Governance', 'Future Platform Benefits']
      },
      {
        name: 'ONCHAIN MONKEYS',
        benefits: ['Special Events Access', 'Trading Fee Discounts', 'Exclusive Merchandise', 'Future Gaming Integration']
      },
      {
        name: 'THE WIZARD OF LORD',
        benefits: ['Metaverse Access', 'Special Roles', 'Future Game Benefits', 'Exclusive Content Access']
      },
      {
        name: 'STACK SATS',
        benefits: ['Staking Rewards', 'Premium Analytics', 'Private Discord Access', 'Future Financial Products']
      },
      {
        name: 'BITCOIN PUPPETS',
        benefits: ['NFT Whitelist Spots', 'Community Events', 'Exclusive Content', 'Future Collaboration Rights']
      },
      {
        name: 'MULTIVERSO',
        benefits: ['Exclusive Community Access', 'Early Feature Testing', 'Special Governance Rights', 'Premium Support', 'Future Ecosystem Benefits']
      }
    ]

    return collections.map((collection: any) => {
      const specialCollection = specialCollections.find(sc => sc.name === collection.name)
      return {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        floorPrice: collection.floorPrice,
        volume24h: collection.volume24h,
        totalSupply: collection.supply,
        holders: collection.holders,
        verified: collection.verified,
        imageUrl: collection.image,
        bannerUrl: collection.banner,
        benefits: specialCollection?.benefits || [],
        runeInfo: collection.rune ? {
          symbol: collection.rune.symbol,
          supply: collection.rune.supply,
          holders: collection.rune.holders,
          price: collection.rune.price,
          marketCap: collection.rune.marketCap,
          volume24h: collection.rune.volume24h,
          transactions24h: collection.rune.transactions24h
        } : undefined,
        trendingScore: collection.trendingScore,
        sentiment: collection.sentiment
      }
    })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return []
  }
}

export const fetchCollectionFloorPrice = async (collectionId: string): Promise<number> => {
  try {
    const response = await axios.get(`/api/collections/${collectionId}/floor-price`)
    return response.data.floorPrice
  } catch (error) {
    console.error('Error fetching floor price:', error)
    return 0
  }
}

export const fetchTransactions = async (limit: number = 10) => {
  try {
    const response = await axios.get(`/api/transactions?limit=${limit}`)
    return response.data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

export const fetchWhaleAlerts = async (): Promise<WhaleAlert[]> => {
  try {
    const response = await axios.get(`${MAGIC_EDEN_API}/activities?limit=50&type=sale,mint,transfer&minValue=100`)
    return response.data.map((activity: any) => ({
      id: activity.id,
      type: activity.type,
      collection: activity.collection,
      price: activity.price,
      from: activity.from,
      to: activity.to,
      timestamp: new Date(activity.timestamp).toRelativeTimeString(),
      txHash: activity.txHash,
      details: generateAlertDetails(activity)
    }))
  } catch (error) {
    console.error('Error fetching whale alerts:', error)
    return []
  }
}

export const fetchMarketData = async (): Promise<MarketData[]> => {
  try {
    const [collectionsResponse, btcResponse] = await Promise.all([
      axios.get(`${MAGIC_EDEN_API}/collections/popular`),
      axios.get(`${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`)
    ])

    const collections = collectionsResponse.data
    const btcData = btcResponse.data.bitcoin

    return collections.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.floorPrice,
      change24h: item.priceChange24h,
      volume: item.volume24h,
      marketCap: item.marketCap,
      lastTrade: new Date(item.lastTradeTime).toRelativeTimeString(),
      highestSale: item.highestSale,
      totalVolume: item.totalVolume,
      listedCount: item.listedCount,
      uniqueHolders: item.uniqueHolders
    }))
  } catch (error) {
    console.error('Error fetching market data:', error)
    return []
  }
}

export const fetchBitcoinPrice = async (): Promise<number> => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    return response.data.bitcoin.usd
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error)
    return 0
  }
}

// Helper Functions
function calculateDecentralizationIndex(share: number): number {
  return Math.max(0, 100 - (share * 100))
}

function generateAlertDetails(activity: any): string {
  const amount = activity.price ? `${activity.price} BTC` : ''
  switch (activity.type) {
    case 'sale':
      return `Sale of ${activity.collection} for ${amount}`
    case 'mint':
      return `New mint in ${activity.collection}`
    case 'transfer':
      return `Transfer of ${activity.collection}`
    case 'hashrate_shift':
      return `Significant hashrate change: ${activity.details}`
    case 'inscription_fee':
      return `High inscription fee: ${amount}`
    default:
      return ''
  }
}

// Add a polyfill for toRelativeTimeString if it doesn't exist
if (!Date.prototype.toRelativeTimeString) {
  Date.prototype.toRelativeTimeString = function() {
    const now = new Date()
    const diffMs = now.getTime() - this.getTime()
    const diffSecs = Math.round(diffMs / 1000)
    const diffMins = Math.round(diffSecs / 60)
    const diffHours = Math.round(diffMins / 60)
    const diffDays = Math.round(diffHours / 24)

    if (diffSecs < 60) return `${diffSecs}s ago`
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }
} 