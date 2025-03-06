// filepath: /Users/jaganraajan/projects/fav-stocks-dashboard/src/utils/db.ts
import { Pool } from 'pg';

interface StockData {
    status: string;
    from: string;
    symbol: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    afterHours: number;
    preMarket: number;
  }

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || '5432', 10),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const storeStockData = async (symbol: string, date: string, data: StockData) => {
  const text = `
    INSERT INTO stock_data (symbol, date, data)
    VALUES ($1, $2, $3)
    ON CONFLICT (symbol, date) DO UPDATE
    SET data = EXCLUDED.data;
  `;
  const values = [symbol, date, data];
  await query(text, values);
};