import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check cache first
    const cachedData = cache.get('privilegedCollections');
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Simulate privileged collections data
    const collections = [
      {
        id: '1',
        name: 'Bitcoin Punks',
        floorPrice: 0.5,
        volume: 10.2,
      },
      {
        id: '2',
        name: 'Ordinal Dragons',
        floorPrice: 0.3,
        volume: 5.7,
      },
      {
        id: '3',
        name: 'Crypto Kitties',
        floorPrice: 0.2,
        volume: 3.1,
      },
      {
        id: '4',
        name: 'Digital Art',
        floorPrice: 0.4,
        volume: 7.8,
      },
      {
        id: '5',
        name: 'NFT Stars',
        floorPrice: 0.6,
        volume: 12.5,
      },
    ];

    // Cache the data
    cache.set('privilegedCollections', collections);

    return res.status(200).json(collections);
  } catch (error) {
    console.error('Error fetching collections data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 