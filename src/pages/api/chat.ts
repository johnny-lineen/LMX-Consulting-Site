import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Conversation } from '@/models/Conversation';
import { getCurrentUser } from '@/utils/auth';
import { processInsightsPipeline } from '@/lib/insightPipeline';
import { generateChatResponse } from '@/lib/gptChatService';

/**
 * POST /api/chat
 * 
 * Backend API Endpoint for Chat
 * 
 * Accepts:
 * - userId (from authentication)
 * - conversationId (from request body)
 * - message (from request body)
 * 
 * Flow:
 * 1. Validates user authentication
 * 2. Saves user message to MongoDB
 * 3. Sends full conversation history to GPT
 * 4. Saves assistant's reply to MongoDB
 * 5. Returns assistant's reply
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Step 1: Get current user (userId from authentication)
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Extract conversationId and message from request body
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({ error: 'Conversation ID and message are required' });
    }

    await connectDB();

    // Verify conversation exists and belongs to user
    const conversation = await Conversation.findOne({
      conversationId,
      userId: currentUser.userId
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Step 2: Save user message to MongoDB
    const userMessage = {
      role: 'user' as const,
      message: message.trim(),
      timestamp: new Date()
    };

    conversation.messages.push(userMessage);
    conversation.updatedAt = new Date();
    await conversation.save();

    // Step 3: Send full conversation history to GPT
    const conversationHistory = conversation.messages.map(msg => ({ 
      role: msg.role, 
      message: msg.message 
    }));

    const assistantResponse = await generateChatResponse(
      userMessage.message,
      conversationHistory.slice(0, -1) // Don't include the just-added user message
    );

    // Step 4: Save assistant's reply to MongoDB
    const assistantMessage = {
      role: 'assistant' as const,
      message: assistantResponse,
      timestamp: new Date()
    };

    conversation.messages.push(assistantMessage);
    conversation.updatedAt = new Date();
    await conversation.save();

    // Process insights asynchronously (don't wait for completion)
    processInsightsPipeline(
      conversationId, 
      currentUser.userId, 
      assistantResponse,
      conversationHistory
    ).catch(error => {
      console.error('Insight processing failed:', error);
    });

    // Step 5: Return assistant's reply
    return res.status(200).json({
      success: true,
      conversationId,
      userId: currentUser.userId,
      userMessage,
      assistantMessage,
      reply: assistantResponse,
      message: 'Message processed successfully'
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
