import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const date = new Date();
  date.setDate(date.getDate() - 3);
  const stockDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  const symbolsGroup1 = ['AAPL', 'NKE', 'BA', 'TSLA', 'GOOG'];
  const symbolsGroup2 = ['NFLX', 'LMT', 'AMZN', 'NVDA', 'MSFT'];

  const group = req.query.group;
  let symbols: string[];

  if (group === '1') {
    symbols = symbolsGroup1;
  } else if (group === '2') {
    symbols = symbolsGroup2;
  } else {
    return res.status(400).json({ error: 'Invalid group' });
  }

  try {
    const results: { [symbol: string]: { price: number; volume: number } } = {};

    // Function to fetch data for a batch of symbols
    const fetchBatch = async (batch: string[]) => {
      const fetchPromises = batch.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://api.polygon.io/v1/open-close/${symbol}/${stockDate}?adjusted=true&apiKey=${apiKey}`
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error fetching data for ${symbol}: ${errorData.message}`);
            return;
          }

          const data = await response.json();
          if (!data.close || !data.volume) {
            console.error(`Data not found for ${symbol}`);
            return;
          }

          results[symbol] = { price: data.close, volume: data.volume };
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error processing data for ${symbol}: ${error.message}`);
          } else {
            console.error(`Error processing data for ${symbol}: ${error}`);
          }
        }
      });

      await Promise.all(fetchPromises);
    };

    // Fetch data for the symbols
    await fetchBatch(symbols);

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
    const insertPromises = Object.entries(results).map(async ([symbol, { price, volume }]) => {
      const id = uuidv4();
      await client.query(`
        INSERT INTO stock_data (id, date, symbol, price, volume)
        VALUES ($1, $2, $3, $4, $5)
      `, [id, stockDate, symbol, price, volume]);
    });

    await Promise.all(insertPromises);

    await client.end();
    res?.status(200).json({ message: 'Stock data updated successfully!!' });
  } catch (error) {
    console.error(error);
    res?.status(500).json({ error: 'Internal server error' });
  }
}