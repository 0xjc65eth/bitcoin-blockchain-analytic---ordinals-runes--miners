import React, { useState, useEffect } from 'react';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Text, Button, Menu, MenuButton, MenuList, MenuItem, useToast, Spinner, Alert, AlertIcon, Grid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import MarketOpportunityScanner from '../components/MarketOpportunityScanner';
import SearchBar from '../components/SearchBar';
import DashboardTab from '../components/DashboardTab';
import { useCollections, useRunes } from '../lib/api/ordiscan';

// Debug environment variables
console.log('Environment Variables:', {
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

// Interface for collection items
interface CollectionItem {
  id: string;
  name: string;
  floorPrice: number;
  volume: number;
}

// Mock Wallet Context
const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const connectWallet = (walletType: string) => {
    setAddress('mock_address_' + walletType);
  };
  const disconnectWallet = () => setAddress(null);
  return { address, connectWallet, disconnectWallet };
};

// Mock Token Gating Service
const TokenGatingService = {
  validateNFTs: async (address: string) => {
    return { hasAccess: true, collectionName: 'OCM Genesis' };
  },
};

// Header Component
const Header: React.FC = () => {
  const { address, connectWallet, disconnectWallet } = useWallet();
  return (
    <Box as="header" bg="#1A1A1A" p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" fontFamily="Inter" color="white">
          CYPHER ORDI FUTURE
        </Text>
        {address ? (
          <Box>
            <Text display="inline" mr={4} fontFamily="Roboto Mono" color="white">
              {address.slice(0, 6)}...{address.slice(-4)}
            </Text>
            <Button
              onClick={disconnectWallet}
              bg="#2D2D2D"
              color="white"
              border="1px solid white"
              _hover={{ borderColor: '#00A3FF' }}
              fontFamily="Inter"
            >
              Disconnect
            </Button>
          </Box>
        ) : (
          <Menu>
            <MenuButton
              as={Button}
              bg="#2D2D2D"
              color="white"
              border="1px solid white"
              _hover={{ borderColor: '#00A3FF' }}
              fontFamily="Inter"
            >
              Connect Wallet
            </MenuButton>
            <MenuList bg="#2D2D2D">
              <MenuItem onClick={() => connectWallet('xverse')} color="white" bg="#2D2D2D" _hover={{ bg: '#00A3FF' }}>
                Xverse
              </MenuItem>
              <MenuItem onClick={() => connectWallet('unisat')} color="white" bg="#2D2D2D" _hover={{ bg: '#00A3FF' }}>
                Unisat
              </MenuItem>
              <MenuItem onClick={() => connectWallet('oyl')} color="white" bg="#2D2D2D" _hover={{ bg: '#00A3FF' }}>
                OYL
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Box>
    </Box>
  );
};

// Footer Component
const Footer: React.FC = () => {
  const toast = useToast();
  const btcAddress = 'bc1q3ghzvpp0l74q3ntu8actyt0qcvl2u273flg5rs';

  const copyAddress = () => {
    navigator.clipboard.writeText(btcAddress);
    toast({
      title: 'Address Copied',
      description: 'BTC donation address copied to clipboard.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box as="footer" bg="#1A1A1A" color="white" p={4} mt={8}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Text fontFamily="Inter" fontSize="sm">
          Holders of OCM Genesis, OCM Katoshi Prime, OCM Katoshi Classic, Seize Ctrl, Multiverso Pass, N0 0rdinary Kind, Bitcoin Puppets, and The Wizard of Lord have full access to all information and tools for free.
        </Text>
        <Box display="flex" alignItems="center">
          <Text fontFamily="Roboto Mono" fontSize="sm" mr={2}>
            Support us: {btcAddress}
          </Text>
          <Button
            size="sm"
            bg="#2D2D2D"
            color="white"
            border="1px solid white"
            _hover={{ borderColor: '#00A3FF' }}
            onClick={copyAddress}
          >
            Copy Address
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Main Page Component
const Home: React.FC = () => {
  const { address } = useWallet();
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [collectionName, setCollectionName] = useState<string | undefined>(undefined);
  const toast = useToast();
  const { collections, loading: collectionsLoading, error: collectionsError } = useCollections();
  const { runes, loading: runesLoading, error: runesError } = useRunes();

  useEffect(() => {
    const checkAccess = async () => {
      if (address) {
        try {
          const { hasAccess, collectionName } = await TokenGatingService.validateNFTs(address);
          setHasPremiumAccess(hasAccess);
          setCollectionName(collectionName);
          if (hasAccess && collectionName) {
            toast({
              title: 'Thank You!',
              description: `Dear ${collectionName} Holder, thank you for joining CYPHER ORDI FUTURE! 🚀 Your support drives our mission to revolutionize Bitcoin analytics. Together, let's unlock the full potential of the Bitcoin ecosystem—keep exploring, keep innovating, and let's shape the future of crypto!`,
              status: 'success',
              duration: 15000,
              isClosable: true,
            });
          }
        } catch (error) {
          console.error('Error checking access:', error);
          setHasPremiumAccess(false);
        }
      }
    };
    checkAccess();
  }, [address, toast]);

  const renderLoading = () => (
    <Box display="flex" justifyContent="center" p={8}>
      <Spinner size="xl" color="#00A3FF" />
    </Box>
  );

  const renderError = (error: string) => (
    <Alert status="error" mb={4}>
      <AlertIcon />
      {error}
    </Alert>
  );

  return (
    <Box bg="#1A1A1A" color="white" minH="100vh">
      <Header />
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: '#00A3FF' }} color="white" fontFamily="Inter">Dashboard</Tab>
          <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: '#00A3FF' }} color="white" fontFamily="Inter">Miners</Tab>
          <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: '#00A3FF' }} color="white" fontFamily="Inter">Ordinals</Tab>
          <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: '#00A3FF' }} color="white" fontFamily="Inter">Runes</Tab>
          <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: '#00A3FF' }} color="white" fontFamily="Inter">Transactions</Tab>
          <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: '#00A3FF' }} color="white" fontFamily="Inter">Trends</Tab>
          <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: '#00A3FF' }} color="white" fontFamily="Inter">Signals</Tab>
          <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: '#00A3FF' }} color="white" fontFamily="Inter">Best Collections</Tab>
          {hasPremiumAccess && (
            <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: '#00A3FF' }} color="white" fontFamily="Inter">Market Opportunities</Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            <DashboardTab />
          </TabPanel>
          <TabPanel>
            <Box p={4} bg="#1A1A1A" color="white">
              <Text fontSize="xl" fontFamily="Inter" mb={4}>Miners</Text>
              <Box bg="#2D2D2D" p={4} border="1px solid white" borderRadius="md">
                <Text fontFamily="Roboto Mono">Mock Miner Data: Not available via Ordiscan API</Text>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4} bg="#1A1A1A" color="white">
              <Text fontSize="xl" fontFamily="Inter" mb={4}>Ordinals</Text>
              {collectionsLoading ? (
                renderLoading()
              ) : collectionsError ? (
                renderError(collectionsError)
              ) : (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                  {Array.isArray(collections) ? (
                    collections.map((col: CollectionItem) => (
                      <motion.div key={col.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Box bg="#2D2D2D" p={4} border="1px solid white" borderRadius="md" _hover={{ borderColor: '#00A3FF', transform: 'scale(1.02)', transition: 'all 0.2s' }}>
                          <Text fontSize="lg" fontFamily="Inter">{col.name}</Text>
                          <Text fontFamily="Roboto Mono">Floor Price: {col.floorPrice} sats</Text>
                          <Text fontFamily="Roboto Mono">Volume: {col.volume} sats</Text>
                        </Box>
                      </motion.div>
                    ))
                  ) : (
                    <Text fontFamily="Inter" color="red.500">Error: Collections data is not an array</Text>
                  )}
                </Grid>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4} bg="#1A1A1A" color="white">
              <Text fontSize="xl" fontFamily="Inter" mb={4}>Runes</Text>
              {runesLoading ? (
                renderLoading()
              ) : runesError ? (
                renderError(runesError)
              ) : (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                  {Array.isArray(runes) ? (
                    runes.map((rune: CollectionItem) => (
                      <motion.div key={rune.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Box bg="#2D2D2D" p={4} border="1px solid white" borderRadius="md" _hover={{ borderColor: '#00A3FF', transform: 'scale(1.02)', transition: 'all 0.2s' }}>
                          <Text fontSize="lg" fontFamily="Inter">{rune.name}</Text>
                          <Text fontFamily="Roboto Mono">Floor Price: {rune.floorPrice} sats</Text>
                          <Text fontFamily="Roboto Mono">Volume: {rune.volume} sats</Text>
                        </Box>
                      </motion.div>
                    ))
                  ) : (
                    <Text fontFamily="Inter" color="red.500">Error: Runes data is not an array</Text>
                  )}
                </Grid>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4} bg="#1A1A1A" color="white">
              <Text fontSize="xl" fontFamily="Inter" mb={4}>Transactions</Text>
              <Box bg="#2D2D2D" p={4} border="1px solid white" borderRadius="md">
                <Text fontFamily="Roboto Mono">Mock Transaction Data: Not available via Ordiscan API</Text>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4} bg="#1A1A1A" color="white">
              <Text fontSize="xl" fontFamily="Inter" mb={4}>Trends</Text>
              <Box bg="#2D2D2D" p={4} border="1px solid white" borderRadius="md">
                <Text fontFamily="Roboto Mono">Mock Trends Data: Not available via Ordiscan API</Text>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4} bg="#1A1A1A" color="white">
              <Text fontSize="xl" fontFamily="Inter" mb={4}>Signals</Text>
              <Box bg="#2D2D2D" p={4} border="1px solid white" borderRadius="md">
                <Text fontFamily="Roboto Mono">Mock Signals Data: Not available via Ordiscan API</Text>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4} bg="#1A1A1A" color="white">
              <Text fontSize="xl" fontFamily="Inter" mb={4}>Best Collections</Text>
              {collectionsLoading ? (
                renderLoading()
              ) : collectionsError ? (
                renderError(collectionsError)
              ) : (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                  {Array.isArray(collections) ? (
                    collections
                      .filter((col: CollectionItem) => 
                        ['Bitcoin Puppets', 'NodeMonkes', 'Runestone'].includes(col.name)
                      )
                      .map((col: CollectionItem) => (
                        <motion.div key={col.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                          <Box bg="#2D2D2D" p={4} border="1px solid white" borderRadius="md" _hover={{ borderColor: '#00A3FF', transform: 'scale(1.02)', transition: 'all 0.2s' }}>
                            <Text fontSize="lg" fontFamily="Inter">{col.name}</Text>
                            <Text fontFamily="Roboto Mono">Floor Price: {col.floorPrice} sats</Text>
                            <Text fontFamily="Roboto Mono">Volume: {col.volume} sats</Text>
                          </Box>
                        </motion.div>
                      ))
                  ) : (
                    <Text fontFamily="Inter" color="red.500">Error: Collections data is not an array</Text>
                  )}
                </Grid>
              )}
            </Box>
          </TabPanel>
          {hasPremiumAccess && (
            <TabPanel>
              <MarketOpportunityScanner />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
      <Footer />
    </Box>
  );
};

export default Home; 