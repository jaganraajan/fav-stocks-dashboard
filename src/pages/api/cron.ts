import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  const symbolsGroup1 = ['AAPL', 'NKE', 'BA', 'TSLA', 'GOOG'];
  const symbolsGroup2 = ['NFLX', 'LMT', 'AMZN', 'NVDA', 'MSFT'];
  
  const group = req.query.group;
  let symbols: string[];
  let stockDate = '';

  if (group === '1') {
    symbols = symbolsGroup1;
  } else if (group === '2') {
    symbols = symbolsGroup2;
  } else {
    return res.status(400).json({ error: 'Invalid group' });
  }

  try {
    const results: { [symbol: string]: { price: number; volume: number } } = {};
    const maxDaysToCheck = 7; // Maximum number of days to check
    let daysChecked = 0;

    while (daysChecked < maxDaysToCheck) {
      const date = new Date();
      date.setDate(date.getDate() - 4 - daysChecked);
      stockDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

      for (const symbol of symbols) {
        try {
          const response = await fetch(
            `https://api.polygon.io/v1/open-close/${symbol}/${stockDate}?adjusted=true&apiKey=${apiKey}`
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error fetching data for ${symbol}: ${errorData.message}`);
            continue; // Skip to the next symbol
          }

          const data = await response.json();
          if (!data.close || !data.volume) {
            console.error(`Data not found for ${symbol}`);
            continue; // Skip to the next symbol
          }

          results[symbol] = { price: data.close, volume: data.volume };
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error processing data for ${symbol}: ${error.message}`);
          } else {
            console.error(`Error processing data for ${symbol}: ${error}`);
          }
        }
      }

      if (Object.keys(results).length > 0) {
        break; // Break the loop if valid data is found
      }

      daysChecked++;
    }

    const sql = neon(process.env.DATABASE_URL || '');
    await sql`
      CREATE TABLE IF NOT EXISTS stock_data (
        id UUID PRIMARY KEY,
        date DATE,
        symbol TEXT,
        price NUMERIC,
        volume NUMERIC
      )
    `;

    // Insert separate entries for each company
    for (const symbol in results) {
      const { price, volume } = results[symbol];
      const id = uuidv4();
      await sql`
        INSERT INTO stock_data (id, date, symbol, price, volume)
        VALUES (${id}, ${stockDate}, ${symbol}, ${price}, ${volume})
      `;
    }

    res?.status(200).json({ message: 'Stock data updated successfully!!!' });
  } catch (error) {
    console.error(error);
    res?.status(500).json({ error: 'Internal server error.' });
  }
}