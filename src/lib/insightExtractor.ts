import { ConversationInsights } from '@/models/ConversationInsights';
import { UserInsights } from '@/models/UserInsights';
import { connectDB } from '@/lib/mongodb';

export interface IInsight {
  type: 'goal' | 'preference' | 'constraint' | 'context';
  content: string;
  sourceMessage: string;
  createdAt: Date;
}

export interface IUserInsight {
  type: 'goal' | 'preference' | 'constraint' | 'context';
  content: string;
  sourceConversationId: string;
  createdAt: Date;
  priority?: number;
  tags?: string[];
  confidenceScore?: number;
}

/**
 * Extract insights from a conversation message
 * This is a simplified version - in production, you'd use AI/ML services
 */
export function extractInsightsFromMessage(message: string, role: 'user' | 'assistant'): IInsight[] {
  const insights: IInsight[] = [];
  const lowerMessage = message.toLowerCase();

  // Simple keyword-based extraction (replace with AI service in production)
  const goalKeywords = ['want', 'need', 'goal', 'objective', 'aim', 'target', 'achieve'];
  const preferenceKeywords = ['prefer', 'like', 'favorite', 'better', 'rather', 'instead'];
  const constraintKeywords = ['cannot', 'can\'t', 'unable', 'restriction', 'limit', 'budget', 'time'];
  const contextKeywords = ['currently', 'now', 'situation', 'context', 'background', 'environment'];

  // Extract goals
  if (goalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.push({
      type: 'goal',
      content: extractRelevantContent(message, goalKeywords),
      sourceMessage: message,
      createdAt: new Date()
    });
  }

  // Extract preferences
  if (preferenceKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.push({
      type: 'preference',
      content: extractRelevantContent(message, preferenceKeywords),
      sourceMessage: message,
      createdAt: new Date()
    });
  }

  // Extract constraints
  if (constraintKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.push({
      type: 'constraint',
      content: extractRelevantContent(message, constraintKeywords),
      sourceMessage: message,
      createdAt: new Date()
    });
  }

  // Extract context
  if (contextKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.push({
      type: 'context',
      content: extractRelevantContent(message, contextKeywords),
      sourceMessage: message,
      createdAt: new Date()
    });
  }

  return insights;
}

/**
 * Extract relevant content around keywords
 */
function extractRelevantContent(message: string, keywords: string[]): string {
  const sentences = message.split(/[.!?]+/);
  const relevantSentences = sentences.filter(sentence => 
    keywords.some(keyword => sentence.toLowerCase().includes(keyword))
  );
  
  return relevantSentences.join('. ').trim() || message.substring(0, 100) + '...';
}

/**
 * Save insights to conversation insights collection
 */
export async function saveConversationInsights(
  conversationId: string, 
  insights: IInsight[]
): Promise<void> {
  try {
    await connectDB();

    if (insights.length === 0) return;

    await ConversationInsights.findOneAndUpdate(
      { conversationId },
      {
        $push: { insights: { $each: insights } },
        $setOnInsert: { conversationId }
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Saved ${insights.length} insights for conversation ${conversationId}`);
  } catch (error) {
    console.error('❌ Error saving conversation insights:', error);
    throw error;
  }
}

/**
 * Merge insights into user insights collection with deduplication
 */
export async function mergeUserInsights(
  userId: string,
  conversationId: string,
  insights: IInsight[]
): Promise<void> {
  try {
    await connectDB();

    if (insights.length === 0) return;

    // Convert conversation insights to user insights
    const userInsights: IUserInsight[] = insights.map(insight => ({
      type: insight.type,
      content: insight.content,
      sourceConversationId: conversationId,
      createdAt: insight.createdAt,
      priority: 0,
      confidenceScore: 0.5
    }));

    // Get existing user insights
    let userInsightsDoc = await UserInsights.findOne({ userId });

    if (!userInsightsDoc) {
      // Create new user insights document
      userInsightsDoc = new UserInsights({
        userId,
        insights: userInsights
      });
      await userInsightsDoc.save();
    } else {
      // Merge with existing insights, deduplicating similar content
      const existingInsights = userInsightsDoc.insights;
      const newInsights = userInsights.filter(newInsight => 
        !existingInsights.some(existingInsight => 
          existingInsight.type === newInsight.type && 
          isSimilarContent(existingInsight.content, newInsight.content)
        )
      );

      if (newInsights.length > 0) {
        userInsightsDoc.insights.push(...newInsights);
        await userInsightsDoc.save();
      }
    }

    console.log(`✅ Merged ${userInsights.length} insights for user ${userId}`);
  } catch (error) {
    console.error('❌ Error merging user insights:', error);
    throw error;
  }
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

/**
 * Process insights for a conversation
 */
export async function processInsights(
  conversationId: string,
  userId: string,
  message: string,
  role: 'user' | 'assistant'
): Promise<void> {
  try {
    // Extract insights from the message
    const insights = extractInsightsFromMessage(message, role);
    
    if (insights.length === 0) return;

    // Save to conversation insights
    await saveConversationInsights(conversationId, insights);

    // Merge into user insights
    await mergeUserInsights(userId, conversationId, insights);

    console.log(`✅ Processed ${insights.length} insights for conversation ${conversationId}`);
  } catch (error) {
    console.error('❌ Error processing insights:', error);
    // Don't throw error to avoid breaking the conversation flow
  }
}
