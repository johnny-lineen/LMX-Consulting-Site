import { NextApiRequest, NextApiResponse } from 'next';
// DISABLED: Chatbot backend removed
// import { connectDB } from '@/lib/mongodb';
// import { Conversation, IMessage } from '@/models/Conversation';
// import { getCurrentUser } from '@/utils/auth';
// import { generateChatResponse } from '@/lib/gptChatService';

/**
 * POST /api/chat
 * 
 * DISABLED: Chatbot backend functionality removed
 * Returns stub response to keep UI functional
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // DISABLED: Chatbot backend disabled
  return res.status(200).json({ 
    success: true, 
    message: 'Chatbot backend is currently disabled',
    reply: 'The chatbot feature is temporarily unavailable. Please check back later.',
    conversationId: req.body.conversationId || 'stub',
    userId: 'stub',
    userMessage: {
      role: 'user',
      message: req.body.message || '',
      timestamp: new Date()
    },
    assistantMessage: {
      role: 'assistant',
      message: 'The chatbot feature is temporarily unavailable. Please check back later.',
      timestamp: new Date()
    }
  });
}
