import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  console.log('Received request to get user role for id:', id);

  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  try {
    const result = await sql`SELECT role FROM neon_auth.users_sync WHERE id = ${id}`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = result[0].role;
    return res.status(200).json({ role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    return res.status(500).json({ error: 'Failed to fetch user role' });
  }
}