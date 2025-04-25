import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ message: 'Address is required' });
  }

  try {
    // Simular dados de saldo
    const balance = {
      bitcoin: 0.5,
      ordinals: {
        'inscription1': {
          id: 'inscription1',
          name: 'Bitcoin Punk #123',
          collectionId: '1',
          collectionName: 'Bitcoin Punks',
          value: 0.3,
        },
        'inscription2': {
          id: 'inscription2',
          name: 'Ordinal Dragon #456',
          collectionId: '2',
          collectionName: 'Ordinal Dragons',
          value: 0.2,
        },
      },
      runes: {
        'rune1': {
          id: 'rune1',
          name: 'DOGE',
          amount: 1000,
          divisibility: 8,
        },
        'rune2': {
          id: 'rune2',
          name: 'PEPE',
          amount: 500,
          divisibility: 8,
        },
      },
    };

    return res.status(200).json(balance);
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 