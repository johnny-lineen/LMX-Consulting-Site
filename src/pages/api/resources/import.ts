import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import { requireAdmin } from '@/utils/adminAuth';
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
    const { title, description, type, tags, sourceFilePath, sourceCoverPath } = req.body;

    // Validate required fields
    if (!title || !description || !type || !sourceFilePath) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate source file exists
    if (!fs.existsSync(sourceFilePath)) {
      return res.status(400).json({ error: 'Source file not found' });
    }

    // Create type directory if it doesn't exist
    const typeDir = path.join(process.cwd(), 'public', 'resources', type);
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

    const resourceFilePath = `/resources/${type}/${filename}`;

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

    // Save to database
    const resourceData: any = {
      title,
      description,
      type,
      filePath: resourceFilePath,
      tags: tagArray,
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
    console.error('Import error:', error);
    return res.status(500).json({ error: 'Failed to import resource' });
  }
}
