import { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/utils/adminAuth';
import { processResourceFolder } from '@/lib/resourceOrganizer';
import fs from 'fs';
import path from 'path';

const IMPORT_FOLDER = path.join(process.cwd(), 'resources', 'import');
const BASE_RESOURCES_FOLDER = path.join(process.cwd(), 'resources');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin authentication
  const isAdmin = await requireAdmin(req, res);
  if (!isAdmin) return;

  console.log('[ORGANIZE API] ======================================');
  console.log('[ORGANIZE API] Reorganization request received');
  console.log('[ORGANIZE API] Import folder:', IMPORT_FOLDER);
  console.log('[ORGANIZE API] Base resources folder:', BASE_RESOURCES_FOLDER);
  console.log('[ORGANIZE API] Current working directory:', process.cwd());

  try {
    // Check if import folder exists
    if (!fs.existsSync(IMPORT_FOLDER)) {
      console.log('[ORGANIZE API] Creating import folder...');
      fs.mkdirSync(IMPORT_FOLDER, { recursive: true });
    }

    // Get all folders in import directory
    const entries = fs.readdirSync(IMPORT_FOLDER, { withFileTypes: true });
    const folders = entries.filter(entry => entry.isDirectory() && !entry.name.startsWith('.'));

    console.log('[ORGANIZE API] Folders found in import:', folders.length);

    if (folders.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No folders to process in import directory',
        processed: 0,
      });
    }

    const results = [];

    // Process each folder
    for (const folder of folders) {
      const sourcePath = path.join(IMPORT_FOLDER, folder.name);
      console.log(`[ORGANIZE API] Processing: ${folder.name}`);

      const result = await processResourceFolder(sourcePath, BASE_RESOURCES_FOLDER);
      
      results.push({
        folderName: folder.name,
        ...result,
      });

      // If successful, optionally delete the source folder
      // Commenting out for safety - you can enable this later
      // if (result.success) {
      //   fs.rmSync(sourcePath, { recursive: true, force: true });
      //   console.log(`[ORGANIZE API] ✓ Deleted source folder: ${folder.name}`);
      // }
    }

    console.log('[ORGANIZE API] Processing complete');
    console.log('[ORGANIZE API] Results:', results.length);

    return res.status(200).json({
      success: true,
      processed: results.filter((r: any) => r.success).length,
      failed: results.filter((r: any) => !r.success).length,
      results,
    });

  } catch (error: unknown) {
    console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) console.error(error.stack);
    return res.status(500).json({
      error: 'Failed to organize resources',
      details: 'Internal server error',
    });
  }
}
