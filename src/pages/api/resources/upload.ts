import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import { requireAdmin } from '@/utils/adminAuth';
import fs from 'fs';
import path from 'path';

// Disable body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
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
    const form = new IncomingForm({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB max
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      // Extract fields
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
      const tagsString = Array.isArray(fields.tags) ? fields.tags[0] : fields.tags;
      const tags = tagsString ? tagsString.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [];

      // Validate required fields
      if (!title || !description || !type) {
        return res.status(400).json({ error: 'Missing required fields: title, description, and type are required' });
      }

      // Validate type
      const validTypes = ['ebook', 'checklist', 'notion-template', 'guide', 'toolkit', 'other'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
      }

      // Get uploaded main file
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const uploadedFile = file as FormidableFile;

      // Create type directory if it doesn't exist
      const typeDir = path.join(process.cwd(), 'public', 'resources', type);
      if (!fs.existsSync(typeDir)) {
        fs.mkdirSync(typeDir, { recursive: true });
      }

      // Generate unique filename for main file
      const timestamp = Date.now();
      const originalName = uploadedFile.originalFilename || 'file';
      const ext = path.extname(originalName);
      const baseName = path.basename(originalName, ext);
      const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
      const filename = `${sanitizedBaseName}_${timestamp}${ext}`;
      const filePath = path.join(typeDir, filename);

      // Move main file to destination
      fs.copyFileSync(uploadedFile.filepath, filePath);
      fs.unlinkSync(uploadedFile.filepath);

      const resourceFilePath = `/resources/${type}/${filename}`;

      // Handle optional cover image
      let coverImagePath: string | undefined = undefined;
      const coverImage = Array.isArray(files.coverImage) ? files.coverImage[0] : files.coverImage;
      
      if (coverImage) {
        const uploadedCover = coverImage as FormidableFile;
        
        // Create covers directory if it doesn't exist
        const coversDir = path.join(process.cwd(), 'public', 'resources', 'covers');
        if (!fs.existsSync(coversDir)) {
          fs.mkdirSync(coversDir, { recursive: true });
        }

        // Generate unique filename for cover image
        const coverOriginalName = uploadedCover.originalFilename || 'cover';
        const coverExt = path.extname(coverOriginalName);
        const coverBaseName = path.basename(coverOriginalName, coverExt);
        const sanitizedCoverBaseName = coverBaseName.replace(/[^a-zA-Z0-9-_]/g, '_');
        const coverFilename = `${sanitizedCoverBaseName}_${timestamp}${coverExt}`;
        const coverPath = path.join(coversDir, coverFilename);

        // Move cover image to destination
        fs.copyFileSync(uploadedCover.filepath, coverPath);
        fs.unlinkSync(uploadedCover.filepath);

        coverImagePath = `/resources/covers/${coverFilename}`;
      }

      // Save to database
      const resourceData: any = {
        title,
        description,
        type,
        filePath: resourceFilePath,
        tags,
      };

      if (coverImagePath) {
        resourceData.coverImage = coverImagePath;
      }

      const resource = await Resource.create(resourceData);

      return res.status(201).json({ 
        success: true, 
        resource,
        message: 'Resource uploaded successfully'
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload resource' });
  }
}