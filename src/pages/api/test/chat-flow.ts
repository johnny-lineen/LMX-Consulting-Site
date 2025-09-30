import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Conversation } from '@/models/Conversation';
import { getCurrentUser } from '@/utils/auth';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current user
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    await connectDB();

    // Create a test conversation
    const conversationId = uuidv4();
    const sessionId = uuidv4();  // Always generate unique sessionId to prevent null duplicate key errors
    const conversation = new Conversation({
      conversationId,
      sessionId,
      userId: currentUser.userId,
      messages: [
        {
          role: 'assistant',
          message: "Hi, I'm here to help clarify your goals. What would you like to focus on today?",
          timestamp: new Date()
        }
      ],
      createdAt: new Date()
    });

    await conversation.save();

    return res.status(200).json({
      success: true,
      conversationId,
      message: 'Test conversation created with bot welcome message',
      conversation: {
        messages: conversation.messages,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
    });

  } catch (error) {
    console.error('Error creating test conversation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
