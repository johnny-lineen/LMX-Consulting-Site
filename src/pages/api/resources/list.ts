import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import { getCoverImage } from '@/lib/coverImageHelper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { type, tags, limit } = req.query;

    // Build query
    let query: any = {};

    if (type) {
      query.type = type;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Fetch resources (exclude admin-only fields)
    const resources = await Resource.find(query)
      .select('-folderPath -__v') // Exclude admin-only fields
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit as string) : 100)
      .lean();

    // Transform for public consumption
    const publicResources = resources.map(resource => ({
      id: resource._id,
      title: resource.title,
      description: resource.description,
      tags: resource.tags,
      type: resource.type,
      slug: resource.slug,
      mainFile: resource.mainFile,
      coverImage: getCoverImage(resource.coverImage, resource.mainFile), // Type-specific or custom
      images: resource.images || [],
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      count: publicResources.length,
      resources: publicResources,
    });

  } catch (error: any) {
    console.error('List resources error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch resources',
      details: error.message 
    });
  }
}
