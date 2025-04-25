import React, { useState, useEffect } from 'react';
import { Box, useDisclosure, useToast } from '@chakra-ui/react';
import { fetchMinerData, fetchRecentTransactions, MinerData, Transaction } from '../lib/api';
import DashboardTab from '../components/DashboardTab/index';

const Home: React.FC = () => {
  const [runes, setRunes] = useState<MinerData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [hasPremiumAccess, setHasPremiumAccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [miners, txs] = await Promise.all([
          fetchMinerData(),
          fetchRecentTransactions('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
        ]);
        if (miners) setRunes(miners);
        if (txs) setTransactions(txs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box color="red.500">{error}</Box>;
  }

  return (
    <Box>
      {selectedTab === 'dashboard' && (
        <DashboardTab 
          hasPremiumAccess={hasPremiumAccess}
          miners={runes}
          transactions={transactions}
        />
      )}
    </Box>
  );
};

export default Home; 