import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { UserInsights } from '@/models/UserInsights';
import { getCurrentUser } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current user
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify user can only access their own insights
    if (currentUser.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // DISABLED: Insights feature removed - return empty data
    // await connectDB();
    // const userInsights = await UserInsights.findOne({ userId });

    // Return empty insights to keep UI functional
    res.setHeader('Cache-Control', 'public, max-age=10, stale-while-revalidate=30');
    return res.status(200).json({
      success: true,
      userId,
      insights: null,
      message: 'Insights feature is currently disabled'
    });

  } catch (error: unknown) {
    console.error('Error fetching user insights:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}