import { NextApiRequest, NextApiResponse } from 'next';

// List of addresses that own privileged collections
const privilegedAddresses = [
  'bc1q3ghzvpp0l74q3ntu8actyt0qcvl2u273flg5rs', // Demo address
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Example address
  'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', // Example address
];

// Collections that have premium access
const privilegedCollections = [
  'OCM Katoshi Prime',
  'OCM Katoshi Classic',
  'OCM Genesis',
  'Seize Ctrl',
  'The Wizard of Lord',
  'Bitcoin Puppets',
  'Multiverso Pass',
  'Stack Sats',
];

type PremiumResponse = {
  isPremium: boolean;
  details?: {
    collections: string[];
    reason: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PremiumResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    // In a real application, we would query an indexer or blockchain API
    // to check if the address owns any of the privileged collections
    
    // For demo purposes, we'll use our predefined list
    const isPremium = privilegedAddresses.includes(address);
    
    // Get collections owned by this address (mocked for demo)
    const ownedCollections = isPremium 
      ? [privilegedCollections[0], privilegedCollections[3]] // Show they own two collections
      : [];
    
    return res.status(200).json({
      isPremium,
      details: isPremium 
        ? {
            collections: ownedCollections,
            reason: 'Address owns tokens from premium collections'
          }
        : undefined
    });
  } catch (error) {
    console.error('Error checking premium status:', error);
    return res.status(500).json({ error: 'Failed to check premium status' });
  }
} 