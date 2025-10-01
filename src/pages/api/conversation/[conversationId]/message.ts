import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from '@/utils/auth';
// DISABLED: Chatbot backend removed
// import { connectDB } from '@/lib/mongodb';
// import { Conversation } from '@/models/Conversation';
// import { generateChatResponse } from '@/lib/gptChatService';

/**
 * POST /api/conversation/[conversationId]/message
 * 
 * DISABLED: Chatbot backend functionality removed
 * Returns stub response to keep UI functional
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const currentUser = getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { conversationId } = req.query;
  const { message } = req.body;

  // Return stub response
  return res.status(200).json({
    success: true,
    conversationId,
    message: 'Chatbot backend is currently disabled',
    reply: 'The chatbot feature is temporarily unavailable. Please check back later.',
    userMessage: {
      role: 'user',
      message: message || '',
      timestamp: new Date()
    },
    assistantMessage: {
      role: 'assistant',
      message: 'The chatbot feature is temporarily unavailable. Please check back later.',
      timestamp: new Date()
    }
  });
}