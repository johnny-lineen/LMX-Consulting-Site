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

    await connectDB();

    // Fetch user insights
    const userInsights = await UserInsights.findOne({ userId });

    if (!userInsights) {
      // Cache empty responses to reduce spam
      res.setHeader('Cache-Control', 'public, max-age=10, stale-while-revalidate=30');
      return res.status(200).json({
        success: true,
        userId,
        insights: null,
        message: 'No insights found for this user'
      });
    }

    // Add caching headers based on last update time
    const lastModified = userInsights.updatedAt || userInsights.createdAt;
    const etag = `"${userInsights._id}-${lastModified.getTime()}"`;
    
    res.setHeader('Cache-Control', 'public, max-age=5, must-revalidate');
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', lastModified.toUTCString());
    
    // Check if client has cached version
    const ifNoneMatch = req.headers['if-none-match'];
    const ifModifiedSince = req.headers['if-modified-since'];
    
    if (ifNoneMatch === etag || 
        (ifModifiedSince && new Date(ifModifiedSince) >= lastModified)) {
      return res.status(304).end();
    }

    return res.status(200).json({
      success: true,
      userId,
      insights: userInsights
    });

  } catch (error) {
    console.error('Error fetching user insights:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}