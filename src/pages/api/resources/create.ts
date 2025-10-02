import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import { requireAdmin } from '@/utils/adminAuth';
import { normalizeTypeValue, isValidTypeValue, getTypeValidationError } from '@/lib/resourceTypeMapper';
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
        console.error('[ERROR]:', err instanceof Error ? err.message : String(err));
        if (err instanceof Error) console.error(err.stack);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      // Extract fields
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
      const fileUrl = Array.isArray(fields.fileUrl) ? fields.fileUrl[0] : fields.fileUrl;
      const tagsString = Array.isArray(fields.tags) ? fields.tags[0] : fields.tags;
      const gated = Array.isArray(fields.gated) ? fields.gated[0] : fields.gated;
      const status = Array.isArray(fields.status) ? fields.status[0] : fields.status;
      
      const tags = tagsString ? tagsString.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [];

      // Validate required fields
      if (!title || !description || !type || !category) {
        return res.status(400).json({ 
          error: 'Missing required fields: title, description, type, and category are required' 
        });
      }

      // Normalize and validate type
      const normalizedType = normalizeTypeValue(type);
      if (!isValidTypeValue(type)) {
        console.error('Invalid type value received:', { originalType: type, normalizedType });
        return res.status(400).json({ 
          error: getTypeValidationError()
        });
      }
      
      // Use the normalized type
      const finalType = normalizedType;

      // Validate status
      const validStatuses = ['draft', 'live', 'archived'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
      }

      // Type-specific validation with clean error messages
      if (finalType === 'notion') {
        if (!fileUrl) {
          return res.status(400).json({ 
            error: 'Notion templates must include a valid Notion link.' 
          });
        }
        if (!fileUrl.includes('notion.so') && !fileUrl.includes('notion.site')) {
          return res.status(400).json({ 
            error: 'Notion templates must include a valid Notion link.' 
          });
        }
      }

      if (finalType === 'ebook') {
        if (!fileUrl) {
          return res.status(400).json({ 
            error: 'Ebooks must include a valid PDF link.' 
          });
        }
        if (!fileUrl.endsWith('.pdf') && !fileUrl.includes('.pdf')) {
          return res.status(400).json({ 
            error: 'Ebooks must include a valid PDF link.' 
          });
        }
      }

      // For cheatsheet and video types, require either fileUrl or file upload
      if (['cheatsheet', 'video'].includes(finalType)) {
        if (!fileUrl) {
          const file = Array.isArray(files.file) ? files.file[0] : files.file;
          if (!file) {
            return res.status(400).json({ 
              error: 'Either file URL or file upload is required for this resource type' 
            });
          }
        }
      }

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

      let finalFileUrl = fileUrl;

      // Handle optional file upload
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (file) {
        const uploadedFile = file as FormidableFile;

        // Create type directory if it doesn't exist
        const typeDir = path.join(process.cwd(), 'public', 'resources', finalType);
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

        // Use the uploaded file URL instead of provided fileUrl
        finalFileUrl = `/resources/${finalType}/${filename}`;
      }

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
        const timestamp = Date.now();
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
        type: finalType, // Use the normalized type
        slug,
        category,
        fileUrl: finalFileUrl,
        tags,
        gated: gated === 'true',
        status,
      };

      if (coverImagePath) {
        resourceData.coverImage = coverImagePath;
      }

      const resource = await Resource.create(resourceData);

      return res.status(201).json({ 
        success: true, 
        resource,
        message: 'Resource created successfully'
      });
    });
  } catch (error: unknown) {
    // Log full error stack for debugging
    console.error('Create resource error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    
    // Return clean error message to UI
    if (error instanceof Error && error.name === 'ValidationError') {
      // Check for specific validation errors
      const errorMessage = error.message;
      if (errorMessage.includes('type')) {
        return res.status(400).json({ 
          error: getTypeValidationError()
        });
      }
      return res.status(400).json({ 
        error: 'Invalid resource data. Please check all fields and try again.' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to create resource. Please try again.' 
    });
  }
}
