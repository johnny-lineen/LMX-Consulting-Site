/**
 * Cover Image Helper
 * Provides type-specific default cover images for resources
 */

export type FileType = 'pdf' | 'docx' | 'xlsx' | 'zip' | 'other';

/**
 * Get the appropriate default cover image based on file type
 */
export function getDefaultCoverForFileType(fileExtension: string): string {
  const ext = fileExtension.toLowerCase().replace('.', '');
  
  const coverMap: Record<string, string> = {
    'pdf': '/images/covers/pdf-cover.svg',
    'doc': '/images/covers/docx-cover.svg',
    'docx': '/images/covers/docx-cover.svg',
    'xls': '/images/covers/xlsx-cover.svg',
    'xlsx': '/images/covers/xlsx-cover.svg',
    'zip': '/images/covers/zip-cover.svg',
  };
  
  return coverMap[ext] || '/images/default-cover.svg';
}

/**
 * Detect file extension from filename or path
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

/**
 * Get cover image for a resource
 * Priority: custom cover > type-specific default > generic default
 */
export function getCoverImage(customCover: string | undefined, mainFile: string | undefined): string {
  // If custom cover exists, use it
  if (customCover && customCover !== '/images/default-cover.svg') {
    return customCover;
  }
  
  // If main file exists, use type-specific default
  if (mainFile) {
    const ext = getFileExtension(mainFile);
    if (ext) {
      return getDefaultCoverForFileType(ext);
    }
  }
  
  // Fallback to generic default
  return '/images/default-cover.svg';
}

/**
 * Common image extensions for cover detection
 */
export const COVER_IMAGE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'
];

/**
 * Check if a file is a valid cover image
 */
export function isCoverImage(filename: string): boolean {
  const ext = '.' + getFileExtension(filename).toLowerCase();
  return COVER_IMAGE_EXTENSIONS.includes(ext);
}
