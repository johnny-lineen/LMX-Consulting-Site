/**
 * Reusable resource type definitions
 */

export interface ResourceMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
  mainFile: string;
  hasImages: boolean;
  createdAt: string;
}

export interface ProcessResourceResult {
  success: boolean;
  resourcePath?: string;
  metadata?: ResourceMetadata;
  error?: string;
}

// New resource type for frontend
export interface PublicResource {
  id: string;
  title: string;
  description: string;
  type: 'notion' | 'ebook' | 'cheatsheet' | 'video' | 'scanned';
  slug: string;
  category: string;
  fileUrl?: string; // Optional for scanned resources
  coverImage: string;
  images?: string[];
  tags: string[];
  gated: boolean;
  status: 'draft' | 'live' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Resource type labels for UI
export const RESOURCE_TYPE_LABELS: Record<string, string> = {
  'notion': 'Notion Template',
  'ebook': 'E-Book',
  'cheatsheet': 'Cheat Sheet',
  'video': 'Video',
  'scanned': 'Scanned Resource',
};

// Resource button text based on type
export const RESOURCE_BUTTON_TEXT: Record<string, string> = {
  'notion': 'Open in Notion',
  'ebook': 'Download PDF',
  'cheatsheet': 'Get Cheat Sheet',
  'video': 'Watch Video',
  'scanned': 'Download',
};