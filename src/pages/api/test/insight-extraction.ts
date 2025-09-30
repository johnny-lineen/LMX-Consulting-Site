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

    // Test the insight extraction
    const insights = await extractInsightsWithGPT(
      message,
      conversationHistory || []
    );

    return res.status(200).json({
      success: true,
      message: 'Insight extraction test completed',
      insights,
      count: insights.length
    });

  } catch (error: unknown) {
    console.error('Error testing insight extraction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
