import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { ConversationInsights } from '@/models/ConvoInsights';
import { getCurrentUser } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { conversationId } = req.query;

  if (!conversationId || typeof conversationId !== 'string') {
    return res.status(400).json({ error: 'Conversation ID is required' });
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

    await connectDB();

    // Fetch conversation insights
    const conversationInsights = await ConversationInsights.findOne({
      conversationId,
      userId: currentUser.userId
    });

    if (!conversationInsights) {
      // Cache empty responses to reduce spam
      res.setHeader('Cache-Control', 'public, max-age=10, stale-while-revalidate=30');
      return res.status(200).json({
        success: true,
        conversationId,
        insights: null,
        message: 'No insights found for this conversation'
      });
    }

    // Add caching headers based on last update time
    const lastModified = conversationInsights.updatedAt || conversationInsights.createdAt;
    const etag = `"${conversationInsights._id}-${lastModified.getTime()}"`;
    
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
      conversationId,
      insights: conversationInsights
    });

  } catch (error: unknown) {
    console.error('Error fetching conversation insights:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}