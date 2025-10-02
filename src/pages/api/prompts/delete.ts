import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Prompt } from '@/models/Prompt';
import { requireAdmin } from '@/utils/adminAuth';

/**
 * DELETE /api/prompts/delete
 * 
 * Deletes a prompt by ID. Requires admin authentication.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin authentication
  const isAdmin = await requireAdmin(req, res);
  if (!isAdmin) return;

  await connectDB();

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ 
        error: 'Prompt ID is required' 
      });
    }

    // Find and delete the prompt
    const deletedPrompt = await Prompt.findByIdAndDelete(id);

    if (!deletedPrompt) {
      return res.status(404).json({ 
        error: 'Prompt not found' 
      });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Prompt deleted successfully'
    });

  } catch (error: unknown) {
    console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) console.error(error.stack);
    
    return res.status(500).json({ 
      error: 'Failed to delete prompt. Please try again.' 
    });
  }
}
