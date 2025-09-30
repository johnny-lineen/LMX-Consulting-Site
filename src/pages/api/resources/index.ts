import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { category, tags } = req.query;
      
      let query: any = {};
      
      if (category) {
        query.category = category;
      }
      
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.tags = { $in: tagArray };
      }

      const resources = await Resource.find(query)
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({ resources });
    } catch (error: unknown) {
      console.error('Error fetching resources:', error);
      return res.status(500).json({ error: 'Failed to fetch resources' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
