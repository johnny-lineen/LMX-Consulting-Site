import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import { requireAdmin } from '@/utils/adminAuth';
import { generateSlug, generateTitle, extractTags } from '@/lib/resourceOrganizer';
import { extractZip, findZipFiles, moveFile, archiveZip, archiveDirectory, deleteDirectory } from '@/lib/zipProcessor';
import { generateDescription } from '@/lib/descriptionGenerator';
import { getDefaultCoverForFileType, getFileExtension } from '@/lib/coverImageHelper';
import fs from 'fs';
import path from 'path';

const DESKTOP_IMPORT_PATH = process.env.RESOURCE_IMPORT_PATH || 'C:/Users/jline/OneDrive/Desktop/resources';
const ARCHIVE_PATH = path.join(DESKTOP_IMPORT_PATH, 'archive');
const PUBLIC_RESOURCES_PATH = path.join(process.cwd(), 'public', 'resources');
const TEMP_EXTRACT_PATH = path.join(process.cwd(), 'temp', 'extracts');

const DEFAULT_COVER = '/images/default-cover.svg';

/**
 * Find main resource file in extracted contents
 */
function findMainFile(files: string[]): { file: string; relativePath: string } | null {
  const priorities = ['.pdf', '.docx', '.xlsx', '.zip'];
  
  for (const ext of priorities) {
    const found = files.find(f => {
      const filename = path.basename(f);
      return filename.toLowerCase().endsWith(ext) && !filename.startsWith('.');
    });
    if (found) {
      return { file: found, relativePath: path.basename(found) };
    }
  }
  
  return null;
}

/**
 * Find cover image in extracted contents
 */
function findCoverImage(files: string[]): { file: string; relativePath: string } | null {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  // Priority 1: Files with "cover" in name
  const coverFile = files.find(f => {
    const filename = path.basename(f).toLowerCase();
    const ext = path.extname(filename);
    return imageExtensions.includes(ext) && 
           (filename.includes('cover') || filename.includes('artwork')) &&
           !filename.startsWith('.');
  });
  
  if (coverFile) {
    return { file: coverFile, relativePath: path.basename(coverFile) };
  }
  
  // Priority 2: First image file
  const firstImage = files.find(f => {
    const filename = path.basename(f);
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext) && !filename.startsWith('.');
  });
  
  if (firstImage) {
    return { file: firstImage, relativePath: path.basename(firstImage) };
  }
  
  return null;
}

/**
 * Get all files recursively from a directory
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

/**
 * Process a single ZIP file
 */
async function processZipFile(zipPath: string): Promise<{
  success: boolean;
  resourceId?: string;
  title?: string;
  error?: string;
}> {
  const zipName = path.basename(zipPath, '.zip');
  console.log(`[PROCESS ZIP] ======================================`);
  console.log(`[PROCESS ZIP] Processing: ${zipName}`);
  
  try {
    // Generate metadata from ZIP name
    const title = generateTitle(zipName);
    const slug = generateSlug(zipName);
    const tags = extractTags(title);
    
    console.log(`[PROCESS ZIP] Title: ${title}`);
    console.log(`[PROCESS ZIP] Slug: ${slug}`);
    
    // Check if already imported
    const existing = await Resource.findOne({ slug }).lean();
    if (existing) {
      console.log(`[PROCESS ZIP] ⚠️ Skipped: Resource with slug "${slug}" already exists`);
      return { success: false, error: 'Already imported' };
    }
    
    // Extract ZIP to temp folder
    const tempExtractDir = path.join(TEMP_EXTRACT_PATH, slug);
    extractZip(zipPath, tempExtractDir);
    
    // Get all extracted files
    const extractedFiles = getAllFiles(tempExtractDir);
    console.log(`[PROCESS ZIP] Extracted files: ${extractedFiles.length}`);
    
    // Find main file
    const mainFileResult = findMainFile(extractedFiles);
    if (!mainFileResult) {
      console.log(`[PROCESS ZIP] ⚠️ No main file found`);
      deleteDirectory(tempExtractDir);
      return { success: false, error: 'No main file found' };
    }
    
    console.log(`[PROCESS ZIP] Main file: ${mainFileResult.relativePath}`);
    
    // Detect category (default to ebooks)
    const category = zipName.toLowerCase().includes('guide') ? 'guide' :
                     zipName.toLowerCase().includes('checklist') ? 'checklist' :
                     zipName.toLowerCase().includes('template') ? 'notion-template' :
                     zipName.toLowerCase().includes('toolkit') ? 'toolkit' :
                     'ebook'; // default
    
    console.log(`[PROCESS ZIP] Category: ${category}`);
    
    // Create destination folder in public/resources
    const resourceDir = path.join(PUBLIC_RESOURCES_PATH, category, slug);
    if (!fs.existsSync(resourceDir)) {
      fs.mkdirSync(resourceDir, { recursive: true });
    }
    
    console.log(`[PROCESS ZIP] Created: ${resourceDir}`);
    
    // Copy main file
    const mainExt = path.extname(mainFileResult.relativePath);
    const mainFileName = `main${mainExt}`;
    const mainFileDest = path.join(resourceDir, mainFileName);
    moveFile(mainFileResult.file, mainFileDest);
    
    // Check for product images folder ({ResourceName}-images/)
    const imagesFolderName = `${zipName}-images`;
    const imagesFolderPath = path.join(DESKTOP_IMPORT_PATH, imagesFolderName);
    let productImages: string[] = [];
    let coverImagePath = DEFAULT_COVER;
    
    if (fs.existsSync(imagesFolderPath)) {
      console.log(`[PROCESS ZIP] ✓ Found product images folder: ${imagesFolderName}`);
      
      // Create images subfolder in resource directory
      const imagesDestDir = path.join(resourceDir, 'images');
      if (!fs.existsSync(imagesDestDir)) {
        fs.mkdirSync(imagesDestDir, { recursive: true });
      }
      
      // Copy all images from product folder
      const imageFiles = fs.readdirSync(imagesFolderPath)
        .filter(file => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file));
      
      console.log(`[PROCESS ZIP] Found ${imageFiles.length} product images`);
      
      imageFiles.forEach((imageFile, index) => {
        const sourcePath = path.join(imagesFolderPath, imageFile);
        const destPath = path.join(imagesDestDir, imageFile);
        fs.copyFileSync(sourcePath, destPath);
        
        const relativePath = `/resources/${category}/${slug}/images/${imageFile}`;
        productImages.push(relativePath);
        
        // Use first image as cover
        if (index === 0) {
          coverImagePath = relativePath;
          console.log(`[PROCESS ZIP] ✓ Cover image: ${imageFile}`);
        }
      });
      
      console.log(`[PROCESS ZIP] ✓ Copied ${productImages.length} product images`);
    } else {
      // No product images folder - check for cover in ZIP
      const coverResult = findCoverImage(extractedFiles);
      
      if (coverResult) {
        // Custom cover image found in ZIP
        const coverExt = path.extname(coverResult.relativePath);
        const coverFileName = `cover${coverExt}`;
        const coverDest = path.join(resourceDir, coverFileName);
        moveFile(coverResult.file, coverDest);
        coverImagePath = `/resources/${category}/${slug}/${coverFileName}`;
        productImages.push(coverImagePath);
        console.log(`[PROCESS ZIP] ✓ Custom cover from ZIP: ${coverFileName}`);
      } else {
        // No custom cover - use type-specific default
        const fileExt = getFileExtension(mainFileName);
        coverImagePath = getDefaultCoverForFileType(fileExt);
        console.log(`[PROCESS ZIP] No custom cover, using type-specific default: ${coverImagePath}`);
      }
    }
    
    // Generate meaningful description
    const description = generateDescription(title, category);
    console.log(`[PROCESS ZIP] Generated description: ${description.substring(0, 100)}...`);
    
    // Generate metadata.json
    const metadata = {
      title,
      description,
      tags,
      type: category,
      slug,
      mainFile: `/resources/${category}/${slug}/${mainFileName}`,
      coverImage: coverImagePath,
      images: productImages,
      createdAt: new Date().toISOString(),
    };
    
    const metadataPath = path.join(resourceDir, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`[PROCESS ZIP] ✓ Created metadata.json`);
    
    // Insert into MongoDB with relative paths
    const resource = await Resource.create({
      title,
      description,
      type: category,
      slug,
      mainFile: `/resources/${category}/${slug}/${mainFileName}`,
      coverImage: coverImagePath,
      images: productImages,
      filePath: `/resources/${category}/${slug}/${mainFileName}`, // Relative path
      tags,
    });
    
    console.log(`[PROCESS ZIP] ✅ Inserted to MongoDB: ${resource._id}`);
    
    // Cleanup temp extraction folder
    deleteDirectory(tempExtractDir);
    
    return {
      success: true,
      resourceId: resource._id.toString(),
      title: resource.title,
      zipName,
      imagesFolderPath: fs.existsSync(imagesFolderPath) ? imagesFolderPath : null,
    };
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PROCESS ZIP] ❌ Error:`, errorMessage);
    console.log(`[PROCESS ZIP] Import failed for ${zipName}, keeping files in /resources-import/`);
    return {
      success: false,
      error: errorMessage,
      zipName,
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin authentication
  const isAdmin = await requireAdmin(req, res);
  if (!isAdmin) return;

  console.log('[IMPORT ZIPS API] ======================================');
  console.log('[IMPORT ZIPS API] ZIP import request received');
  console.log('[IMPORT ZIPS API] Desktop import path:', DESKTOP_IMPORT_PATH);
  console.log('[IMPORT ZIPS API] Public resources path:', PUBLIC_RESOURCES_PATH);
  
  try {
    await connectDB();
    
    // Check if desktop import folder exists
    if (!fs.existsSync(DESKTOP_IMPORT_PATH)) {
      return res.status(500).json({
        error: 'Import folder not found',
        details: `Desktop import folder does not exist: ${DESKTOP_IMPORT_PATH}`,
        suggestion: 'Create the folder or set RESOURCE_IMPORT_PATH in .env.local'
      });
    }
    
    // Find all ZIP files
    const zipFiles = findZipFiles(DESKTOP_IMPORT_PATH);
    console.log(`[IMPORT ZIPS API] ZIP files found: ${zipFiles.length}`);
    
    if (zipFiles.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No ZIP files found in import folder',
        imported: 0,
        skipped: 0,
        resources: [],
      });
    }
    
    const results = [];
    
    // Process each ZIP file
    for (const zipPath of zipFiles) {
      const result = await processZipFile(zipPath);
      results.push({
        zipName: path.basename(zipPath),
        ...result,
      });
      
      // If successful, archive both ZIP and images folder
      if (result.success) {
        try {
          // Archive ZIP file
          archiveZip(zipPath, ARCHIVE_PATH);
          console.log(`[ARCHIVE] ✓ Archived zip: ${result.zipName}`);
          
          // Archive images folder if it exists
          if (result.imagesFolderPath) {
            const imagesFolderName = path.basename(result.imagesFolderPath);
            archiveDirectory(result.imagesFolderPath, ARCHIVE_PATH);
            console.log(`[ARCHIVE] ✓ Archived images folder: ${imagesFolderName}`);
          } else {
            console.log(`[ARCHIVE] No images folder to archive for ${result.zipName}`);
          }
        } catch (archiveError: unknown) {
          console.log(`[ARCHIVE] ⚠️ Could not archive files: ${archiveError instanceof Error ? archiveError.message : String(archiveError)}`);
          // Continue even if archiving fails - resource is already imported
        }
      } else {
        console.log(`[ARCHIVE] ✗ Import failed for ${result.zipName}, keeping files in /resources-import/`);
      }
    }
    
    const imported = results.filter(r => r.success).length;
    const skipped = results.filter(r => !r.success).length;
    
    console.log('[IMPORT ZIPS API] ======================================');
    console.log(`[IMPORT ZIPS API] Processing complete`);
    console.log(`[IMPORT ZIPS API] Imported: ${imported}, Skipped: ${skipped}`);
    console.log('[IMPORT ZIPS API] ======================================');
    
    return res.status(200).json({
      success: true,
      message: `Processed ${zipFiles.length} ZIP file(s). Imported ${imported}, skipped ${skipped}.`,
      imported,
      skipped,
      results,
    });
    
  } catch (error: unknown) {
    console.error('[IMPORT ZIPS API] Error:', error);
    return res.status(500).json({
      error: 'Failed to process ZIP files',
      details: error.message,
    });
  }
}
