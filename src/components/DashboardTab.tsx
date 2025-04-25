import React from 'react';
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { Transaction } from '../lib/api';

interface DashboardTabProps {
  transactions: Transaction[];
}

const DashboardTab: React.FC<DashboardTabProps> = ({ transactions }) => {
  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Text fontSize="xl" fontWeight="bold">Recent Transactions</Text>
      {transactions.map((tx) => (
        <Box key={tx.txid} p={4} borderWidth={1} borderRadius="md">
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">TxID: {tx.txid}</Text>
              <Text color="gray.600">Value: {tx.value} BTC</Text>
              <Text color="gray.600">Fee: {tx.fee} BTC</Text>
              <Text color="gray.600">Time: {new Date(tx.timestamp).toLocaleString()}</Text>
            </VStack>
            <Badge colorScheme={tx.value > 1 ? 'green' : 'gray'}>
              {tx.value > 1 ? 'High Value' : 'Normal'}
            </Badge>
          </HStack>
        </Box>
      ))}
      {transactions.length === 0 && (
        <Text color="gray.500" textAlign="center">No recent transactions</Text>
      )}
    </VStack>
  );
};

export default DashboardTab; 