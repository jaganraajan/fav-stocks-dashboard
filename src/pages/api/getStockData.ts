import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@neondatabase/serverless';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Missing date' });
  }

  try {
    const client = new Client({
      connectionString: process.env.NEON_DATABASE_URL,
    });
    await client.connect();

    const result = await client.query(`
      SELECT symbol, price, volume
      FROM stock_data
      WHERE date = $1
    `, [date]);

    await client.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified date' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}