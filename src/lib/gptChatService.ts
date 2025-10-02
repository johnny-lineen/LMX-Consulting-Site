import { config } from './config';

const OPENAI_API_KEY = config.ai.openaiApiKey;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Generate GPT response for chat messages
 */
export async function generateChatResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; message: string }>
): Promise<string> {
  try {
    // Convert conversation history to GPT format
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are Clarity, an expert business consultant AI assistant. You help entrepreneurs and business owners with:

- Business growth strategies
- Marketing and sales advice
- Operational efficiency
- Technology implementation
- Goal setting and planning
- Problem-solving and decision making

Guidelines:
- Be conversational, friendly, and professional
- Ask clarifying questions to better understand their situation
- Provide actionable, practical advice
- Keep responses concise but comprehensive
- Use examples when helpful
- Focus on their specific business context

Always maintain a helpful, encouraging tone while being direct about challenges and opportunities.`
      },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.message
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI API');
    }

    return content.trim();

  } catch (error) {
    console.error('Error generating chat response with GPT:', error);
    
    // Fallback to simple responses if GPT fails
    return generateFallbackResponse(userMessage);
  }
}

/**
 * Generate fallback response when GPT is unavailable
 */
function generateFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm Clarity, your AI business consultant. I'm here to help you grow your business and solve challenges. What would you like to work on today?";
  }

  if (message.includes('help') || message.includes('support')) {
    return "I'm here to help you with your business needs! I can assist with growth strategies, marketing advice, operational efficiency, and more. What specific area would you like to focus on?";
  }

  if (message.includes('grow') || message.includes('growth') || message.includes('scale')) {
    return "Growing your business is exciting! To give you the best advice, can you tell me more about your current business model, target audience, and what growth challenges you're facing?";
  }

  if (message.includes('marketing') || message.includes('advertising') || message.includes('promotion')) {
    return "Marketing is crucial for business success! I'd love to help you develop effective marketing strategies. What's your current marketing approach, and what results are you seeing?";
  }

  if (message.includes('revenue') || message.includes('income') || message.includes('profit') || message.includes('money')) {
    return "Financial growth is a key business goal! To help you increase revenue, I need to understand your current business model, pricing strategy, and target market. What's your current revenue situation?";
  }

  if (message.includes('problem') || message.includes('issue') || message.includes('challenge') || message.includes('struggle')) {
    return "I understand you're facing some challenges. That's completely normal in business! Let's work through this together. Can you describe the main problem you're dealing with?";
  }

  if (message.includes('goal') || message.includes('objective') || message.includes('target') || message.includes('aim')) {
    return "Setting clear goals is the foundation of business success! I'd love to help you define and achieve your objectives. What specific goals are you working towards?";
  }

  if (message.includes('team') || message.includes('staff') || message.includes('employee') || message.includes('hiring')) {
    return "Building the right team is essential for scaling your business! Whether you're looking to hire, manage, or develop your team, I can help. What team-related challenges are you facing?";
  }

  if (message.includes('technology') || message.includes('tech') || message.includes('software') || message.includes('automation')) {
    return "Technology can be a game-changer for your business! From automation to digital tools, there are many ways to leverage tech for growth. What technology challenges or opportunities are you considering?";
  }

  if (message.includes('customer') || message.includes('client') || message.includes('user') || message.includes('audience')) {
    return "Understanding and serving your customers is key to business success! I can help you with customer acquisition, retention, and satisfaction strategies. What's your current customer situation?";
  }

  // Default response
  return "That's a great question! I'm here to help you with your business challenges and opportunities. To give you the most relevant advice, could you tell me more about your specific situation and what you're hoping to achieve?";
}
