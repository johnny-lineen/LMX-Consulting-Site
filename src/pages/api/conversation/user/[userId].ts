import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Conversation } from '@/models/Conversation';
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

    // Verify user can only access their own conversations
    if (currentUser.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await connectDB();

    // Fetch all conversations for the user, sorted by most recent
    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .select('conversationId messages createdAt updatedAt')
      .lean();

    return res.status(200).json({
      success: true,
      conversations: conversations.map(conv => ({
        conversationId: conv.conversationId,
        messageCount: conv.messages.length,
        lastMessage: conv.messages[conv.messages.length - 1],
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt
      }))
    });

  } catch (error: unknown) {
    console.error('Error fetching user conversations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
