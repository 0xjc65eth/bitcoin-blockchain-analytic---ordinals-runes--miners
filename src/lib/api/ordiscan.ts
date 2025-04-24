import { useState, useEffect } from 'react';

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS_PER_DAY: 1000,
  DASHBOARD_INTERVAL: 5 * 60 * 1000, // 5 minutes
  COLLECTIONS_INTERVAL: 30 * 60 * 1000, // 30 minutes
};

// Request counter
let requestCount = 0;
let lastResetTime = Date.now();

// Reset counter every 24 hours
const resetCounter = () => {
  const now = Date.now();
  if (now - lastResetTime >= 24 * 60 * 60 * 1000) {
    requestCount = 0;
    lastResetTime = now;
  }
};

// Check if we can make a request
const canMakeRequest = () => {
  resetCounter();
  return requestCount < RATE_LIMIT.MAX_REQUESTS_PER_DAY;
};

// Make a request to Ordiscan API
const makeRequest = async (endpoint: string) => {
  if (!canMakeRequest()) {
    throw new Error('Rate limit exceeded');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_ORDISCAN_API_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ORDISCAN_API_KEY}`,
    },
  });

  requestCount++;

  if (response.status === 429) {
    throw new Error('Rate limit exceeded');
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Custom hook for fetching collections
export const useCollections = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await makeRequest('/collections');
        setCollections(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch collections');
        // Fallback to mock data
        setCollections([
          {
            id: '1',
            name: 'Bitcoin Puppets',
            floorPrice: 2000,
            volume: 1000000,
          },
          {
            id: '2',
            name: 'NodeMonkes',
            floorPrice: 1500,
            volume: 800000,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
    const interval = setInterval(fetchCollections, RATE_LIMIT.COLLECTIONS_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { collections, loading, error };
};

// Custom hook for fetching runes
export const useRunes = () => {
  const [runes, setRunes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRunes = async () => {
      try {
        const data = await makeRequest('/runes');
        setRunes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching runes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch runes');
        // Fallback to mock data
        setRunes([
          {
            id: '1',
            name: 'Rune #1',
            floorPrice: 1000,
            volume: 500000,
          },
          {
            id: '2',
            name: 'Rune #2',
            floorPrice: 800,
            volume: 400000,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRunes();
    const interval = setInterval(fetchRunes, RATE_LIMIT.COLLECTIONS_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { runes, loading, error };
};

// Custom hook for fetching market opportunities
export const useMarketOpportunities = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await makeRequest('/collections');
        const opportunities = data.map((col: any) => ({
          id: col.id,
          name: col.name,
          floorPrice: col.floorPrice,
          volume: col.volume,
          forecast7d: col.floorPrice * 1.1,
          forecast30d: col.floorPrice * 1.3,
          risk: Math.random() * 0.4 + 0.6, // Random risk between 0.6 and 1.0
        }));
        setOpportunities(opportunities);
        setError(null);
      } catch (err) {
        console.error('Error fetching market opportunities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch market opportunities');
        // Fallback to mock data
        setOpportunities([
          {
            id: '1',
            name: 'Bitcoin Puppets',
            floorPrice: 2000,
            volume: 1000000,
            forecast7d: 2200,
            forecast30d: 2600,
            risk: 0.8,
          },
          {
            id: '2',
            name: 'NodeMonkes',
            floorPrice: 1500,
            volume: 800000,
            forecast7d: 1650,
            forecast30d: 1950,
            risk: 0.7,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
    const interval = setInterval(fetchOpportunities, RATE_LIMIT.DASHBOARD_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { opportunities, loading, error };
}; 