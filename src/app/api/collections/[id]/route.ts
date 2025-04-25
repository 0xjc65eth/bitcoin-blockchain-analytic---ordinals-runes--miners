import { NextResponse } from 'next/server'

const collections = [
  {
    id: '1',
    name: 'SEIZE CTRL',
    description: 'A community-driven collection with exclusive benefits',
    floorPrice: 0.89,
    volume24h: 150.75,
    totalSupply: 10000,
    holders: 6000,
    verified: true,
    imageUrl: '/collections/seize-ctrl.jpg',
    benefits: ['Early Access to New Features', 'Exclusive Airdrops', 'Community Governance', 'Future Platform Benefits']
  },
  {
    id: '2',
    name: 'ONCHAIN MONKEYS',
    description: 'Digital art meets blockchain technology',
    floorPrice: 1.2,
    volume24h: 200.45,
    totalSupply: 10000,
    holders: 3500,
    verified: true,
    imageUrl: '/collections/onchain-monkeys.jpg',
    benefits: ['Special Events Access', 'Trading Fee Discounts', 'Exclusive Merchandise', 'Future Gaming Integration']
  },
  {
    id: '3',
    name: 'THE WIZARD OF LORD',
    description: 'Magical NFT collection with unique utilities',
    floorPrice: 1.5,
    volume24h: 180.30,
    totalSupply: 10000,
    holders: 4200,
    verified: true,
    imageUrl: '/collections/wizard-lord.jpg',
    benefits: ['Metaverse Access', 'Special Roles', 'Future Game Benefits', 'Exclusive Content Access']
  },
  {
    id: '4',
    name: 'STACK SATS',
    description: 'Bitcoin-focused NFT collection',
    floorPrice: 0.75,
    volume24h: 120.15,
    totalSupply: 10000,
    holders: 5500,
    verified: true,
    imageUrl: '/collections/stack-sats.jpg',
    benefits: ['Staking Rewards', 'Premium Analytics', 'Private Discord Access', 'Future Financial Products']
  },
  {
    id: '5',
    name: 'BITCOIN PUPPETS',
    description: 'Playful NFT collection with community focus',
    floorPrice: 0.95,
    volume24h: 160.25,
    totalSupply: 10000,
    holders: 4800,
    verified: true,
    imageUrl: '/collections/bitcoin-puppets.jpg',
    benefits: ['NFT Whitelist Spots', 'Community Events', 'Exclusive Content', 'Future Collaboration Rights']
  },
  {
    id: '6',
    name: 'MULTIVERSO',
    description: 'Next-generation multiverse NFT collection',
    floorPrice: 1.8,
    volume24h: 250.60,
    totalSupply: 10000,
    holders: 3800,
    verified: true,
    imageUrl: '/collections/multiverso.jpg',
    benefits: ['Exclusive Community Access', 'Early Feature Testing', 'Special Governance Rights', 'Premium Support', 'Future Ecosystem Benefits']
  }
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const collection = collections.find(c => c.id === params.id)
    
    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Error in collection API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 