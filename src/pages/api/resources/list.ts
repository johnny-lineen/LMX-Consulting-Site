import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource, IResource } from '@/models/Resource';
import { getCoverImage } from '@/lib/coverImageHelper';
import { ResourceQuery } from '@/types/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { type, tags, limit } = req.query;

    // Build query
    const query: ResourceQuery = {};

    if (type) {
      // Normalize type to string (query params can be string or string[])
      query.type = Array.isArray(type) ? type[0] : type;
    }

    if (tags) {
      // Normalize tags to string array
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Fetch resources (exclude admin-only fields)
    const resources = await Resource.find(query)
      .select('-folderPath -__v') // Exclude admin-only fields
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit as string) : 100)
      .lean<IResource[]>();

    // Transform for public consumption
    const publicResources = resources.map((resource: IResource) => ({
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

  } catch (error: unknown) {
    console.error('List resources error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch resources',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
