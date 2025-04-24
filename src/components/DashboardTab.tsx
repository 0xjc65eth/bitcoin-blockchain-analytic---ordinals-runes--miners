import React, { useState, useEffect } from 'react';
import { Box, Text, Spinner, Alert, AlertIcon, Grid, VStack, Stat, StatLabel, StatNumber, Progress } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Debug environment variables
console.log('DashboardTab Environment Variables:', {
  url: process.env.NEXT_PUBLIC_ORDISCAN_API_URL,
  key: process.env.NEXT_PUBLIC_ORDISCAN_API_KEY ? '***' : 'missing',
});

// Interface for market opportunities
interface MarketOpportunity {
  id: string;
  name: string;
  floorPrice: number;
  volume: number;
  forecast7d: number;
  forecast30d: number;
  risk: number;
}

const DashboardTab: React.FC = () => {
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const [networkHealth, setNetworkHealth] = useState<{ mempoolSize: number; transactionRate: number }>({ mempoolSize: 0, transactionRate: 0 });
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Check environment variables
      const apiUrl = process.env.NEXT_PUBLIC_ORDISCAN_API_URL;
      const apiKey = process.env.NEXT_PUBLIC_ORDISCAN_API_KEY;

      if (!apiUrl || !apiKey) {
        console.error('Missing environment variables:', { apiUrl, apiKey: apiKey ? '***' : 'missing' });
        setError('API configuration is missing');
        setLoading(false);
        return;
      }

      // Set mock data for BTC price and network health
      setBtcPrice(65000);
      setNetworkHealth({ mempoolSize: 15000, transactionRate: 5 });

      try {
        console.log('Making request to Ordiscan API:', `${apiUrl}/collections`);
        const response = await fetch(`${apiUrl}/collections`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        console.log('Response status:', response.status);

        if (response.status === 429) {
          console.warn('Rate limit exceeded for Ordiscan API, using mock data');
          throw new Error('Rate limit exceeded');
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Ordiscan API Response for Dashboard:', data);

        const dataArray = Array.isArray(data) ? data : [];
        const mockOpportunities: MarketOpportunity[] = dataArray.slice(0, 2).map((col: any, index: number) => ({
          id: col.id || `mock-${index}`,
          name: col.name || `Ordinal #${index + 1}`,
          floorPrice: col.floorPrice || 1000 * (index + 1),
          volume: col.volume || 0,
          forecast7d: (col.floorPrice || 1000 * (index + 1)) * 1.1,
          forecast30d: (col.floorPrice || 1000 * (index + 1)) * 1.3,
          risk: index === 0 ? 0.8 : 0.6,
        }));

        setOpportunities(mockOpportunities.length > 0 ? mockOpportunities : [
          { id: '1', name: 'Ordinal #1', floorPrice: 1000, volume: 0, forecast7d: 1100, forecast30d: 1300, risk: 0.8 },
          { id: '2', name: 'Ordinal #2', floorPrice: 2000, volume: 0, forecast7d: 2200, forecast30d: 2600, risk: 0.6 },
        ]);
      } catch (error: any) {
        console.error('Failed to fetch opportunities:', error.message, error.stack);
        setError(error.message || 'Failed to fetch data from Ordiscan API');
        setOpportunities([
          { id: '1', name: 'Ordinal #1', floorPrice: 1000, volume: 0, forecast7d: 1100, forecast30d: 1300, risk: 0.8 },
          { id: '2', name: 'Ordinal #2', floorPrice: 2000, volume: 0, forecast7d: 2200, forecast30d: 2600, risk: 0.6 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box p={4} bg="#1A1A1A" color="white" minH="100vh">
      <Text fontSize="xl" fontFamily="Inter" mb={4}>Dashboard</Text>
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <Spinner size="xl" color="#00A3FF" />
        </Box>
      )}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <VStack spacing={4} align="stretch">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Box bg="#2D2D2D" p={4} border="1px solid white" borderRadius="md" _hover={{ borderColor: '#00A3FF', transform: 'scale(1.02)', transition: 'all 0.2s' }}>
            <Stat>
              <StatLabel fontFamily="Inter">BTC Price</StatLabel>
              <StatNumber fontFamily="Roboto Mono">${btcPrice.toFixed(2)}</StatNumber>
            </Stat>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Box bg="#2D2D2D" p={4} border="1px solid white" borderRadius="md" _hover={{ borderColor: '#00A3FF', transform: 'scale(1.02)', transition: 'all 0.2s' }}>
            <Text fontSize="lg" fontFamily="Inter">Network Health</Text>
            <Text fontFamily="Roboto Mono">Mempool Size: {networkHealth.mempoolSize}</Text>
            <Text fontFamily="Roboto Mono">Transaction Rate: {networkHealth.transactionRate}/s</Text>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Box>
            <Text fontSize="lg" fontFamily="Inter" mb={4}>Market Opportunities</Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              {Array.isArray(opportunities) ? (
                opportunities.map((opp: MarketOpportunity) => (
                  <Box
                    key={opp.id}
                    bg="#2D2D2D"
                    p={4}
                    border="1px solid white"
                    borderRadius="md"
                    _hover={{ borderColor: '#00A3FF', transform: 'scale(1.02)', transition: 'all 0.2s' }}
                  >
                    <Text fontSize="lg" fontFamily="Inter">{opp.name}</Text>
                    <Stat>
                      <StatLabel fontFamily="Roboto Mono">Floor Price</StatLabel>
                      <StatNumber fontFamily="Roboto Mono">{opp.floorPrice} sats</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel fontFamily="Roboto Mono">7d Forecast</StatLabel>
                      <StatNumber fontFamily="Roboto Mono">{opp.forecast7d.toFixed(2)} sats</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel fontFamily="Roboto Mono">30d Forecast</StatLabel>
                      <StatNumber fontFamily="Roboto Mono">{opp.forecast30d.toFixed(2)} sats</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel fontFamily="Roboto Mono">Volume 24h</StatLabel>
                      <StatNumber fontFamily="Roboto Mono">{opp.volume} sats</StatNumber>
                    </Stat>
                    <Text fontFamily="Roboto Mono" mt={2}>Risk:</Text>
                    <Progress value={opp.risk * 100} colorScheme={opp.risk > 0.7 ? 'red' : 'green'} />
                  </Box>
                ))
              ) : (
                <Text fontFamily="Inter" color="red.500">Error: Opportunities data is not an array</Text>
              )}
            </Grid>
          </Box>
        </motion.div>
      </VStack>
    </Box>
  );
};

export default DashboardTab; 