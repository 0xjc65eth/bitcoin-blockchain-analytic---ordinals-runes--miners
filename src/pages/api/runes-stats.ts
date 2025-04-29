import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Buscar os runes mais recentes
    const runesResponse = await fetch('https://api.ordiscan.com/v1/runes', {
      headers: {
        Authorization: 'Bearer e227a764-b31b-43cf-a60c-be5daa50cd2c'
      }
    });
    
    if (!runesResponse.ok) {
      throw new Error(`API error: ${runesResponse.status}`);
    }
    
    const runesData = await runesResponse.json();
    
    // Buscar informações de mercado para os runes mais populares
    const popularRunes = (runesData.data || []).slice(0, 5);
    const runesWithMarket = await Promise.all(
      popularRunes.map(async (rune: any) => {
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
    
    // Calcular estatísticas
    const totalRunes = runesData.data?.length || 0;
    
    // Dados simulados para estatísticas que não estão diretamente disponíveis na API
    const volume24h = Math.floor(Math.random() * 300) + 50; // Valor simulado entre 50 e 350
    const marketCap = Math.floor(Math.random() * 1000000) + 100000; // Valor simulado
    
    const stats = {
      total_runes: totalRunes,
      volume_24h: volume24h,
      market_cap: marketCap,
      popular_runes: runesWithMarket
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching runes stats:', error);
    res.status(500).json({ error: 'Failed to fetch runes stats' });
  }
}
