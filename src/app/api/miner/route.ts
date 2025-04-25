import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for development
  const minerStats = {
    avgHashrate: 350, // EH/s
    difficulty: 72e12,
    blockTime: 9.8 // minutes
  };

  return NextResponse.json(minerStats);
} 