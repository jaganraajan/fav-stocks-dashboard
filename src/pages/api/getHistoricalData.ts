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
    // Order by date DESC to get the most recent data first, then limit and re-order
    const data = await sql`
      SELECT date, open, close, high, low, vwap, volume
      FROM historical_stock_data
      WHERE symbol = ${symbol}
      ORDER BY date DESC
      LIMIT 90
    `;

    // If we have data, re-order it chronologically for the chart
    const orderedData = data.reverse();

    // Log information about the data range for debugging
    if (orderedData.length > 0) {
      const oldest = orderedData[0].date;
      const newest = orderedData[orderedData.length - 1].date;
      console.log(`Retrieved ${orderedData.length} records for ${symbol} from ${oldest} to ${newest}`);
    } else {
      console.log(`No historical data found for ${symbol}`);
    }

    res.status(200).json(orderedData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
}