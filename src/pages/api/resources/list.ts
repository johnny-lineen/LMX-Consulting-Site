import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource, IResource } from '@/models/Resource';
import { getCoverImage } from '@/lib/coverImageHelper';
import { ResourceQuery } from '@/types/api';
import { PublicResource } from '@/types/resource';
import { enumToLabel } from '@/lib/resourceTypeMapper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { type, category, tags, status, limit } = req.query;

    // Build query - only show live resources by default for public access
    const query: ResourceQuery = {
      status: 'live' // Only show live resources to public
    };

    if (type) {
      // Normalize type to string (query params can be string or string[])
      query.type = Array.isArray(type) ? type[0] : type;
    }

    if (category) {
      // Normalize category to string
      query.category = Array.isArray(category) ? category[0] : category;
    }

    if (tags) {
      // Normalize tags to string array
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Allow status override for admin access (check for admin token in headers)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // If admin token provided, allow filtering by status
      if (status) {
        query.status = Array.isArray(status) ? status[0] : status;
      }
    }

    // Fetch resources (exclude admin-only fields)
    const resources = await Resource.find(query)
      .select('-folderPath -__v') // Exclude admin-only fields
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit as string) : 100)
      .lean<IResource[]>();

    // Transform for public consumption
    const publicResources: PublicResource[] = resources.map((resource: IResource) => ({
      id: resource._id,
      title: resource.title,
      description: resource.description,
      type: resource.type, // Keep as enum value for consistency
      slug: resource.slug,
      category: resource.category,
      fileUrl: resource.fileUrl || resource.filePath, // Use fileUrl if available, fallback to filePath for scanned resources
      coverImage: getCoverImage(resource.coverImage, resource.mainFile), // Type-specific or custom
      images: resource.images || [],
      tags: resource.tags,
      gated: resource.gated,
      status: resource.status,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
    }));

    return res.status(200).json({
      success: true,
      count: publicResources.length,
      resources: publicResources,
    });

  } catch (error: unknown) {
    console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) console.error(error.stack);
    return res.status(500).json({ 
      error: 'Failed to fetch resources',
      details: 'Internal server error'
    });
  }
}
