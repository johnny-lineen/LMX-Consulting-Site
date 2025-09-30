import { connectDB } from '@/lib/mongodb';
import { ConversationInsights, IConversationInsights } from '@/models/ConvoInsights';
import { UserInsights, IUserInsights } from '@/models/UserInsights';
import { extractInsightsWithGPT } from './gptInsightExtractor';

/**
 * Process insights for a conversation message
 * 1. Extract insights using GPT
 * 2. Save to ConversationInsights
 * 3. Merge into UserInsights with deduplication
 */
export async function processInsightsPipeline(
  conversationId: string,
  userId: string,
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; message: string }>
): Promise<void> {
  try {
    console.log(`🔍 Processing insights for conversation ${conversationId}`);

    // Extract insights using GPT
    const insights = await extractInsightsWithGPT(message, conversationHistory);
    
    // Check if any insights were extracted
    const hasInsights = Object.values(insights).some(array => Array.isArray(array) && array.length > 0);
    
    if (!hasInsights) {
      console.log('No insights extracted from message');
      return;
    }

    console.log(`✅ Extracted insights for conversation ${conversationId}`);

    // Save to ConversationInsights
    await saveConversationInsights(conversationId, userId, insights);

    // Merge into UserInsights
    await mergeUserInsights(userId, insights);

    console.log(`✅ Successfully processed insights for conversation ${conversationId}`);

  } catch (error) {
    console.error('❌ Error in insight pipeline:', error);
    // Don't throw error to avoid breaking the conversation flow
  }
}

/**
 * Save insights to ConversationInsights collection
 */
async function saveConversationInsights(
  conversationId: string,
  userId: string,
  insights: Partial<IConversationInsights>
): Promise<void> {
  try {
    await connectDB();

    await ConversationInsights.findOneAndUpdate(
      { conversationId, userId },
      {
        $set: {
          ...insights,
          conversationId,
          userId,
          updatedAt: new Date()
        },
        $setOnInsert: { 
          createdAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Saved insights to ConversationInsights for conversation ${conversationId}`);
  } catch (error) {
    console.error('❌ Error saving conversation insights:', error);
    throw error;
  }
}

/**
 * Merge insights into UserInsights collection with deduplication
 */
async function mergeUserInsights(
  userId: string,
  insights: Partial<IConversationInsights>
): Promise<void> {
  try {
    await connectDB();

    // Get or create user insights document
    let userInsightsDoc = await UserInsights.findOne({ userId });

    if (!userInsightsDoc) {
      // Create new user insights document
      userInsightsDoc = new UserInsights({
        userId,
        advice: insights.advice || [],
        bottlenecks: insights.bottlenecks || [],
        context: insights.context || [],
        goals: insights.goals || [],
        ideas: insights.ideas || [],
        questions: insights.questions || [],
        strategies: insights.strategies || [],
        tags: insights.tags || [],
        confidenceScore: insights.confidenceScore || 0.5,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await userInsightsDoc.save();
      console.log(`✅ Created new UserInsights document for user ${userId}`);
    } else {
      // Merge with existing insights, deduplicating similar content
      const mergedInsights = mergeInsightsWithDeduplication(userInsightsDoc, insights);
      
      await UserInsights.findOneAndUpdate(
        { userId },
        {
          $set: {
            ...mergedInsights,
            updatedAt: new Date()
          }
        },
        { new: true }
      );
      console.log(`✅ Merged insights into UserInsights for user ${userId}`);
    }

  } catch (error) {
    console.error('❌ Error merging user insights:', error);
    throw error;
  }
}

/**
 * Merge insights with deduplication
 */
function mergeInsightsWithDeduplication(
  existingDoc: IUserInsights,
  newInsights: Partial<IConversationInsights>
): Partial<IConversationInsights> {
  const merged: Partial<IConversationInsights> = {};

  // Merge each category with deduplication
  const categories = ['advice', 'bottlenecks', 'context', 'goals', 'ideas', 'questions', 'strategies', 'tags'] as const;
  
  categories.forEach(category => {
    const existing = existingDoc[category] || [];
    const newItems = newInsights[category] || [];
    
    // Deduplicate by checking similarity
    const uniqueNewItems = newItems.filter(newItem => 
      !existing.some(existingItem => 
        isSimilarContent(existingItem, newItem)
      )
    );
    
    merged[category] = [...existing, ...uniqueNewItems];
  });

  // Update confidence score (average of existing and new)
  const existingConfidence = existingDoc.confidenceScore || 0.5;
  const newConfidence = newInsights.confidenceScore || 0.5;
  merged.confidenceScore = (existingConfidence + newConfidence) / 2;

  return merged;
}

/**
 * Check if two pieces of content are similar (simple similarity check)
 */
function isSimilarContent(content1: string, content2: string): boolean {
  const words1 = content1.toLowerCase().split(/\s+/);
  const words2 = content2.toLowerCase().split(/\s+/);
  
  const commonWords = words1.filter(word => words2.includes(word));
  const similarity = commonWords.length / Math.max(words1.length, words2.length);
  
  return similarity > 0.7; // 70% similarity threshold
}