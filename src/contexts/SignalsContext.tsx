import React, { createContext, useContext, useState, useEffect } from 'react';

interface Signal {
  id: string;
  type: 'buy' | 'sell' | 'hold';
  confidence: 'high' | 'medium' | 'low';
  description: string;
  timestamp: string;
  impact: string;
}

interface SignalsContextType {
  signals: Signal[];
  loading: boolean;
  error: string | null;
}

const SignalsContext = createContext<SignalsContextType>({
  signals: [],
  loading: true,
  error: null,
});

export const useSignals = () => useContext(SignalsContext);

export const SignalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        // Simulate fetching signals from API
        const mockSignals: Signal[] = [
          {
            id: '1',
            type: 'buy',
            confidence: 'high',
            description: 'Strong buy signal based on market analysis',
            timestamp: new Date().toISOString(),
            impact: 'High potential for price increase'
          },
          {
            id: '2',
            type: 'hold',
            confidence: 'medium',
            description: 'Market consolidation phase',
            timestamp: new Date().toISOString(),
            impact: 'Stable market conditions'
          }
        ];
        setSignals(mockSignals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
    const interval = setInterval(fetchSignals, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <SignalsContext.Provider value={{ signals, loading, error }}>
      {children}
    </SignalsContext.Provider>
  );
}; 