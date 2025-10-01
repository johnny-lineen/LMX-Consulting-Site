import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource, IResource } from '@/models/Resource';
import { requireAdmin } from '@/utils/adminAuth';
import fs from 'fs';
import path from 'path';

const BASE_RESOURCES_FOLDER = path.join(process.cwd(), 'resources');

interface StructuredResource {
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  mainFile: string;
  mainFilePath: string;
  coverImage?: string;
  imagesCount: number;
  fileSize: number;
}

/**
 * Scan structured resource folders
 */
async function scanStructuredFolders(): Promise<StructuredResource[]> {
  const resources: StructuredResource[] = [];

  console.log('[SCAN STRUCTURED] ======================================');
  console.log('[SCAN STRUCTURED] Starting structured scan');
  console.log('[SCAN STRUCTURED] Base path:', BASE_RESOURCES_FOLDER);
  console.log('[SCAN STRUCTURED] ======================================');

  // Check if base folder exists
  if (!fs.existsSync(BASE_RESOURCES_FOLDER)) {
    console.log('[SCAN STRUCTURED] Creating base resources folder...');
    fs.mkdirSync(BASE_RESOURCES_FOLDER, { recursive: true });
  }

  // Scan category folders (ebooks, checklists, guides, etc.)
  const categoryFolders = ['ebooks', 'checklists', 'guides', 'notion-templates', 'toolkits'];

  for (const category of categoryFolders) {
    const categoryPath = path.join(BASE_RESOURCES_FOLDER, category);

    if (!fs.existsSync(categoryPath)) {
      console.log(`[SCAN STRUCTURED] Category folder not found: ${category}`);
      continue;
    }

    console.log(`[SCAN STRUCTURED] Scanning category: ${category}`);

    // Get all resource folders in this category
    const entries = fs.readdirSync(categoryPath, { withFileTypes: true });
    const resourceFolders = entries.filter(entry => entry.isDirectory() && !entry.name.startsWith('.'));

    console.log(`[SCAN STRUCTURED] Resource folders in ${category}:`, resourceFolders.length);

    for (const folder of resourceFolders) {
      const resourcePath = path.join(categoryPath, folder.name);
      const metadataPath = path.join(resourcePath, 'metadata.json');

      // Check if already imported to database
      const slug = folder.name;
      const existingResource = await Resource.findOne({ 
        filePath: new RegExp(slug, 'i') 
      }).lean<IResource | null>();

      if (existingResource) {
        console.log(`[SCAN STRUCTURED] Skipping already imported: ${slug}`);
        continue;
      }

      // Read metadata.json if exists
      let metadata: any = null;
      if (fs.existsSync(metadataPath)) {
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
          metadata = JSON.parse(metadataContent);
          console.log(`[SCAN STRUCTURED] ✓ Read metadata for: ${slug}`);
        } catch (error: unknown) {
          console.log(`[SCAN STRUCTURED] Could not read metadata for: ${slug}`);
        }
      }

      // Find main file
      const files = fs.readdirSync(resourcePath).filter(f => !f.startsWith('.') && f !== 'images');
      const mainFile = files.find(f => f.startsWith('main.') || f.match(/\.(pdf|docx|xlsx|zip)$/i));

      if (!mainFile) {
        console.log(`[SCAN STRUCTURED] No main file found in: ${slug}`);
        continue;
      }

      const mainFilePath = path.join(resourcePath, mainFile);
      const stats = fs.statSync(mainFilePath);

      // Check for images
      const imagesPath = path.join(resourcePath, 'images');
      let imagesCount = 0;
      let coverImage: string | undefined = undefined;

      if (fs.existsSync(imagesPath)) {
        const imageFiles = fs.readdirSync(imagesPath);
        imagesCount = imageFiles.length;

        // Look for cover image
        const coverFile = imageFiles.find(img => 
          img.toLowerCase().includes('cover') || 
          img.toLowerCase().includes('artwork')
        ) || imageFiles[0]; // Use first image as fallback

        if (coverFile) {
          coverImage = path.join(imagesPath, coverFile);
        }
      }

      // Build resource object
      const resource: StructuredResource = {
        slug,
        category,
        title: metadata?.title || folder.name,
        description: metadata?.description || `Resource from ${folder.name}`,
        tags: metadata?.tags || [],
        mainFile,
        mainFilePath,
        coverImage,
        imagesCount,
        fileSize: stats.size,
      };

      resources.push(resource);
      console.log(`[SCAN STRUCTURED] ✓ Added: ${resource.title}`);
    }
  }

  console.log('[SCAN STRUCTURED] ======================================');
  console.log('[SCAN STRUCTURED] Scan complete. Resources found:', resources.length);
  console.log('[SCAN STRUCTURED] ======================================');

  return resources;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin authentication
  const isAdmin = await requireAdmin(req, res);
  if (!isAdmin) return;

  try {
    await connectDB();

    const resources = await scanStructuredFolders();

    return res.status(200).json({
      success: true,
      basePath: BASE_RESOURCES_FOLDER,
      resourcesFound: resources.length,
      resources,
    });

  } catch (error: unknown) {
    console.error('[SCAN STRUCTURED API] Error:', error);
    return res.status(500).json({
      error: 'Failed to scan structured folders',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
