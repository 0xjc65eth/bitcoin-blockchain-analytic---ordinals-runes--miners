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
    // Simular histórico de transações
    const transactions = [
      {
        id: 'tx1',
        type: 'bitcoin',
        amount: 0.1,
        fee: 0.0001,
        timestamp: Date.now() - 3600000, // 1 hora atrás
        status: 'confirmed',
        details: {},
      },
      {
        id: 'tx2',
        type: 'ordinal',
        amount: 0,
        fee: 0.0001,
        timestamp: Date.now() - 7200000, // 2 horas atrás
        status: 'confirmed',
        details: {
          inscriptionId: 'inscription1',
          collectionId: '1',
          collectionName: 'Bitcoin Punks',
        },
      },
      {
        id: 'tx3',
        type: 'rune',
        amount: 100,
        fee: 0.0001,
        timestamp: Date.now() - 10800000, // 3 horas atrás
        status: 'confirmed',
        details: {
          runeId: 'rune1',
        },
      },
    ];

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 