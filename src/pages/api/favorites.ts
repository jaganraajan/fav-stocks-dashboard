import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || '');

const companyNames: { [symbol: string]: string } = {
    AAPL: 'Apple Inc.',
    NKE: 'Nike Inc.',
    BA: 'Boeing Co.',
    TSLA: 'Tesla Inc.',
    GOOG: 'Alphabet Inc.',
    NFLX: 'Netflix Inc.',
    LMT: 'Lockheed Martin Corp.',
    AMZN: 'Amazon.com Inc.',
    NVDA: 'NVIDIA Corp.',
    MSFT: 'Microsoft Corp.',
};

const createFavoritesTableIfNotExists = async () => {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS user_favorites (
          id UUID PRIMARY KEY,
          user_id TEXT NOT NULL,
          symbol TEXT NOT NULL
        )
      `;
      console.log('Table "user_favorites" created or already exists.');
    } catch (error) {
      console.error('Error creating table "user_favorites":', error);
      throw new Error('Failed to create table');
    }
};

const checkAndAddDefaultCompaniesForUser = async (userId: string) => {
    try {
      // Check if the user exists in the table
      const userExists = await sql`
        SELECT COUNT(*) AS count FROM user_favorites WHERE user_id = ${userId}
      `;
  
      if (userExists[0].count > 0) {
        console.log(`User ${userId} already exists. No action needed.`);
        return; // User exists, no need to add default companies
      }
  
      // Add default companies for the user
      for (const symbol of Object.keys(companyNames)) {
        await sql`
          INSERT INTO user_favorites (id, user_id, symbol)
          VALUES (${uuidv4()}, ${userId}, ${symbol})
        `;
      }
  
      console.log(`Added default companies for new user ${userId}.`);
    } catch (error) {
      console.error('Error checking or adding default companies for user:', error);
      throw new Error('Failed to check or add default companies');
    }
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  

  if (req.method === 'GET') {
    const { userId } = req.query;
    try {
      const result = await sql`SELECT symbol FROM user_favorites WHERE user_id = ${userId}`;
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  }

//   if (!symbol) return res.status(400).json({ error: 'No symbol provided' });

  if (req.method === 'POST') {
    const { symbol, userId, action } = req.body; 

    console.log('in handler post');
    console.log(symbol, userId, action);
    if (!userId) return res.status(401).json({ error: 'No userId signed in' });

    try {
        // Ensure the table exists before performing any operations
        await createFavoritesTableIfNotExists();
    
        // Check if the user exists and add default companies if necessary
        await checkAndAddDefaultCompaniesForUser(userId as string);
      } catch (error) {
        console.error('Error creating fav table:', error);
        return res.status(500).json({ error: 'Failed to initialize database' });
      }

    try {
        if (action === 'remove') {
            await sql`DELETE FROM user_favorites WHERE user_id = ${userId} AND symbol = ${symbol}`;
            return res.status(200).json({ success: true });
        }

        if (action === 'add') {
            await sql`INSERT INTO user_favorites (id, user_id, symbol) VALUES (${uuidv4()}, ${userId}, ${symbol})`;
            return res.status(200).json({ success: true });
      }
    } catch (error) {
      console.error('Error adding or removing favorite:', error);
      return res.status(500).json({ error: 'Failed to add or remove favorite' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}