import type { NextApiRequest, NextApiResponse } from 'next';
import { signalsCache } from '../../lib/cache';

type WhaleData = {
  transactionAmount: number;
  collectionPurchases: number;
  timeSinceLastActivity: number;
  description: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WhaleData>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    // Check cache first
    const cachedData = signalsCache.get('whaleData');
    if (cachedData) {
      return res.status(200).json(cachedData as WhaleData);
    }

    // Simular dados de atividade de baleias
    const whaleData: WhaleData = {
      transactionAmount: 25.5,
      collectionPurchases: 3,
      timeSinceLastActivity: 1800000, // 30 minutos atrás
      description: 'Whale activity detected: 3 large transactions totaling 25.5 BTC',
    };

    // Cache the data
    signalsCache.set('whaleData', whaleData);

    return res.status(200).json(whaleData);
  } catch (error) {
    console.error('Error fetching whale data:', error);
    return res.status(500).end();
  }
} 