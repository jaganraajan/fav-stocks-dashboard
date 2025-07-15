import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, symbol, data_populated } = req.body;

  if (!name || !symbol) {
    return res.status(400).json({ error: 'Missing name or symbol parameter' });
  }

  try {
    await sql`
      INSERT INTO stock_list (name, symbol, data_populated)
      VALUES (${name}, ${symbol}, ${data_populated})
    `;
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error adding stock:', error);
    return res.status(500).json({ error: 'Failed to add stock' });
  }
}