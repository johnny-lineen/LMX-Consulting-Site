import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import { requireAdmin } from '@/utils/adminAuth';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid resource ID' });
  }

  if (req.method === 'GET') {
    try {
      const resource = await Resource.findById(id).lean();

      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      return res.status(200).json({ resource });
    } catch (error: unknown) {
      console.error('Error fetching resource:', error);
      return res.status(500).json({ error: 'Failed to fetch resource' });
    }
  }

  if (req.method === 'DELETE') {
    // Check admin authentication
    const isAdmin = await requireAdmin(req, res);
    if (!isAdmin) return;

    try {
      const resource = await Resource.findById(id);

      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      // Delete the file from filesystem
      const filePath = path.join(process.cwd(), 'public', resource.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      await Resource.findByIdAndDelete(id);

      return res.status(200).json({ success: true, message: 'Resource deleted' });
    } catch (error: unknown) {
      console.error('Error deleting resource:', error);
      return res.status(500).json({ error: 'Failed to delete resource' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
