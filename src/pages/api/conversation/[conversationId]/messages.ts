import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Conversation } from '@/models/Conversation';
import { getCurrentUser } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { conversationId } = req.query;

  if (!conversationId || typeof conversationId !== 'string') {
    return res.status(400).json({ error: 'Conversation ID is required' });
  }

  try {
    // Get current user
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    await connectDB();

    if (req.method === 'GET') {
      // Fetch all messages for a conversation
      const conversation = await Conversation.findOne({ 
        conversationId,
        userId: currentUser.userId 
      });

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      return res.status(200).json({
        success: true,
        conversationId,
        messages: conversation.messages,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      });

    } else if (req.method === 'POST') {
      // Add a new message to the conversation
      const { role, message } = req.body;

      if (!role || !message) {
        return res.status(400).json({ error: 'Role and message are required' });
      }

      if (!['user', 'assistant'].includes(role)) {
        return res.status(400).json({ error: 'Role must be either "user" or "assistant"' });
      }

      const conversation = await Conversation.findOneAndUpdate(
        { 
          conversationId,
          userId: currentUser.userId 
        },
        {
          $push: {
            messages: {
              role,
              message: message.trim(),
              timestamp: new Date()
            }
          }
        },
        { new: true }
      );

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Message added successfully',
        conversation
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Error handling conversation messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
