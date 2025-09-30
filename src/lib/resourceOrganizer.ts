import fs from 'fs';
import path from 'path';

/**
 * Generate a URL-friendly slug from a title
 * Example: "30 Day Customer Retention" -> "30-day-customer-retention"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Remove multiple hyphens
    .trim();
}

/**
 * Generate a clean title from folder/file name
 * Example: "30-Day-Customer-Retention" -> "30 Day Customer Retention"
 */
export function generateTitle(name: string): string {
  // Remove common suffixes
  let cleaned = name
    .replace(/\.(pdf|docx|xlsx|zip|png|jpg)$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Title case
  cleaned = cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
  
  return cleaned;
}

/**
 * Extract keywords/tags from title
 */
export function extractTags(title: string): string[] {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'for', 'to', 'of', 'in', 'on', 'at'];
  
  return title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !commonWords.includes(word))
    .filter(word => !word.match(/^\d+$/)) // Remove pure numbers
    .slice(0, 5); // Max 5 tags
}

/**
 * Detect resource type from folder structure or filename
 */
export function detectCategory(folderName: string): string {
  const name = folderName.toLowerCase();
  
  if (name.includes('guide')) return 'guides';
  if (name.includes('checklist')) return 'checklists';
  if (name.includes('ebook') || name.includes('book')) return 'ebooks';
  if (name.includes('template') || name.includes('notion')) return 'notion-templates';
  if (name.includes('toolkit')) return 'toolkits';
  
  return 'ebooks'; // Default
}

/**
 * Find the main resource file (PDF, DOCX, XLSX, or ZIP)
 */
export function findMainFile(files: string[]): string | null {
  const priorities = ['.pdf', '.docx', '.xlsx', '.zip'];
  
  for (const ext of priorities) {
    const found = files.find(f => f.toLowerCase().endsWith(ext) && !f.startsWith('.'));
    if (found) return found;
  }
  
  return null;
}

/**
 * Find all image files
 */
export function findImageFiles(files: string[]): string[] {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  return files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return imageExtensions.includes(ext) && !f.startsWith('.');
  });
}

/**
 * Create metadata.json for a resource
 */
export function createMetadata(params: {
  title: string;
  description?: string;
  tags?: string[];
  category: string;
  mainFile: string;
  hasImages: boolean;
}): object {
  return {
    title: params.title,
    description: params.description || `Auto-generated description for ${params.title}`,
    tags: params.tags || extractTags(params.title),
    category: params.category,
    mainFile: params.mainFile,
    hasImages: params.hasImages,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Process a single resource folder from /import
 */
export async function processResourceFolder(
  sourcePath: string,
  basePath: string
): Promise<{
  success: boolean;
  resourcePath?: string;
  metadata?: any;
  error?: string;
}> {
  try {
    const folderName = path.basename(sourcePath);
    console.log(`[ORGANIZE] Processing folder: ${folderName}`);

    // Read folder contents
    const files = fs.readdirSync(sourcePath);
    console.log(`[ORGANIZE] Files found:`, files.length);

    // Find main file
    const mainFile = findMainFile(files);
    if (!mainFile) {
      console.log(`[ORGANIZE] No main file found in ${folderName}`);
      return { success: false, error: 'No PDF, DOCX, XLSX, or ZIP file found' };
    }

    console.log(`[ORGANIZE] Main file: ${mainFile}`);

    // Find images
    const images = findImageFiles(files);
    console.log(`[ORGANIZE] Images found:`, images.length);

    // Generate metadata
    const title = generateTitle(folderName);
    const category = detectCategory(folderName);
    const slug = generateSlug(title);

    console.log(`[ORGANIZE] Title: ${title}`);
    console.log(`[ORGANIZE] Category: ${category}`);
    console.log(`[ORGANIZE] Slug: ${slug}`);

    // Create destination folder structure
    const categoryPath = path.join(basePath, category);
    const resourcePath = path.join(categoryPath, slug);
    const imagesPath = path.join(resourcePath, 'images');

    // Create directories
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }
    if (!fs.existsSync(resourcePath)) {
      fs.mkdirSync(resourcePath, { recursive: true });
    }
    if (images.length > 0 && !fs.existsSync(imagesPath)) {
      fs.mkdirSync(imagesPath, { recursive: true });
    }

    // Copy main file
    const mainFileExt = path.extname(mainFile);
    const mainFileName = `main${mainFileExt}`;
    const mainFileDest = path.join(resourcePath, mainFileName);
    
    fs.copyFileSync(path.join(sourcePath, mainFile), mainFileDest);
    console.log(`[ORGANIZE] ✓ Copied main file: ${mainFileName}`);

    // Copy images
    for (const image of images) {
      const imageDest = path.join(imagesPath, image);
      fs.copyFileSync(path.join(sourcePath, image), imageDest);
      console.log(`[ORGANIZE] ✓ Copied image: ${image}`);
    }

    // Create metadata.json
    const metadata = createMetadata({
      title,
      category,
      mainFile: mainFileName,
      hasImages: images.length > 0,
    });

    const metadataPath = path.join(resourcePath, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`[ORGANIZE] ✓ Created metadata.json`);

    return {
      success: true,
      resourcePath,
      metadata,
    };

  } catch (error: any) {
    console.error(`[ORGANIZE] Error processing folder:`, error);
    return {
      success: false,
      error: error.message,
    };
  }
}
