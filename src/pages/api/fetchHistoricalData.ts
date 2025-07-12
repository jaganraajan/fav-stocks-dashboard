import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || '');

// const symbolsGroup1 = ['AAPL', 'NKE'];
const symbolsGroup1 = ['AAPL', 'NKE', 'BA', 'TSLA', 'GOOG'];
const symbolsGroup2 = ['NFLX', 'LMT', 'AMZN', 'NVDA', 'MSFT'];
const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY; // Ensure this is set in your .env file
const baseUrl = 'https://api.polygon.io/v2/aggs/ticker';

const fetchHistoricalData = async (symbol: string, date: string) => {
  const url = `${baseUrl}/${symbol}/range/1/day/${date}/${date}?apiKey=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${symbol}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
};

const getPastDates = (days: number): string[] => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    dates.push(formattedDate);
  }
  return dates;
};

const createHistoricalDataTable = async () => {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS historical_stock_data (
          id UUID PRIMARY KEY,
          date DATE,
          symbol TEXT,
          open NUMERIC,
          close NUMERIC,
          high NUMERIC,
          low NUMERIC,
          vwap NUMERIC,
          volume NUMERIC
        )
      `;
      console.log('Historical stock data table created or already exists.');
    } catch (error) {
      console.error('Error creating historical stock data table:', error);
    }
  };
  
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const storeDataInHistoricalTable = async (symbol: string, date: string, data: any) => {
    try {
      const { results } = data;
      if (results && results.length > 0) {
        const { v: volume, o: open, c: close, h: high, l: low, vw: vwap } = results[0]; // Extract relevant fields
        const id = uuidv4();
  
        await sql`
          INSERT INTO historical_stock_data (id, date, symbol, open, close, high, low, vwap, volume)
          VALUES (${id}, ${date}, ${symbol}, ${open}, ${close}, ${high}, ${low}, ${vwap}, ${volume})
        `;
        console.log(`Stored historical data for ${symbol} on ${date}: Open=${open}, Close=${close}, High=${high}, Low=${low}, VWAP=${vwap}, Volume=${volume}`);
      } else {
        console.log(`No data available for ${symbol} on ${date}`);
      }
    } catch (error) {
      console.error(`Error storing historical data for ${symbol} on ${date}:`, error);
    }
  };

const fetchDataForSymbols = async (symbols: string[], days: number, intervalMs: number) => {
  const pastDates = getPastDates(days);
  for (const symbol of symbols) {
    console.log(`Fetching data for ${symbol}...`);
    for (const date of pastDates) {
      const data = await fetchHistoricalData(symbol, date);
      if (data) {
        console.log(`Data for ${symbol} on ${date}:`, data);
        await storeDataInHistoricalTable(symbol, date, data); 
        // Save data to your database or process it here
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs)); // Respect rate limit
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const intervalMs = 12000; // Adjust based on Polygon API rate limit
    const days = 3; // Fetch data for the past 10 days

    // Create the historical data table
    await createHistoricalDataTable();

    console.log('Starting data fetch for Group 1...');
    await fetchDataForSymbols(symbolsGroup1, days, intervalMs);

    console.log('Starting data fetch for Group 2...');
    await fetchDataForSymbols(symbolsGroup2, days, intervalMs);

    res.status(200).json({ message: 'Historical data fetch completed successfully' });
  } catch (error) {
    console.error('Error in cron job:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
}