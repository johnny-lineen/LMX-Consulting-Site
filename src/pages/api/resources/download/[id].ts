import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid resource ID' });
  }

  try {
    await connectDB();

    // Find resource
    const resource = await Resource.findById(id).lean();

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Get file path - support both relative and absolute paths
    let filePath: string;
    
    if (resource.mainFile && resource.mainFile.startsWith('/')) {
      // Relative path (new system) - convert to absolute
      filePath = path.join(process.cwd(), 'public', resource.mainFile);
      console.log('[DOWNLOAD] Using mainFile (relative):', resource.mainFile);
      console.log('[DOWNLOAD] Resolved to:', filePath);
    } else if (resource.filePath.startsWith('/')) {
      // Relative path in filePath
      filePath = path.join(process.cwd(), 'public', resource.filePath);
      console.log('[DOWNLOAD] Using filePath (relative):', resource.filePath);
      console.log('[DOWNLOAD] Resolved to:', filePath);
    } else {
      // Absolute path (old system)
      filePath = resource.filePath;
      console.log('[DOWNLOAD] Using absolute path:', filePath);
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('[DOWNLOAD] File not found:', filePath);
      console.error('[DOWNLOAD] Resource:', resource);
      return res.status(404).json({ 
        error: 'Resource file not found',
        details: 'The file may have been moved or deleted'
      });
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = resource.mainFile ? path.basename(resource.mainFile) : path.basename(filePath);
    const fileExtension = path.extname(fileName).toLowerCase();

    console.log('[DOWNLOAD] Serving file:', fileName);
    console.log('[DOWNLOAD] Size:', fileBuffer.length, 'bytes');

    // Set content type based on file extension
    const contentTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.zip': 'application/zip',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    };

    const contentType = contentTypes[fileExtension] || 'application/octet-stream';

    // Set headers for download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', fileBuffer.length);

    // Send file
    return res.status(200).send(fileBuffer);

  } catch (error: any) {
    console.error('[DOWNLOAD] Error:', error);
    return res.status(500).json({ 
      error: 'Failed to download resource',
      details: error.message 
    });
  }
}