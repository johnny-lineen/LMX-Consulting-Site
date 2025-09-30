import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Conversation } from '@/models/Conversation';
import { ConversationInsights } from '@/models/ConvoInsights';
import { UserInsights } from '@/models/UserInsights';
import { processInsightsPipeline } from '@/lib/insightPipeline';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, conversationId } = req.body;

    if (!userId || !conversationId) {
      return res.status(400).json({ error: 'userId and conversationId are required' });
    }

    await connectDB();

    // Test 1: Check if conversation exists
    const conversation = await Conversation.findOne({ conversationId, userId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Test 2: Check conversation insights
    const conversationInsights = await ConversationInsights.findOne({ conversationId, userId });
    
    // Test 3: Check user insights
    const userInsights = await UserInsights.findOne({ userId });

    // Test 4: Simulate insight extraction
    const testMessage = "I want to build a task management bot but I have no coding experience";
    const testHistory = [
      { role: 'user', message: 'Hi, I need help with automation' },
      { role: 'assistant', message: 'I\'d be happy to help! What specific tasks are you looking to automate?' }
    ];

    // Test the pipeline
    await processInsightsPipeline(conversationId, userId, testMessage, testHistory);

    // Check if insights were created/updated
    const updatedConversationInsights = await ConversationInsights.findOne({ conversationId, userId });
    const updatedUserInsights = await UserInsights.findOne({ userId });

    return res.status(200).json({
      success: true,
      message: 'Complete pipeline test completed',
      results: {
        conversation: {
          exists: !!conversation,
          messageCount: conversation?.messages?.length || 0,
          conversationId: conversation?.conversationId
        },
        conversationInsights: {
          exists: !!conversationInsights,
          hasInsights: !!updatedConversationInsights,
          categories: updatedConversationInsights ? Object.keys(updatedConversationInsights.toObject()).filter(key => 
            Array.isArray(updatedConversationInsights[key]) && updatedConversationInsights[key].length > 0
          ) : []
        },
        userInsights: {
          exists: !!userInsights,
          hasInsights: !!updatedUserInsights,
          categories: updatedUserInsights ? Object.keys(updatedUserInsights.toObject()).filter(key => 
            Array.isArray(updatedUserInsights[key]) && updatedUserInsights[key].length > 0
          ) : []
        },
        pipeline: {
          testMessage,
          testHistory,
          processed: true
        }
      }
    });

  } catch (error: unknown) {
    console.error('Error testing complete pipeline:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
