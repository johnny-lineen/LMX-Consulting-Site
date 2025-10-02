import { NextApiRequest, NextApiResponse } from 'next';
import { extractInsightsWithGPT } from '@/lib/gptInsightExtractor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Test the new insight extraction
    const insights = await extractInsightsWithGPT(
      message,
      conversationHistory || []
    );

    // Check if any insights were extracted
    const hasInsights = Object.values(insights).some(array => Array.isArray(array) && array.length > 0);
    
    if (!hasInsights) {
      return res.status(200).json({
        success: true,
        message: 'No insights extracted',
        insights: insights,
        count: 0
      });
    }

    // Count total insights
    const totalInsights = Object.values(insights).reduce((total: number, array: any) => {
      return total + (Array.isArray(array) ? array.length : 0);
    }, 0);

    return res.status(200).json({
      success: true,
      message: 'Insight extraction test completed',
      insights: insights,
      count: totalInsights,
      categories: Object.keys(insights).filter(key => 
        Array.isArray((insights as any)[key]) && (insights as any)[key].length > 0
      )
    });

  } catch (error: unknown) {
    console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) console.error(error.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
