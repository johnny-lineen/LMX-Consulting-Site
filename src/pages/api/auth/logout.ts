import { NextApiRequest, NextApiResponse } from 'next';
import { clearTokenCookie } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear the token cookie
    clearTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error: unknown) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
