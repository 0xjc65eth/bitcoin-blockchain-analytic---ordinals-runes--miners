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

    // Enriquecer os dados com informações de mercado para os primeiros 10 runes
    const enrichedData = await Promise.all(
      (data.data || []).slice(0, 10).map(async (rune: any) => {
        try {
          const marketResponse = await fetch(`https://api.ordiscan.com/v1/rune/${rune.name}/market`, {
            headers: {
              Authorization: 'Bearer e227a764-b31b-43cf-a60c-be5daa50cd2c'
            }
          });

          if (marketResponse.ok) {
            const marketData = await marketResponse.json();
            return {
              ...rune,
              market: marketData.data || {}
            };
          }
          return rune;
        } catch (error) {
          console.error(`Error fetching market data for rune ${rune.name}:`, error);
          return rune;
        }
      })
    );

    res.status(200).json(enrichedData);
  } catch (error) {
    console.error('Error fetching runes data:', error);
    res.status(500).json({ error: 'Failed to fetch runes data' });
  }
}