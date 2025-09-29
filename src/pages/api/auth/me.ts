import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { getCurrentUser } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current user from token
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await connectDB();

    // Get fresh user data from database
    const user = await User.findById(currentUser.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data (password excluded by toJSON method)
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
