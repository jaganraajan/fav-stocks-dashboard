import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@neondatabase/serverless';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const client = new Client({
      connectionString: process.env.NEON_DATABASE_URL,
    });
    await client.connect();

    let result;
    const maxDaysToCheck = 7; // Maximum number of days to check
    let daysChecked = 0;

    while (daysChecked < maxDaysToCheck) {
        const date = new Date();
        date.setDate(date.getDate()-4-daysChecked);
        const stockDate =  date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

      result = await client.query(`
        SELECT DISTINCT ON (symbol) symbol, price, volume
        FROM stock_data
        WHERE date = $1 AND price IS NOT NULL AND volume IS NOT NULL
        ORDER BY symbol, date
      `, [stockDate]);

      if (result.rows.length > 0) {
        break;
      }

      daysChecked++;
    }

    await client.end();

    if (result?.rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified date' });
    }

    res.status(200).json(result?.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}