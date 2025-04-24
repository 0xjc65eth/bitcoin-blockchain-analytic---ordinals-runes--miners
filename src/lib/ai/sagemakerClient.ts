import axios from 'axios';

export class MarketAnalyticsClient {
  private readonly baseUrl = 'https://api-mainnet.magiceden.dev/v2/ord';

  async predictGrowth(data: { marketCap: number; volume: number; sentiment: number }): Promise<number> {
    try {
      // Get collection stats from Magic Eden
      const response = await axios.get(`${this.baseUrl}/collections/stats`, {
        params: {
          symbol: 'ordinals' // You can change this to specific collection symbol
        }
      });

      const stats = response.data;
      const volumeChange = stats.volumeChange24h || 0;
      const floorPriceChange = stats.floorPriceChange24h || 0;
      
      // Calculate growth prediction based on Magic Eden data
      const growthPrediction = (
        (volumeChange * 0.4) + 
        (floorPriceChange * 0.4) + 
        (data.sentiment * 0.2)
      );

      return Math.max(-50, Math.min(50, growthPrediction));
    } catch (error) {
      console.error('Growth prediction error:', error);
      return 0;
    }
  }

  async scanMarketOpportunities(ordinals: any[]): Promise<any[]> {
    try {
      // Get popular collections stats
      const response = await axios.get(`${this.baseUrl}/collections/popular/stats`);
      const popularStats = response.data;

      // Get current market activity
      const activityResponse = await axios.get(`${this.baseUrl}/activities`);
      const recentActivity = activityResponse.data;

      return ordinals.map((ordinal) => {
        const collectionStats = popularStats.find((s: any) => s.symbol === ordinal.collectionSymbol);
        const recentTrades = recentActivity.filter((a: any) => 
          a.collectionSymbol === ordinal.collectionSymbol
        );

        const volume24h = collectionStats?.volume24h || 0;
        const floorPrice = collectionStats?.floorPrice || ordinal.floorPrice;
        const tradeCount = recentTrades.length;

        // Calculate risk based on trading activity
        const riskFactor = Math.min(1, Math.max(0.3, 1 - (tradeCount / 100)));

        // Calculate forecasts based on collection stats
        const forecast7d = floorPrice * (1 + (volume24h > 0 ? 0.1 : 0));
        const forecast30d = floorPrice * (1 + (volume24h > 0 ? 0.3 : 0));

        return {
          ...ordinal,
          forecast7d: Math.max(0, forecast7d),
          forecast30d: Math.max(0, forecast30d),
          risk: riskFactor,
          volume24h,
          tradeCount
        };
      });
    } catch (error) {
      console.error('Market scanner error:', error);
      return ordinals.map((o) => ({
        ...o,
        forecast7d: o.floorPrice * 1.1,
        forecast30d: o.floorPrice * 1.3,
        risk: 0.5,
        volume24h: 0,
        tradeCount: 0
      }));
    }
  }

  // Helper method to get collection details
  async getCollectionDetails(symbol: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/collections/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching collection details:', error);
      return null;
    }
  }

  // Helper method to get collection activities
  async getCollectionActivities(symbol: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/activities`, {
        params: {
          collectionSymbol: symbol
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching collection activities:', error);
      return [];
    }
  }
} 