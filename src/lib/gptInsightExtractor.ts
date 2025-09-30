import { IConversationInsights } from '@/models/ConvoInsights';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

export interface GPTInsightResponse {
  advice: string[];
  bottlenecks: string[];
  context: string[];
  goals: string[];
  ideas: string[];
  questions: string[];
  strategies: string[];
  tags: string[];
}

/**
 * Extract insights from assistant messages using GPT
 */
export async function extractInsightsWithGPT(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; message: string }>
): Promise<Partial<IConversationInsights>> {
  try {
    const prompt = buildInsightExtractionPrompt(message, conversationHistory);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business consultant who extracts key insights from conversations. Analyze the provided message and conversation context to identify goals, preferences, constraints, and context information. Return only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI API');
    }

    // Parse the JSON response
    const parsedResponse: GPTInsightResponse = JSON.parse(content);
    
    // Return the structured insights
    return {
      advice: parsedResponse.advice || [],
      bottlenecks: parsedResponse.bottlenecks || [],
      context: parsedResponse.context || [],
      goals: parsedResponse.goals || [],
      ideas: parsedResponse.ideas || [],
      questions: parsedResponse.questions || [],
      strategies: parsedResponse.strategies || [],
      tags: parsedResponse.tags || [],
      confidenceScore: 0.8 // Default confidence score
    };

  } catch (error) {
    console.error('Error extracting insights with GPT:', error);
    
    // Fallback to simple keyword-based extraction
    return extractInsightsFallback(message);
  }
}

/**
 * Build the prompt for GPT insight extraction
 */
function buildInsightExtractionPrompt(
  message: string, 
  conversationHistory: Array<{ role: 'user' | 'assistant'; message: string }>
): string {
  const historyContext = conversationHistory
    .slice(-5) // Last 5 messages for context
    .map(msg => `${msg.role}: ${msg.message}`)
    .join('\n');

  return `
You are an insight extractor. Analyze the following conversation and return JSON.

Categories: advice, bottlenecks, context, goals, ideas, questions, strategies, tags.

Rules:
- Extract short, clear insights (1–2 sentences).
- Deduplicate: do not repeat the same idea in different words.
- Return arrays of strings for each category.

Conversation to analyze:
${historyContext}

Assistant message: "${message}"

Extract insights and categorize them as:
- "goals": What the user explicitly wants to achieve (e.g., "Grow my LinkedIn audience", "Build a task management bot")
- "questions": Questions the user may need to explore further (e.g., "What tools could automate this?", "How to integrate with existing systems?")
- "ideas": Ideas or opportunities hinted at (e.g., "Maybe explore Notion integration", "Consider AI automation")
- "context": Information about the user's situation, role, background (e.g., "User is a college student", "Working on LMX project")
- "bottlenecks": Limitations, blockers, or challenges mentioned (e.g., "Has no coding experience", "Needs to keep cost low")
- "advice": Recommendations or guidance given (e.g., "Start with a small pilot", "Track performance metrics")
- "strategies": Strategic approaches or methods discussed (e.g., "Agile development approach", "Phased implementation")
- "tags": Relevant keywords or tags (e.g., "automation", "AI", "business integration")

Return only valid JSON in this format:
{
  "advice": ["...", "..."],
  "bottlenecks": ["...", "..."],
  "context": ["...", "..."],
  "goals": ["...", "..."],
  "ideas": ["...", "..."],
  "questions": ["...", "..."],
  "strategies": ["...", "..."],
  "tags": ["...", "..."]
}
`;
}

/**
 * Fallback insight extraction using keyword matching
 */
function extractInsightsFallback(message: string): Partial<IConversationInsights> {
  const lowerMessage = message.toLowerCase();
  const insights: Partial<IConversationInsights> = {
    advice: [],
    bottlenecks: [],
    context: [],
    goals: [],
    ideas: [],
    questions: [],
    strategies: [],
    tags: [],
    confidenceScore: 0.3
  };

  // Goals keywords
  const goalKeywords = ['want', 'need', 'goal', 'objective', 'aim', 'target', 'achieve', 'accomplish', 'strive', 'grow', 'build', 'create'];
  if (goalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.goals?.push(extractRelevantContent(message, goalKeywords));
  }

  // Questions keywords
  const questionKeywords = ['what', 'how', 'could', 'maybe', 'explore', 'consider', 'think', 'wonder', 'question'];
  if (questionKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.questions?.push(extractRelevantContent(message, questionKeywords));
  }

  // Ideas keywords
  const ideaKeywords = ['idea', 'suggestion', 'recommendation', 'proposal', 'solution'];
  if (ideaKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.ideas?.push(extractRelevantContent(message, ideaKeywords));
  }

  // Context keywords
  const contextKeywords = ['currently', 'now', 'situation', 'context', 'background', 'environment', 'team', 'company', 'organization', 'student', 'working', 'role'];
  if (contextKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.context?.push(extractRelevantContent(message, contextKeywords));
  }

  // Bottlenecks/Constraints keywords
  const bottleneckKeywords = ['cannot', 'can\'t', 'unable', 'restriction', 'limit', 'budget', 'time', 'deadline', 'constraint', 'no experience', 'low cost', 'blocked', 'stuck'];
  if (bottleneckKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.bottlenecks?.push(extractRelevantContent(message, bottleneckKeywords));
  }

  // Advice keywords
  const adviceKeywords = ['should', 'recommend', 'suggest', 'advise', 'tip', 'help', 'guidance'];
  if (adviceKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.advice?.push(extractRelevantContent(message, adviceKeywords));
  }

  // Strategy keywords
  const strategyKeywords = ['strategy', 'plan', 'approach', 'method', 'process', 'framework'];
  if (strategyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    insights.strategies?.push(extractRelevantContent(message, strategyKeywords));
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
  
  return relevantSentences.join('. ').trim() || message.substring(0, 150) + '...';
}