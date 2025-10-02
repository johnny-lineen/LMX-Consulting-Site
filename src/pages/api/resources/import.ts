import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import { requireAdmin } from '@/utils/adminAuth';
import { normalizeTypeValue, isValidTypeValue, getTypeValidationError } from '@/lib/resourceTypeMapper';
import fs from 'fs';
import path from 'path';

// Disable body parser to handle form data
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin authentication
  const isAdmin = await requireAdmin(req, res);
  if (!isAdmin) return;

  await connectDB();

  try {
    const { 
      title, 
      description, 
      type, 
      category, 
      tags, 
      gated, 
      status, 
      sourceFilePath, 
      sourceCoverPath 
    } = req.body;

    // Validate required fields
    if (!title || !description || !type || !sourceFilePath) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, type, and sourceFilePath are required' 
      });
    }

    // Normalize and validate type for scanned files
    const normalizedType = normalizeTypeValue(type);
    if (!isValidTypeValue(type)) {
      console.error('Invalid type value in import:', { originalType: type, normalizedType });
      return res.status(400).json({ 
        error: getTypeValidationError()
      });
    }
    
    // Use the normalized type
    const finalType = normalizedType;

    // Validate source file exists
    if (!fs.existsSync(sourceFilePath)) {
      return res.status(400).json({ error: 'Source file not found' });
    }

    // Create type directory if it doesn't exist
    const typeDir = path.join(process.cwd(), 'public', 'resources', finalType);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }

    // Generate unique filename for main file
    const timestamp = Date.now();
    const originalName = path.basename(sourceFilePath);
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `${sanitizedBaseName}_${timestamp}${ext}`;
    const destFilePath = path.join(typeDir, filename);

    // Copy main file to destination
    fs.copyFileSync(sourceFilePath, destFilePath);

    const resourceFilePath = `/resources/${finalType}/${filename}`;

    // Handle optional cover image
    let coverImagePath: string | undefined = undefined;
    if (sourceCoverPath && fs.existsSync(sourceCoverPath)) {
      // Create covers directory if it doesn't exist
      const coversDir = path.join(process.cwd(), 'public', 'resources', 'covers');
      if (!fs.existsSync(coversDir)) {
        fs.mkdirSync(coversDir, { recursive: true });
      }

      // Generate unique filename for cover image
      const coverOriginalName = path.basename(sourceCoverPath);
      const coverExt = path.extname(coverOriginalName);
      const coverBaseName = path.basename(coverOriginalName, coverExt);
      const sanitizedCoverBaseName = coverBaseName.replace(/[^a-zA-Z0-9-_]/g, '_');
      const coverFilename = `${sanitizedCoverBaseName}_${timestamp}${coverExt}`;
      const destCoverPath = path.join(coversDir, coverFilename);

      // Copy cover image to destination
      fs.copyFileSync(sourceCoverPath, destCoverPath);

      coverImagePath = `/resources/covers/${coverFilename}`;
    }

    // Parse tags
    const tagArray = tags ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [];

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if slug already exists
    const existingResource = await Resource.findOne({ slug });
    if (existingResource) {
      return res.status(400).json({ 
        error: 'A resource with this title already exists. Please choose a different title.' 
      });
    }

    // Save to database with new structure
    const resourceData: any = {
      title,
      description,
      type: finalType, // Use the normalized type
      slug,
      category: category || 'Other', // Default category if not provided
      filePath: resourceFilePath, // For scanned resources, use filePath
      fileUrl: finalType !== 'scanned' ? resourceFilePath : undefined, // Only set fileUrl for non-scanned resources
      tags: tagArray,
      gated: gated === 'true' || false, // Default to false
      status: status || 'draft', // Default to draft for imported resources
    };

    if (coverImagePath) {
      resourceData.coverImage = coverImagePath;
    }

    const resource = await Resource.create(resourceData);

    return res.status(201).json({ 
      success: true, 
      resource,
      message: 'Resource imported successfully'
    });

  } catch (error: unknown) {
    // Log full error stack for debugging
    console.error('Import resource error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    
    // Return clean error message to UI
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Invalid resource data. Please check all fields and try again.' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to import resource. Please try again.' 
    });
  }
}
