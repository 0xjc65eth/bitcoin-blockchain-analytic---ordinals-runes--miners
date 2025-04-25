import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for development
  const collections = [
    {
      id: '1',
      name: 'Cypher Punks',
      floor: 0.5,
      volume: 1200,
      items: 10000,
      owners: 3500
    },
    {
      id: '2',
      name: 'Digital Rebels',
      floor: 0.8,
      volume: 2500,
      items: 5000,
      owners: 1800
    }
  ];

  return NextResponse.json(collections);
} 