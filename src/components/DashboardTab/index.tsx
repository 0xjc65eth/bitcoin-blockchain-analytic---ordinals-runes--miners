import React from 'react';
import { Box, Grid, Text, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { MinerData, Transaction } from '../../lib/api';

interface DashboardTabProps {
  hasPremiumAccess: boolean;
  miners: MinerData[];
  transactions: Transaction[];
}

const DashboardTab: React.FC<DashboardTabProps> = ({ hasPremiumAccess, miners, transactions }) => {
  return (
    <Box p={4}>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {miners.map((miner, index) => (
          <Box key={index} p={4} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
            <Stat>
              <StatLabel fontSize="lg">{miner.name}</StatLabel>
              <StatNumber>{miner.supply.toLocaleString()} TH/s</StatNumber>
              <Text color="gray.600">Holders: {miner.holders.toFixed(2)}%</Text>
            </Stat>
          </Box>
        ))}
      </Grid>
      
      {transactions.length > 0 && (
        <Box mt={8}>
          <Text fontSize="xl" mb={4}>Recent Transactions</Text>
          <Grid templateColumns="repeat(1, 1fr)" gap={4}>
            {transactions.map((tx, index) => (
              <Box key={index} p={4} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
                <Text fontFamily="mono" fontSize="sm">{tx.txid}</Text>
                <Text color="gray.600">Value: {tx.value} BTC</Text>
                <Text color="gray.600">Fee: {tx.fee} BTC</Text>
                <Text color="gray.600">Time: {new Date(tx.timestamp).toLocaleString()}</Text>
              </Box>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default DashboardTab; 