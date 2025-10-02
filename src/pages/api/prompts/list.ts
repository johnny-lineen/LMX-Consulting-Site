import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Prompt, IPrompt } from '@/models/Prompt';

/**
 * GET /api/prompts/list
 * 
 * Retrieves all prompts with optional filtering by category and search.
 * Supports both public access and admin access with different filtering options.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { category, search, limit } = req.query;

    // Build query object
    const query: any = {};

    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = Array.isArray(category) ? category[0] : category;
    }

    // Text search if provided
    if (search) {
      const searchTerm = Array.isArray(search) ? search[0] : search;
      query.$text = { $search: searchTerm };
    }

    // Fetch prompts
    const prompts = await Prompt.find(query)
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit as string) : 100)
      .lean<IPrompt[]>();

    return res.status(200).json({
      success: true,
      count: prompts.length,
      prompts: prompts.map((prompt: IPrompt) => ({
        id: prompt._id,
        title: prompt.title,
        description: prompt.description,
        category: prompt.category,
        tags: prompt.tags,
        prompt: prompt.prompt,
        createdAt: prompt.createdAt.toISOString(),
        updatedAt: prompt.updatedAt.toISOString(),
      })),
    });

  } catch (error: unknown) {
    console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) console.error(error.stack);
    return res.status(500).json({ 
      error: 'Failed to fetch prompts',
      details: 'Internal server error'
    });
  }
}
