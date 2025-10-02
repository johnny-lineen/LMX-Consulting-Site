import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Prompt } from '@/models/Prompt';
import { requireAdmin } from '@/utils/adminAuth';

/**
 * POST /api/prompts/create
 * 
 * Creates a new prompt. Requires admin authentication.
 * Validates all required fields and handles tag processing.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin authentication
  const isAdmin = await requireAdmin(req, res);
  if (!isAdmin) return;

  await connectDB();

  try {
    const { title, description, category, tags, prompt } = req.body;

    // Validate required fields
    if (!title || !description || !category || !prompt) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, category, and prompt are required' 
      });
    }

    // Process tags (split by comma and clean)
    const processedTags = tags 
      ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      : [];

    // Create prompt
    const newPrompt = await Prompt.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      tags: processedTags,
      prompt: prompt.trim(),
    });

    return res.status(201).json({ 
      success: true, 
      prompt: newPrompt,
      message: 'Prompt created successfully'
    });

  } catch (error: unknown) {
    console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) console.error(error.stack);
    
    // Return clean error message to UI
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Invalid prompt data. Please check all fields and try again.' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to create prompt. Please try again.' 
    });
  }
}
