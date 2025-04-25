import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { mempoolCache } from '../../lib/cache';

const mempoolSchema = z.object({
  size: z.number(),
  count: z.number(),
  feeRate: z.number(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check cache first
    const cachedData = mempoolCache.get('mempoolData');
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Simular dados do mempool
    const mempoolData = {
      size: 15.2,
      count: 2500,
      feeRate: 25,
    };

    // Validate the data
    const validatedData = mempoolSchema.parse(mempoolData);

    // Cache the data
    mempoolCache.set('mempoolData', validatedData);

    return res.status(200).json(validatedData);
  } catch (error) {
    console.error('Error fetching mempool data:', error);
    return res.status(500).json({ error: 'Failed to fetch mempool data' });
  }
} 