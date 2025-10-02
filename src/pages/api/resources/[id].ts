import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import { requireAdmin } from '@/utils/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Resource ID is required' });
  }

  // Check admin authentication
  const adminUser = await requireAdmin(req, res);
  if (!adminUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectDB();

    if (req.method === 'PATCH') {
      const { status } = req.body;

      // Validate status
      const validStatuses = ['draft', 'live', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status. Must be one of: draft, live, archived' 
        });
      }

      const updatedResource = await Resource.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!updatedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      return res.status(200).json({
        success: true,
        resource: updatedResource,
        message: 'Resource status updated successfully'
      });
    }

    if (req.method === 'DELETE') {
      const deletedResource = await Resource.findByIdAndDelete(id);

      if (!deletedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Resource deleted successfully'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error: unknown) {
    console.error('Resource API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });

    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}