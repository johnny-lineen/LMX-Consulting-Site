import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Conversation } from '@/models/Conversation';
import { getCurrentUser } from '@/utils/auth';
import { randomUUID } from 'crypto';

/**
 * POST /api/conversation/start
 * 
 * Creates a new conversation for the authenticated user
 * 
 * Returns:
 * - 201: Conversation created successfully
 * - 401: Authentication required
 * - 405: Method not allowed
 * - 500: Server error with detailed message
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Step 1: Validate HTTP method
  if (req.method !== 'POST') {
    console.warn(`[conversation/start] Invalid method: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[conversation/start] Starting conversation creation...');

    // Step 2: Authenticate user
    console.log('[conversation/start] Checking authentication...');
    const currentUser = getCurrentUser(req);
    
    if (!currentUser) {
      console.warn('[conversation/start] Authentication failed - no user found');
      return res.status(401).json({ 
        error: 'Authentication required',
        details: 'No valid authentication token found. Please log in.'
      });
    }

    console.log('[conversation/start] User authenticated:', {
      userId: currentUser.userId,
      email: currentUser.email
    });

    // Step 3: Validate userId exists
    if (!currentUser.userId) {
      console.error('[conversation/start] userId is missing from token');
      return res.status(400).json({ 
        error: 'Invalid authentication token',
        details: 'userId is missing from authentication token'
      });
    }

    // Step 4: Connect to MongoDB
    console.log('[conversation/start] Connecting to MongoDB...');
    try {
      await connectDB();
      console.log('[conversation/start] MongoDB connected successfully');
    } catch (dbError: any) {
      console.error('[conversation/start] MongoDB connection failed:', dbError);
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: dbError.message || 'Could not connect to MongoDB'
      });
    }

    // Step 5: Generate unique IDs
    const conversationId = randomUUID();
    const sessionId = randomUUID();
    
    console.log('[conversation/start] Generated IDs:', {
      conversationId,
      sessionId,
      userId: currentUser.userId
    });

    // Step 6: Validate all required fields before creating conversation
    if (!conversationId || !sessionId || !currentUser.userId) {
      console.error('[conversation/start] Missing required fields:', {
        hasConversationId: !!conversationId,
        hasSessionId: !!sessionId,
        hasUserId: !!currentUser.userId
      });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          conversationId: conversationId ? 'present' : 'missing',
          sessionId: sessionId ? 'present' : 'missing',
          userId: currentUser.userId ? 'present' : 'missing'
        }
      });
    }

    // Step 7: Create conversation object
    console.log('[conversation/start] Creating conversation document...');
    const conversationData = {
      conversationId,
      sessionId,
      userId: currentUser.userId,
      messages: [
        {
          role: 'assistant' as const,
          message: "Hello! I'm Clarity, your AI business consultant. I'm here to help you grow your business, solve challenges, and achieve your goals. How can I assist you today?",
          timestamp: new Date()
        }
      ],
      createdAt: new Date()
    };

    console.log('[conversation/start] Conversation data prepared:', {
      conversationId: conversationData.conversationId,
      sessionId: conversationData.sessionId,
      userId: conversationData.userId,
      messageCount: conversationData.messages.length
    });

    let conversation;
    try {
      conversation = new Conversation(conversationData);
      console.log('[conversation/start] Conversation instance created');
    } catch (modelError: any) {
      console.error('[conversation/start] Error creating Conversation model:', modelError);
      return res.status(500).json({ 
        error: 'Failed to create conversation model',
        details: modelError.message || 'Invalid conversation data'
      });
    }

    // Step 8: Save to MongoDB
    console.log('[conversation/start] Saving conversation to database...');
    try {
      await conversation.save();
      console.log('[conversation/start] Conversation saved successfully:', conversation._id);
    } catch (saveError: any) {
      console.error('[conversation/start] Error saving conversation:', saveError);
      
      // Check for specific MongoDB errors
      if (saveError.code === 11000) {
        console.error('[conversation/start] Duplicate key error:', saveError.keyPattern);
        return res.status(409).json({ 
          error: 'Duplicate conversation detected',
          details: `A conversation with this ${Object.keys(saveError.keyPattern)[0]} already exists`,
          keyPattern: saveError.keyPattern
        });
      }
      
      if (saveError.name === 'ValidationError') {
        console.error('[conversation/start] Validation error:', saveError.errors);
        return res.status(400).json({ 
          error: 'Conversation validation failed',
          details: Object.keys(saveError.errors).map(key => ({
            field: key,
            message: saveError.errors[key].message
          }))
        });
      }

      return res.status(500).json({ 
        error: 'Failed to save conversation',
        details: saveError.message || 'Unknown database error'
      });
    }

    // Step 9: Return success response
    console.log('[conversation/start] Conversation created successfully');
    return res.status(201).json({
      success: true,
      conversationId,
      sessionId,
      conversation: {
        conversationId: conversation.conversationId,
        sessionId: conversation.sessionId,
        userId: conversation.userId,
        messages: conversation.messages,
        createdAt: conversation.createdAt
      },
      message: 'Conversation started successfully'
    });

  } catch (error: any) {
    // Catch-all error handler
    console.error('[conversation/start] Unexpected error:', error);
    console.error('[conversation/start] Error stack:', error.stack);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message || 'An unexpected error occurred',
      type: error.name || 'UnknownError'
    });
  }
}