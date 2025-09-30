import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Conversation } from '@/models/Conversation';
import { getCurrentUser } from '@/utils/auth';
// import { processInsightsPipeline } from '@/lib/insightPipeline'; // DISABLED: Insights removed
import { generateChatResponse } from '@/lib/gptChatService';
import { randomUUID } from 'crypto';

/**
 * API Route: Send Message
 * POST /api/conversation/[conversationId]/message
 * 
 * Flow:
 * 1. Connect to MongoDB
 * 2. Accept userId (from auth), conversationId, and message content
 * 3. Look up conversation by userId and conversationId
 * 4. If no conversation exists, create a new one with timestamp
 * 5. Save the user message
 * 6. Send full conversation history to GPT
 * 7. Save the assistant's reply
 * 8. Return the assistant's reply to frontend
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { conversationId } = req.query;

  // Validate conversationId parameter
  if (!conversationId || typeof conversationId !== 'string') {
    return res.status(400).json({ error: 'Conversation ID is required' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log(`[message] Processing message for conversation: ${conversationId}`);
    
    // Step 1: Authenticate user
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      console.warn('[message] Authentication failed');
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log('[message] User authenticated:', currentUser.userId);

    const { message, isBotMessage } = req.body;

    // Validate message content
    if (!message) {
      console.error('[message] Message content missing');
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('[message] Message received:', { 
      messageLength: message.length, 
      isBotMessage: !!isBotMessage 
    });

    // Step 2: Connect to MongoDB
    await connectDB();

    // Step 3: Look up conversation by userId and conversationId
    let conversation = await Conversation.findOne({
      conversationId,
      userId: currentUser.userId
    });

    // Step 4: If no conversation exists, create a new one
    if (!conversation) {
      conversation = new Conversation({
        conversationId,
        sessionId: randomUUID(),  // Always generate unique sessionId to prevent null duplicate key errors
        userId: currentUser.userId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await conversation.save();
    }

    if (isBotMessage) {
      // Handle bot's first message - only add assistant message
      const assistantMessage = {
        role: 'assistant' as const,
        message: message.trim(),
        timestamp: new Date()
      };

      conversation.messages.push(assistantMessage);
      conversation.updatedAt = new Date();
      await conversation.save();

      return res.status(200).json({
        success: true,
        conversationId,
        assistantMessage,
        message: 'Bot welcome message added successfully'
      });
    } else {
      // Step 5: Save the user message
      const userMessage = {
        role: 'user' as const,
        message: message.trim(),
        timestamp: new Date()
      };

      conversation.messages.push(userMessage);
      conversation.updatedAt = new Date();
      await conversation.save();

      // Step 6: Send full conversation history to GPT
      const conversationHistory = conversation.messages.map(msg => ({ 
        role: msg.role, 
        message: msg.message 
      }));

      console.log('[message] Sending to GPT with history length:', conversationHistory.length);
      
      const assistantResponse = await generateChatResponse(
        userMessage.message, 
        conversationHistory
      );

      console.log('[message] GPT response received:', { 
        responseLength: assistantResponse.length 
      });

      // Step 7: Save the assistant's reply
      const assistantMessage = {
        role: 'assistant' as const,
        message: assistantResponse,
        timestamp: new Date()
      };

      conversation.messages.push(assistantMessage);
      conversation.updatedAt = new Date();
      await conversation.save();

      // DISABLED: Insight processing removed
      // processInsightsPipeline(
      //   conversationId, 
      //   currentUser.userId, 
      //   assistantResponse,
      //   conversationHistory
      // ).catch(error => {
      //   console.error('Insight processing failed:', error);
      // });

      // Step 8: Return the assistant's reply to frontend
      return res.status(200).json({
        success: true,
        conversationId,
        userMessage,
        assistantMessage,
        message: 'Message processed successfully'
      });
    }

  } catch (error: unknown) {
    console.error('Error processing message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

