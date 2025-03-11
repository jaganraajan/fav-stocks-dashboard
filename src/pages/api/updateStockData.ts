import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { stockData, date } = req.body;

  if (!stockData || !date) {
    return res.status(400).json({ error: 'Missing stockData or date' });
  }

  try {
    const client = new Client({
      connectionString: process.env.NEON_DATABASE_URL,
    });
    await client.connect();

    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock_data (
        id UUID PRIMARY KEY,
        date DATE,
        symbol TEXT,
        price NUMERIC,
        volume NUMERIC
      )
    `);

    // Insert separate entries for each company
    for (const symbol in stockData) {
      const { price, volume } = stockData[symbol];
      const id = uuidv4();
      await client.query(`
        INSERT INTO stock_data (id, date, symbol, price, volume)
        VALUES ($1, $2, $3, $4, $5)
      `, [id, date, symbol, price, volume]);
    }

    await client.end();
    res.status(200).json({ message: 'Stock data updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}