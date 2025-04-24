import React, { useState, useEffect } from 'react';
import { Box, Text, Grid, GridItem, Heading, VStack, HStack, Skeleton, Alert, AlertIcon } from '@chakra-ui/react';
import { MarketAnalyticsClient } from '../lib/ai/sagemakerClient';

interface MarketOpportunity {
  id: string;
  name: string;
  floorPrice: number;
  forecast7d: number;
  forecast30d: number;
  risk: number;
  volume24h: number;
  tradeCount: number;
}

const marketAnalyticsClient = new MarketAnalyticsClient();

const MarketOpportunityScanner: React.FC = () => {
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanOpportunities = async () => {
      try {
        setLoading(true);
        // Simular alguns dados de ordinals para teste
        const sampleOrdinals = [
          {
            id: '1',
            name: 'Ordinal #1',
            floorPrice: 1000,
            collectionSymbol: 'ordinals'
          },
          {
            id: '2',
            name: 'Ordinal #2',
            floorPrice: 2000,
            collectionSymbol: 'ordinals'
          }
        ];

        const results = await marketAnalyticsClient.scanMarketOpportunities(sampleOrdinals);
        setOpportunities(results);
        setError(null);
      } catch (err) {
        setError('Erro ao escanear oportunidades de mercado');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    scanOpportunities();
  }, []);

  if (loading) {
    return <div>Carregando oportunidades de mercado...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Oportunidades de Mercado</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="border p-4 rounded-lg shadow">
            <h3 className="font-semibold">{opportunity.name}</h3>
            <p>Preço Atual: {opportunity.floorPrice} sats</p>
            <p>Previsão 7d: {opportunity.forecast7d.toFixed(2)} sats</p>
            <p>Previsão 30d: {opportunity.forecast30d.toFixed(2)} sats</p>
            <p>Volume 24h: {opportunity.volume24h} sats</p>
            <p>Trades: {opportunity.tradeCount}</p>
            <div className="mt-2">
              <span className="text-sm">Risco: </span>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    opportunity.risk < 0.5 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${opportunity.risk * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOpportunityScanner; 