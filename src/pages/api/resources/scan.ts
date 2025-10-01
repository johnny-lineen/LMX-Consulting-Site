import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource, IResource } from '@/models/Resource';
import { requireAdmin } from '@/utils/adminAuth';
import { generateDescription } from '@/lib/descriptionGenerator';
import fs from 'fs';
import path from 'path';

// Configurable base folder path with fallback
const getImportBasePath = (): string => {
  const envPath = process.env.RESOURCE_IMPORT_PATH;
  const defaultPath = 'C:/Users/jline/OneDrive/Desktop/resources';
  
  if (envPath) {
    console.log('[SCAN] Using RESOURCE_IMPORT_PATH from environment:', envPath);
    return envPath;
  } else {
    console.log('[SCAN] RESOURCE_IMPORT_PATH not set, using default desktop path:', defaultPath);
    return defaultPath;
  }
};

const DEFAULT_COVER_IMAGE = '/images/default-cover.svg';

/**
 * Generate a clean title from folder name
 */
function generateTitle(folderName: string): string {
  return folderName
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate URL-friendly slug
 */
function generateSlug(folderName: string): string {
  return folderName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Slugify filename (remove spaces, special chars)
 */
function slugifyFilename(filename: string): string {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const slugged = base
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return `${slugged}${ext}`;
}

/**
 * Extract tags from title
 */
function extractTags(title: string): string[] {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'for', 'to', 'of', 'in', 'on', 'at'];
  
  return title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !commonWords.includes(word))
    .filter(word => !word.match(/^\d+$/))
    .slice(0, 5);
}

/**
 * Map category folder names to resource types
 */
function mapCategoryToType(category: string): string {
  const mapping: Record<string, string> = {
    'ebooks': 'ebook',
    'ebook': 'ebook',
    'checklists': 'checklist',
    'checklist': 'checklist',
    'guides': 'guide',
    'guide': 'guide',
    'notion-templates': 'notion-template',
    'notion-template': 'notion-template',
    'toolkits': 'toolkit',
    'toolkit': 'toolkit',
    'other': 'other',
  };
  
  return mapping[category.toLowerCase()] || 'other';
}

/**
 * Find the main resource file in a folder
 */
function findMainFile(folderPath: string): string | null {
  const files = fs.readdirSync(folderPath);
  const priorities = ['.pdf', '.docx', '.xlsx', '.zip'];
  
  for (const ext of priorities) {
    const found = files.find((f: string) => {
      const fPath = path.join(folderPath, f);
      try {
        return fs.statSync(fPath).isFile() && f.toLowerCase().endsWith(ext) && !f.startsWith('.');
      } catch {
        return false;
      }
    });
    if (found) return found;
  }
  
  return null;
}

/**
 * Find cover image in folder (root or images subfolder)
 */
function findCoverImageInFolder(folderPath: string): string | null {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  console.log('[SCAN]   Searching for cover image...');
  
  // Helper to check if file is an image
  const isImageFile = (filename: string) => {
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext) && !filename.startsWith('.');
  };
  
  // Search locations in priority order
  const searchPaths = [
    folderPath,                          // Root folder
    path.join(folderPath, 'images'),     // images/ subfolder
  ];
  
  for (const searchPath of searchPaths) {
    if (!fs.existsSync(searchPath)) {
      console.log(`[SCAN]   Path not found: ${searchPath}`);
      continue;
    }
    
    try {
      const files = fs.readdirSync(searchPath);
      console.log(`[SCAN]   Checking ${searchPath}: ${files.length} files`);
      
      // Priority 1: Files with "cover" in name
      const coverFile = files.find(f => {
        const fPath = path.join(searchPath, f);
        try {
          return fs.statSync(fPath).isFile() && 
                 isImageFile(f) && 
                 f.toLowerCase().includes('cover');
        } catch {
          return false;
        }
      });
      
      if (coverFile) {
        console.log(`[SCAN]   ✓ Found cover image (by name): ${coverFile}`);
        return path.join(searchPath, coverFile);
      }
      
      // Priority 2: Files with "artwork" in name
      const artworkFile = files.find(f => {
        const fPath = path.join(searchPath, f);
        try {
          return fs.statSync(fPath).isFile() && 
                 isImageFile(f) && 
                 f.toLowerCase().includes('artwork');
        } catch {
          return false;
        }
      });
      
      if (artworkFile) {
        console.log(`[SCAN]   ✓ Found cover image (artwork): ${artworkFile}`);
        return path.join(searchPath, artworkFile);
      }
      
      // Priority 3: First image file
      const firstImage = files.find(f => {
        const fPath = path.join(searchPath, f);
        try {
          return fs.statSync(fPath).isFile() && isImageFile(f);
        } catch {
          return false;
        }
      });
      
      if (firstImage) {
        console.log(`[SCAN]   ✓ Found cover image (first image): ${firstImage}`);
        return path.join(searchPath, firstImage);
      }
    } catch (error: unknown) {
      console.log(`[SCAN]   Error reading ${searchPath}:`, error instanceof Error ? error.message : String(error));
    }
  }
  
  console.log('[SCAN]   ✗ No cover image found in folder');
  return null;
}

/**
 * Copy cover image to standard location and return relative path
 */
function copyCoverImageToPublic(
  sourcePath: string,
  slug: string
): string {
  const publicCoversDir = path.join(process.cwd(), 'public', 'resources', 'covers');
  
  // Ensure covers directory exists
  if (!fs.existsSync(publicCoversDir)) {
    fs.mkdirSync(publicCoversDir, { recursive: true });
  }
  
  const ext = path.extname(sourcePath);
  const timestamp = Date.now();
  const sluggedFilename = `${slug}_${timestamp}${ext}`;
  const destPath = path.join(publicCoversDir, sluggedFilename);
  
  // Copy file
  fs.copyFileSync(sourcePath, destPath);
  console.log('[SCAN]   ✓ Copied cover to:', `/resources/covers/${sluggedFilename}`);
  
  // Return relative path
  return `/resources/covers/${sluggedFilename}`;
}

/**
 * Scan a category folder and import subdirectories as resources
 */
async function scanCategoryFolder(
  basePath: string, 
  category: string
): Promise<{ imported: any[], skipped: string[] }> {
  const imported: any[] = [];
  const skipped: string[] = [];
  
  const categoryPath = path.join(basePath, category);
  
  if (!fs.existsSync(categoryPath)) {
    console.log(`[SCAN] Category folder not found: ${category}`);
    return { imported, skipped };
  }

  console.log(`[SCAN] ======================================`);
  console.log(`[SCAN] Scanning category: ${category}`);
  console.log(`[SCAN] Path: ${categoryPath}`);
  
  const entries = fs.readdirSync(categoryPath, { withFileTypes: true });
  const resourceFolders = entries.filter(entry => entry.isDirectory() && !entry.name.startsWith('.'));
  
  console.log(`[SCAN] Resource folders found: ${resourceFolders.length}`);
  
  const resourceType = mapCategoryToType(category);

  for (const folder of resourceFolders) {
    const folderName = folder.name;
    const folderPath = path.join(categoryPath, folderName);
    const slug = generateSlug(folderName);
    const title = generateTitle(folderName);
    
    console.log(`[SCAN] ──────────────────────────────────────`);
    console.log(`[SCAN] Processing: ${folderName}`);
    console.log(`[SCAN]   - Title: ${title}`);
    console.log(`[SCAN]   - Slug: ${slug}`);
    
    // Check if already exists in database
    const existingResource = await Resource.findOne({
      $or: [
        { folderPath: folderPath },
        { slug: slug },
        { title: title }
      ]
    }).lean<IResource | null>();
    
    if (existingResource) {
      console.log(`[SCAN]   ⚠️ Skipped: Already exists in database (slug: ${existingResource.slug})`);
      skipped.push(folderName);
      continue;
    }
    
    // Find main file
    const mainFileName = findMainFile(folderPath);
    if (!mainFileName) {
      console.log(`[SCAN]   ⚠️ Skipped: No main file (PDF/DOCX/XLSX/ZIP) found`);
      skipped.push(folderName);
      continue;
    }
    
    console.log(`[SCAN]   - Main file: ${mainFileName}`);
    const mainFilePath = path.join(folderPath, mainFileName);
    
    // Find and process cover image
    let coverImagePath: string = DEFAULT_COVER_IMAGE;
    const foundCoverPath = findCoverImageInFolder(folderPath);
    
    if (foundCoverPath) {
      try {
        // Copy to public/resources/covers and get relative path
        coverImagePath = copyCoverImageToPublic(foundCoverPath, slug);
      } catch (error: unknown) {
        console.log(`[SCAN]   ⚠️ Error copying cover image: ${error instanceof Error ? error.message : String(error)}`);
        console.log(`[SCAN]   Using default placeholder`);
        coverImagePath = DEFAULT_COVER_IMAGE;
      }
    } else {
      console.log(`[SCAN]   Using default placeholder cover`);
      coverImagePath = DEFAULT_COVER_IMAGE;
    }
    
    // Generate metadata
    const tags = extractTags(title);
    const description = generateDescription(title, resourceType);
    
    console.log(`[SCAN]   - Tags:`, tags);
    console.log(`[SCAN]   - Description:`, description.substring(0, 80) + '...');
    console.log(`[SCAN]   - Cover image path:`, coverImagePath);
    
    // Create resource document
    try {
      const resource = await Resource.create({
        title,
        description,
        type: resourceType,
        slug,
        filePath: mainFilePath,
        folderPath,
        mainFile: mainFileName,
        coverImage: coverImagePath,
        tags,
      });
      
      console.log(`[SCAN]   ✅ Inserted to MongoDB: ${resource._id}`);
      
      imported.push({
        id: resource._id,
        title: resource.title,
        type: resource.type,
        slug: resource.slug,
        folderPath: resource.folderPath,
        mainFile: resource.mainFile,
        coverImage: resource.coverImage,
        tags: resource.tags,
      });
      
    } catch (error: unknown) {
      console.error(`[SCAN]   ❌ Failed to insert: ${error instanceof Error ? error.message : String(error)}`);
      skipped.push(folderName);
    }
  }
  
  console.log(`[SCAN] Category ${category} complete: ${imported.length} imported, ${skipped.length} skipped`);
  console.log(`[SCAN] ======================================`);
  
  return { imported, skipped };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin authentication
  const isAdmin = await requireAdmin(req, res);
  if (!isAdmin) return;

  console.log('[SCAN API] ======================================');
  console.log('[SCAN API] Resource scan and import request received');
  console.log('[SCAN API] Environment:', process.env.NODE_ENV);
  console.log('[SCAN API] Current working directory:', process.cwd());
  
  const IMPORT_BASE_FOLDER = getImportBasePath();
  console.log('[SCAN API] Import base folder:', IMPORT_BASE_FOLDER);
  console.log('[SCAN API] Resolved path:', path.resolve(IMPORT_BASE_FOLDER));
  
  // Check if path exists
  const pathExists = fs.existsSync(IMPORT_BASE_FOLDER);
  console.log('[SCAN API] Path exists:', pathExists);
  
  if (!pathExists) {
    console.error('[SCAN API] ❌ Path does not exist!');
    console.error('[SCAN API] Attempted path:', IMPORT_BASE_FOLDER);
    console.error('[SCAN API] Current directory:', process.cwd());
    
    return res.status(500).json({
      error: 'Import folder not found',
      details: `Folder does not exist: ${IMPORT_BASE_FOLDER}`,
      attemptedPath: IMPORT_BASE_FOLDER,
      resolvedPath: path.resolve(IMPORT_BASE_FOLDER),
      currentWorkingDirectory: process.cwd(),
      suggestion: `Create the folder or set RESOURCE_IMPORT_PATH in .env.local`
    });
  }

  console.log('[SCAN API] ======================================');

  try {
    await connectDB();
    console.log('[SCAN API] Database connected');

    const allImported: any[] = [];
    const allSkipped: string[] = [];

    // Scan each category folder
    const categories = ['ebooks', 'checklists', 'guides', 'notion-templates', 'toolkits', 'other'];
    
    for (const category of categories) {
      const result = await scanCategoryFolder(IMPORT_BASE_FOLDER, category);
      allImported.push(...result.imported);
      allSkipped.push(...result.skipped);
    }

    console.log('[SCAN API] ======================================');
    console.log('[SCAN API] Scan complete');
    console.log('[SCAN API] Total imported:', allImported.length);
    console.log('[SCAN API] Total skipped:', allSkipped.length);
    console.log('[SCAN API] ======================================');

    return res.status(200).json({
      success: true,
      basePath: IMPORT_BASE_FOLDER,
      imported: allImported.length,
      skipped: allSkipped.length,
      resources: allImported,
      skippedFolders: allSkipped,
      message: `Imported ${allImported.length} new resource(s). Skipped ${allSkipped.length} existing/invalid resource(s).`
    });

  } catch (error: unknown) {
    console.error('[SCAN API] ❌ Scan error caught:');
    console.error('[SCAN API] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[SCAN API] Error stack:', error.stack);
    console.error('[SCAN API] Error code:', error.code);
    
    return res.status(500).json({ 
      error: 'Failed to scan and import resources',
      details: error.message,
      errorCode: error.code || 'UNKNOWN',
      attemptedPath: IMPORT_BASE_FOLDER,
      currentWorkingDirectory: process.cwd()
    });
  }
}