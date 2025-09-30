import { NextApiRequest, NextApiResponse } from 'next';
import { processInsightsPipeline } from '@/lib/insightPipeline';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { conversationId, userId, message, conversationHistory } = req.body;

    if (!conversationId || !userId || !message) {
      return res.status(400).json({ error: 'conversationId, userId, and message are required' });
    }

    // Test the insight pipeline
    await processInsightsPipeline(
      conversationId,
      userId,
      message,
      conversationHistory || []
    );

    return res.status(200).json({
      success: true,
      message: 'Insight pipeline test completed successfully'
    });

  } catch (error: unknown) {
    console.error('Error testing insight pipeline:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
