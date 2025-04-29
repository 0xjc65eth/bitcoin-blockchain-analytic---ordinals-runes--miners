// Função para buscar dados da API do Ordiscan
export async function fetchOrdiscanData(endpoint: string) {
  try {
    // API key fixa para garantir que sempre usaremos a chave correta
    const apiKey = 'e227a764-b31b-43cf-a60c-be5daa50cd2c';

    const response = await fetch(`https://api.ordiscan.com${endpoint}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return getMockData(endpoint);
    }

    const data = await response.json();
    return data.data || data; // A API retorna os dados dentro de um objeto 'data'
  } catch (error) {
    console.error('Error fetching data from Ordiscan API:', error);
    return getMockData(endpoint);
  }
}

// Função para retornar dados simulados quando a API não estiver disponível
function getMockData(endpoint: string) {
  // Dados simulados para diferentes endpoints
  const mockData: Record<string, any> = {
    '/price': {
      price: 58000,
      change_24h: 2.5,
    },
    '/mempool': {
      pending_transactions: 25000,
      average_fee_rate: 45,
    },
    '/mining': {
      hash_rate: 350,
      difficulty: 72000000000000,
      block_time: 9.8,
    },
    '/ordinals': {
      total_inscriptions: 1500000,
      volume_24h: 150,
      floor_price: 0.05,
      popular_collections: [
        { name: 'Collection 1', volume: 50 },
        { name: 'Collection 2', volume: 30 },
        { name: 'Collection 3', volume: 20 },
      ],
    },
    '/runes': {
      volume_24h: 75,
      active_runes: [
        { name: 'Rune 1', volume: 30 },
        { name: 'Rune 2', volume: 25 },
        { name: 'Rune 3', volume: 20 },
      ],
    },
    '/v1/collections': [
      { name: 'Bitcoin Frogs', slug: 'bitcoin-frogs', item_count: 10000 },
      { name: 'Ordinal Punks', slug: 'ordinal-punks', item_count: 100 },
      { name: 'Taproot Wizards', slug: 'taproot-wizards', item_count: 2121 },
    ],
    '/v1/inscriptions': [
      {
        inscription_id: 'abc123i0',
        inscription_number: 1,
        content_type: 'image/png',
        owner_address: 'bc1abc...',
        timestamp: '2023-01-01T00:00:00Z',
      },
      {
        inscription_id: 'def456i0',
        inscription_number: 2,
        content_type: 'image/png',
        owner_address: 'bc1def...',
        timestamp: '2023-01-02T00:00:00Z',
      },
    ],
    '/v1/runes': [
      { name: 'DOGGOTOTHEMOON', formatted_name: 'DOGGO•TO•THE•MOON', number: 1 },
      { name: 'UNCOMMONGOODS', formatted_name: 'UNCOMMON•GOODS', number: 0 },
    ],
    '/v1/rune/DOGGOTOTHEMOON/market': {
      price_in_sats: 4.15,
      price_in_usd: 0.002529,
      market_cap_in_btc: 4150,
      market_cap_in_usd: 252851200
    },
  };

  // Para endpoints dinâmicos como /v1/rune/{name}
  if (endpoint.startsWith('/v1/rune/') && endpoint.indexOf('/market') === -1) {
    return {
      name: endpoint.split('/')[3],
      formatted_name: endpoint.split('/')[3],
      number: 123,
      current_supply: '1000000',
      current_mint_count: 500
    };
  }

  return mockData[endpoint] || {};
}