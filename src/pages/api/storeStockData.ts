// filepath: /Users/jaganraajan/projects/fav-stocks-dashboard/src/pages/api/storeStockData.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || '5432', 10),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('in handler');
  if (req.method === 'POST') {
    const { symbol, date, data } = req.body;

    const text = `
      INSERT INTO stock_data (symbol, date, data)
      VALUES ($1, $2, $3)
      ON CONFLICT (symbol, date) DO UPDATE
      SET data = EXCLUDED.data;
    `;
    const values = [symbol, date, data];

    try {
      await pool.query(text, values);
      res.status(200).json({ message: 'Data stored successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error storing data' });
    }

    console.log('in handler post exiting');
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
