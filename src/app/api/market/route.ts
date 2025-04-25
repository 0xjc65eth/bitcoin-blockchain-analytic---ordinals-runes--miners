import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for development
  const marketData = {
    price: 45000.23,
    volume24h: 28500000,
    marketCap: 875000000000,
    change24h: 2.5,
    dominance: 42.3,
    trends: {
      hourly: [44800, 44900, 45100, 45000.23],
      daily: [43500, 44200, 44800, 45000.23],
      weekly: [42000, 43100, 44500, 45000.23]
    }
  };

  return NextResponse.json(marketData);
} 