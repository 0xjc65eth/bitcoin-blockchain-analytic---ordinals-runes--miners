import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Buscar as inscrições mais recentes para obter estatísticas
    const inscriptionsResponse = await fetch('https://api.ordiscan.com/v1/inscriptions?sort=inscription_number_desc&limit=1', {
      headers: {
        Authorization: 'Bearer e227a764-b31b-43cf-a60c-be5daa50cd2c'
      }
    });
    
    if (!inscriptionsResponse.ok) {
      throw new Error(`API error: ${inscriptionsResponse.status}`);
    }
    
    const inscriptionsData = await inscriptionsResponse.json();
    
    // Buscar as coleções para obter estatísticas
    const collectionsResponse = await fetch('https://api.ordiscan.com/v1/collections', {
      headers: {
        Authorization: 'Bearer e227a764-b31b-43cf-a60c-be5daa50cd2c'
      }
    });
    
    if (!collectionsResponse.ok) {
      throw new Error(`API error: ${collectionsResponse.status}`);
    }
    
    const collectionsData = await collectionsResponse.json();
    
    // Calcular estatísticas
    const latestInscription = inscriptionsData.data?.[0] || {};
    const totalInscriptions = latestInscription.inscription_number || 0;
    const totalCollections = collectionsData.data?.length || 0;
    
    // Dados simulados para estatísticas que não estão diretamente disponíveis na API
    const volume24h = Math.floor(Math.random() * 500) + 100; // Valor simulado entre 100 e 600
    const floorPrice = (Math.random() * 0.1).toFixed(4); // Valor simulado entre 0 e 0.1
    
    const stats = {
      total_inscriptions: totalInscriptions,
      total_collections: totalCollections,
      volume_24h: volume24h,
      floor_price: parseFloat(floorPrice),
      latest_inscription: latestInscription,
      popular_collections: collectionsData.data?.slice(0, 5) || []
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching ordinals stats:', error);
    res.status(500).json({ error: 'Failed to fetch ordinals stats' });
  }
}
