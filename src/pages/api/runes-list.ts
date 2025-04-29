import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://api.ordiscan.com/v1/runes?limit=100', {
      headers: {
        Authorization: 'Bearer e227a764-b31b-43cf-a60c-be5daa50cd2c'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data.data || []);
  } catch (error) {
    console.error('Error fetching runes list:', error);
    res.status(500).json({ error: 'Failed to fetch runes list' });
  }
}
