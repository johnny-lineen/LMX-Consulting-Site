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
