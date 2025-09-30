/**
 * ZIP Processing Utilities for Resource Import
 * Requires: adm-zip package (npm install adm-zip)
 */

import fs from 'fs';
import path from 'path';
// @ts-ignore - adm-zip may not have types
import AdmZip from 'adm-zip';

/**
 * Extract ZIP file to a temporary directory
 */
export function extractZip(zipPath: string, extractTo: string): void {
  console.log(`[ZIP] Extracting: ${zipPath}`);
  console.log(`[ZIP] Extract to: ${extractTo}`);
  
  if (!fs.existsSync(extractTo)) {
    fs.mkdirSync(extractTo, { recursive: true });
  }

  const zip = new AdmZip(zipPath);
  zip.extractAllTo(extractTo, true);
  
  console.log(`[ZIP] ✓ Extracted successfully`);
}

/**
 * Find all ZIP files in a directory
 */
export function findZipFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = fs.readdirSync(directory);
  return files
    .filter(f => f.toLowerCase().endsWith('.zip') && !f.startsWith('.'))
    .map(f => path.join(directory, f));
}

/**
 * Move file to destination (with directory creation)
 */
export function moveFile(source: string, destination: string): void {
  const destDir = path.dirname(destination);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.copyFileSync(source, destination);
  console.log(`[MOVE] ${path.basename(source)} → ${destination}`);
}

/**
 * Archive or delete processed ZIP file
 */
export function archiveZip(zipPath: string, archiveDir: string): void {
  const zipName = path.basename(zipPath);
  let archivePath = path.join(archiveDir, zipName);
  
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }
  
  // If file already exists in archive, append timestamp
  if (fs.existsSync(archivePath)) {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '').slice(0, 14);
    const ext = path.extname(zipName);
    const baseName = path.basename(zipName, ext);
    const newName = `${baseName}-${timestamp}${ext}`;
    archivePath = path.join(archiveDir, newName);
    console.log(`[ARCHIVE] File exists, using timestamped name: ${newName}`);
  }
  
  fs.renameSync(zipPath, archivePath);
  console.log(`[ARCHIVE] Moved ${zipName} to archive`);
}

/**
 * Archive a directory (for images folders)
 */
export function archiveDirectory(dirPath: string, archiveDir: string): void {
  if (!fs.existsSync(dirPath)) {
    console.log(`[ARCHIVE] Directory does not exist: ${dirPath}`);
    return;
  }
  
  const dirName = path.basename(dirPath);
  let archivePath = path.join(archiveDir, dirName);
  
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }
  
  // If directory already exists in archive, append timestamp
  if (fs.existsSync(archivePath)) {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '').slice(0, 14);
    const newName = `${dirName}-${timestamp}`;
    archivePath = path.join(archiveDir, newName);
    console.log(`[ARCHIVE] Directory exists, using timestamped name: ${newName}`);
  }
  
  // Copy directory recursively
  copyDirectoryRecursive(dirPath, archivePath);
  
  // Delete original directory after successful copy
  deleteDirectory(dirPath);
  
  console.log(`[ARCHIVE] Moved directory ${dirName} to archive`);
}

/**
 * Copy directory recursively (helper for archiveDirectory)
 */
function copyDirectoryRecursive(source: string, destination: string): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

/**
 * Delete directory recursively
 */
export function deleteDirectory(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`[CLEANUP] Deleted: ${dirPath}`);
  }
}
