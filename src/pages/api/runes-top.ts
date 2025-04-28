import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch('https://api.ordiscan.com/runes/top?limit=100', {
    headers: {
      Authorization: 'Bearer e227a764-b31b-43cf-a60c-be5daa50cd2c'
    }
  });
  const data = await response.json();
  res.status(200).json(data);
} 