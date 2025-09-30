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

    // DISABLED: Insights feature removed - return empty data
    // await connectDB();
    // const conversationInsights = await ConversationInsights.findOne({...});

    // Return empty insights to keep UI functional
    res.setHeader('Cache-Control', 'public, max-age=10, stale-while-revalidate=30');
    return res.status(200).json({
      success: true,
      conversationId,
      insights: null,
      message: 'Insights feature is currently disabled'
    });

  } catch (error: unknown) {
    console.error('Error fetching conversation insights:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}