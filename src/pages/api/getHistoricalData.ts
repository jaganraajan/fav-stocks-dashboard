import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { symbol } = req.query; // Get the company symbol from the query params

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    // Query the historical_stock_data table for the given symbol
    const data = await sql`
      SELECT date, open, close, high, low, vwap, volume
      FROM historical_stock_data
      WHERE symbol = ${symbol}
      ORDER BY date ASC
    `;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
}